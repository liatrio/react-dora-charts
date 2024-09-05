import React, { useMemo, useRef, useState } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import CustomDot from './CustomDot';
import TooltipContent from './ToolTip/TooltipContent';
import { Tooltip, TooltipRefProps } from 'react-tooltip';
import { ChartProps, Theme } from './interfaces/propInterfaces';
import { DoraRecord } from './interfaces/apiInterfaces';
import {
  buildNonGraphBody,
  formatDateTicks,
  generateTicks,
  useSharedLogic,
} from './functions/chartFunctions';
import {
  buildDoraState,
  calculateRecoverTime,
} from './functions/metricFunctions';
import {
  millisecondsToMinutes,
  recoverTimeName,
  tooltipHideDelay,
} from './constants';
import { v4 as uuidv4 } from 'uuid';
import styles from './chart.module.css';
import { stripTimeUTC } from './functions/dateFunctions';

interface ProcessRepository {
  count: number;
  totalTime: number;
  avgTime: number;
  avgLabel: string;
  graphAvgTime: number;
}

interface ProcessData {
  date: number;
  repositories: Map<string, ProcessRepository>;
}

export const composeGraphData = (props: ChartProps, data: DoraRecord[]) => {
  let reduced = data.reduce(
    (acc: Map<number, ProcessData>, record: DoraRecord) => {
      if (!record.failed_at) {
        return acc;
      }

      const date =
        stripTimeUTC(record.created_at).getTime() +
        new Date().getTimezoneOffset() * millisecondsToMinutes;
      let entry = acc.get(date);

      if (!entry) {
        entry = {
          date: date,
          repositories: new Map<string, ProcessRepository>(),
        };

        acc.set(date, entry);
      }

      let payload = entry.repositories.get(record.repository);

      const recoverTime = calculateRecoverTime(record);

      if (!payload) {
        entry.repositories.set(record.repository, {
          count: 1,
          totalTime: recoverTime,
          avgTime: recoverTime,
          avgLabel: ' hrs',
          graphAvgTime: 0,
        });
      } else {
        payload.count++;
        payload.totalTime += recoverTime;
        payload.avgTime += payload.totalTime / payload.count;
      }

      return acc;
    },
    new Map<number, ProcessData>(),
  );

  let result = Array.from(reduced.values());

  result.sort(
    (l, r) => new Date(l.date).getTime() - new Date(r.date).getTime(),
  );

  return result;
};

const renderTooltip = (payload: ProcessData, repository: string) => {
  const repositoryData = payload.repositories.get(repository);

  if (!repositoryData) {
    return null;
  }

  const body = (
    <>
      <p key={uuidv4()}>
        {repository}: {repositoryData.avgTime.toFixed(2)}{' '}
        {repositoryData.avgLabel}
      </p>
    </>
  );

  const date = new Date(payload.date).toISOString().split('T')[0];
  const title = <h3>{date}</h3>;

  return <TooltipContent body={body} title={title} />;
};

const dataKeyFunc = (obj: ProcessData, repository: string): any => {
  const repositoryData = obj.repositories.get(repository);

  if (!repositoryData) {
    return NaN;
  }

  return repositoryData.graphAvgTime;
};

const RecoverTimeGraph: React.FC<ChartProps> = (props: ChartProps) => {
  const [graphData, setGraphData] = useState<ProcessData[]>([]);
  const tooltipRef = useRef<TooltipRefProps>(null);
  const [usedRepositories, setUsedRepositories] = useState<string[]>([]);
  const [yLabel, setYLabel] = useState<any>(' hrs');

  const postCompose = (
    componentProps: ChartProps,
    data: DoraRecord[],
    composedData: ProcessData[],
  ) => {
    const state = buildDoraState(componentProps, data);

    const repositories: string[] = [];

    let graphMultiplier = 1;

    if (state.recoverTime.average > 48) {
      graphMultiplier = 1 / 24;
      setYLabel(' days');
    } else if (state.recoverTime.average < 1) {
      graphMultiplier = 60;
      setYLabel(' mins');
    } else {
      setYLabel(' hrs');
    }

    composedData.forEach((entry: ProcessData) => {
      entry.repositories.forEach(
        (repositoryData: ProcessRepository, key: string) => {
          repositories.push(key);

          let multiplier = 1;
          let label = ' hrs';

          if (repositoryData.avgTime > 48) {
            multiplier = 1 / 24;
            label = ' days';
          } else if (repositoryData.avgTime < 1) {
            multiplier = 60;
            label = ' mins';
          }

          repositoryData.graphAvgTime =
            repositoryData.avgTime * graphMultiplier;
          repositoryData.avgTime *= multiplier;
          repositoryData.avgLabel = label;
        },
      );
    });

    setUsedRepositories(Array.from(new Set(repositories)));
  };

  const [startDate, endDate, colors, _, noData] = useSharedLogic(
    props,
    composeGraphData,
    setGraphData,
    postCompose,
  );

  const chartProperties = useMemo(() => {
    return {
      tickFill: { fill: props.theme === Theme.Dark ? '#FFF' : '#000' },
      xTicks: generateTicks(startDate, endDate, 5),
      xDomain: [startDate.getTime(), endDate.getTime()],
      xPadding: { left: 9, right: 9 },
    };
  }, [startDate, endDate, props.theme]);

  const nonGraphBody = buildNonGraphBody(
    props,
    noData,
    recoverTimeName,
    styles.messageContainer,
    props.theme,
  );

  if (nonGraphBody) {
    return nonGraphBody;
  }

  return (
    <div
      data-testid={recoverTimeName}
      className={styles.chartWrapper}
      data-theme={props.theme}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={graphData}
          margin={{
            right: 40,
            top: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            padding={chartProperties.xPadding}
            dataKey="date"
            tickSize={15}
            type={'number'}
            tick={chartProperties.tickFill}
            ticks={chartProperties.xTicks}
            domain={chartProperties.xDomain}
            tickFormatter={formatDateTicks}
          />
          <YAxis name="Time" unit={yLabel} tick={chartProperties.tickFill} />
          {usedRepositories.map((repository, idx) => (
            <Line
              connectNulls={true}
              type="monotone"
              animationDuration={0}
              key={repository}
              dataKey={(obj: ProcessData) => dataKeyFunc(obj, repository)}
              fill={colors[idx]}
              stroke={colors[idx]}
              dot={(props: any) => (
                <CustomDot
                  {...props}
                  repository={repository}
                  tooltipId="rtTooltip"
                  tooltipRef={tooltipRef}
                  tooltipContentBuilder={() =>
                    renderTooltip(props.payload, repository)
                  }
                />
              )}
              activeDot={(props: any) => (
                <CustomDot
                  {...props}
                  repository={repository}
                  tooltipId="rtTooltip"
                  tooltipRef={tooltipRef}
                  tooltipContentBuilder={() =>
                    renderTooltip(props.payload, repository)
                  }
                />
              )}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <Tooltip
        ref={tooltipRef}
        className={styles.tooltip}
        delayHide={tooltipHideDelay}
        clickable={true}
        classNameArrow={styles.tooltipArrow}
        id="rtTooltip"
        border="1px"
        opacity="1"
      />
    </div>
  );
};

export default RecoverTimeGraph;
