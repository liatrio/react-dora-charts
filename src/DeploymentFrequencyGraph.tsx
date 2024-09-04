import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import CustomBar from './CustomBar';
import { Tooltip, TooltipRefProps } from 'react-tooltip';
import TooltipContent from './ToolTip/TooltipContent';
import {
  deploymentFrequencyName,
  millisecondsToDays,
  millisecondsToMinutes,
  tooltipHideDelay,
} from './constants';
import { ChartProps, Theme } from './interfaces/propInterfaces';
import { DoraRecord } from './interfaces/apiInterfaces';
import {
  buildNonGraphBody,
  formatDateTicks,
  generateTicks,
  useSharedLogic,
} from './functions/chartFunctions';
import { v4 as uuidv4 } from 'uuid';
import styles from './chart.module.css';
import { stripTimeUTC } from './functions/dateFunctions';

interface ProcessRepository {
  count: number;
  urls: string[];
}

interface ProcessData {
  date: number;
  repositories: Map<string, ProcessRepository>;
}

export const composeGraphData = (_: ChartProps, data: DoraRecord[]): any[] => {
  const reduced = data.reduce(
    (acc: Map<number, ProcessData>, record: DoraRecord) => {
      if (!record.status) {
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

      let repo = entry.repositories.get(record.repository);

      if (!repo) {
        repo = {
          count: 1,
          urls: [record.deploy_url],
        };

        entry.repositories.set(record.repository, repo);
      } else {
        repo.count++;
        repo.urls.push(record.deploy_url);
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
    return;
  }

  const urls = repositoryData.urls.slice(0, 5);
  const dots = repositoryData.urls.length > 5 ? '...' : '';

  const body = (
    <>
      <p>
        {repository}:
        {urls.map((url: string, index: number) => {
          return (
            <a
              key={uuidv4()}
              className={styles.toolTipLink}
              href={url}
              target="_blank"
            >
              {index + 1}
            </a>
          );
        })}
        {dots}
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
    return 0;
  }

  return repositoryData.count;
};

const DeploymentFrequencyGraph: React.FC<ChartProps> = (props: ChartProps) => {
  const [graphData, setGraphData] = useState<any[]>([]);
  const [maxDeploys, setMaxDeploys] = useState<number>(0);
  const tooltipRef = useRef<TooltipRefProps>(null);
  const [startDate, endDate, colors, repositories, noData] = useSharedLogic(
    props,
    composeGraphData,
    setGraphData,
  );

  useEffect(() => {
    let max = 0;

    graphData.forEach((entry: any) => {
      Object.keys(entry).forEach((key: string) => {
        if (key === 'date') {
          return;
        }

        const count = entry[key].count;

        if (count > max) {
          max = count;
        }
      });
    });

    setMaxDeploys(max);
  }, [graphData]);

  const chartProperties = useMemo(() => {
    return {
      tickFill: { fill: props.theme === Theme.Dark ? '#FFF' : '#000' },
      xTicks: generateTicks(startDate, endDate, 5),
      xDomain: [startDate.getTime(), endDate.getTime()],
      xPadding: { left: 9, right: 9 },
      yDomain: [0, maxDeploys],
      maxBarWidth:
        (1 / ((endDate.getTime() - startDate.getTime()) / millisecondsToDays)) *
          33 +
        '%',
    };
  }, [startDate, endDate, props.theme, maxDeploys]);

  const nonGraphBody = buildNonGraphBody(
    props,
    noData,
    deploymentFrequencyName,
    styles.messageContainer,
    props.theme,
  );

  if (nonGraphBody) {
    return nonGraphBody;
  }

  return (
    <div
      data-testid={deploymentFrequencyName}
      className={styles.chartWrapper}
      data-theme={props.theme}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={graphData}
          barGap={20}
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
            interval={0}
            type={'number'}
            tick={chartProperties.tickFill}
            ticks={chartProperties.xTicks}
            domain={chartProperties.xDomain}
            tickFormatter={formatDateTicks}
          />
          <YAxis
            type={'number'}
            tick={chartProperties.tickFill}
            allowDecimals={false}
            domain={chartProperties.yDomain}
          />
          {repositories.map((repository, idx) => {
            return (
              <Bar
                animationDuration={0}
                key={repository}
                dataKey={(obj: ProcessData) => dataKeyFunc(obj, repository)}
                stackId="a"
                fill={colors[idx]}
                barSize={chartProperties.maxBarWidth}
                shape={(props: any) => (
                  <CustomBar
                    {...props}
                    tooltipId="dfTooltip"
                    tooltipRef={tooltipRef}
                    tooltipContentBuilder={() =>
                      renderTooltip(props.payload, repository)
                    }
                  />
                )}
              />
            );
          })}
        </BarChart>
      </ResponsiveContainer>
      <Tooltip
        ref={tooltipRef}
        className={styles.tooltip}
        delayHide={tooltipHideDelay}
        clickable={true}
        classNameArrow={styles.tooltipArrow}
        id="dfTooltip"
        border="1px"
        opacity="1"
      />
    </div>
  );
};

export default DeploymentFrequencyGraph;
