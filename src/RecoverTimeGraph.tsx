import React, { useState } from 'react';
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
import { Tooltip } from 'react-tooltip';
import { ChartProps, Theme } from './interfaces/propInterfaces';
import { DoraRecord } from './interfaces/apiInterfaces';
import {
  buildNonGraphBody,
  formatDateTicks,
  generateTicks,
  useSharedLogic,
} from './functions/chartFunctions';
import { buildDoraState } from './functions/metricFunctions';
import { recoverTimeName } from './constants';
import { v4 as uuidv4 } from 'uuid';
import styles from './chart.module.css';

interface ProcessRepository {
  count: number;
  totalTime: number;
  avgTime: number;
  avgLabel: string;
}

interface ProcessData {
  date: number;
  repositories: Map<string, ProcessRepository>;
}

export const composeGraphData = (props: ChartProps, data: DoraRecord[]) => {
  let reduced = data.reduce(
    (acc: Map<number, ProcessData>, record: DoraRecord) => {
      if (record.recoverTime === undefined) {
        return acc;
      }

      const date = new Date(
        Date.UTC(
          record.created_at.getUTCFullYear(),
          record.created_at.getUTCMonth(),
          record.created_at.getUTCDate(),
        ),
      ).getTime();
      let entry = acc.get(date);

      if (!entry) {
        entry = {
          date: date,
          repositories: new Map<string, ProcessRepository>(),
        };

        acc.set(date, entry);
      }

      let payload = entry.repositories.get(record.repository);

      if (!payload) {
        entry.repositories.set(record.repository, {
          count: 1,
          totalTime: record.recoverTime,
          avgTime: record.recoverTime,
          avgLabel: ' hrs',
        });
      } else {
        payload.count++;
        payload.totalTime += record.recoverTime;
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

const RecoverTimeGraph: React.FC<ChartProps> = (props: ChartProps) => {
  const [graphData, setGraphData] = useState<ProcessData[]>([]);
  const [tooltipContent, setTooltipContent] = useState<any>(null);
  const [usedRepositories, setUsedRepositories] = useState<string[]>([]);
  const [yLabel, setYLabel] = useState<any>(' hrs');

  const postCompose = (
    componentProps: ChartProps,
    data: DoraRecord[],
    composedData: ProcessData[],
  ) => {
    const state = buildDoraState(componentProps, data);

    const repositories: string[] = [];
    let multiplier = 1;
    let label = ' hrs';

    if (state.recoverTime.average > 48) {
      multiplier = 1 / 24;
      label = ' days';
    } else if (state.recoverTime.average < 1) {
      multiplier = 60;
      label = ' mins';
    }

    composedData.forEach((entry: ProcessData) => {
      entry.repositories.forEach(
        (repositoryData: ProcessRepository, key: string) => {
          repositories.push(key);

          repositoryData.avgTime *= multiplier;
          repositoryData.avgLabel = ' days';
        },
      );
    });

    setYLabel(label);

    setUsedRepositories(Array.from(new Set(repositories)));
  };

  const [startDate, endDate, colors, _, noData] = useSharedLogic(
    props,
    composeGraphData,
    setGraphData,
    postCompose,
  );

  const ticks = generateTicks(startDate, endDate, 5);

  const nonGraphBody = buildNonGraphBody(props, noData, recoverTimeName, styles.messageContainer);

  if (nonGraphBody) {
    return nonGraphBody;
  }

  const handleMouseOverDot = (
    event: any,
    payload: ProcessData,
    repository: string,
  ) => {
    const repositoryData = payload.repositories.get(repository);

    if (!repositoryData) {
      return;
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

    setTooltipContent(<TooltipContent body={body} title={title} />);
  };

  const dataKeyFunc = (obj: ProcessData, repository: string): any => {
    const repositoryData = obj.repositories.get(repository);

    if (!repositoryData) {
      return NaN;
    }

    return repositoryData.avgTime;
  };

  const tickColor = props.theme === Theme.Dark ? '#FFF' : '#000';

  return (
    <div data-testid={recoverTimeName} className={styles.chartWrapper} data-theme={props.theme === Theme.Dark ? 'dark' : 'light'}>
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
            padding={{ left: 9, right: 9 }}
            dataKey="date"
            tickSize={15}
            type={'number'}
            tick={{ fill: tickColor }}
            ticks={ticks}
            domain={[startDate.getTime(), endDate.getTime()]}
            tickFormatter={formatDateTicks}
          />
          <YAxis name="Time" unit={yLabel} tick={{ fill: tickColor }} />
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
                  mouseOver={handleMouseOverDot}
                />
              )}
              activeDot={(props: any) => (
                <CustomDot
                  {...props}
                  repository={repository}
                  tooltipId="rtTooltip"
                  mouseOver={handleMouseOverDot}
                />
              )}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <Tooltip
        className={styles.chartTooltip}
        delayHide={2000}
        clickable={true}
        classNameArrow={styles.chartTooltipArrow}
        id="rtTooltip"
        border="1px"
        opacity="1"
        content={tooltipContent}
      />
    </div>
  );
};

export default RecoverTimeGraph;
