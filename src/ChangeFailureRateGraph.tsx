import React, { useMemo, useRef, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import CustomLayeredBar from './CustomLayeredBar';
import { Tooltip, TooltipRefProps } from 'react-tooltip';
import TooltipContent from './ToolTip/TooltipContent';
import { ChartProps, Theme } from './interfaces/propInterfaces';
import { DoraRecord } from './interfaces/apiInterfaces';
import {
  buildNonGraphBody,
  formatDateTicks,
  generateTicks,
  useSharedLogic,
} from './functions/chartFunctions';
import {
  changeFailureRateName,
  millisecondsToDays,
  tooltipHideDelay,
} from './constants';
import { v4 as uuidv4 } from 'uuid';
import styles from './chart.module.css';
import { stripTimeUTC } from './functions/dateFunctions';

interface ProcessData {
  date: number;
  repositories: Map<string, ProcessRepository>;
}

interface ProcessRepository {
  date: number;
  repository: string;
  successful: number;
  failed: number;
  total: number;
  failureUrls: string[];
  successUrls: string[];
}

const renderTooltip = (payload: ProcessRepository) => {
  const successUrls = payload.successUrls.slice(0, 5);
  const successDots = payload.successUrls.length > 5 ? '...' : '';
  const failureUrls = payload.failureUrls.slice(0, 5);
  const failureDots = payload.failureUrls.length > 5 ? '...' : '';

  const body = (
    <>
      <p key={uuidv4()}>
        {payload.repository}: {(payload.total * 100).toFixed(2)}%
      </p>
      {payload.successful > 0 && (
        <span key={uuidv4()} className={styles.toolTipSpan}>
          Successes:
          {successUrls.map((url: string, index: number) => {
            return (
              <a
                key={uuidv4()}
                className={styles.toolTipLink}
                target="_blank"
                href={url}
              >
                {index + 1}
              </a>
            );
          })}
          {successDots}
        </span>
      )}
      {payload.failed > 0 && payload.successful > 0 && <br key={uuidv4()} />}
      {payload.failed > 0 && (
        <span key={uuidv4()} className={styles.toolTipSpan}>
          Issues:
          {failureUrls.map((url: string, index: number) => {
            return (
              <a
                key={uuidv4()}
                className={styles.toolTipLink}
                target="_blank"
                href={url}
              >
                {index + 1}
              </a>
            );
          })}
          {failureDots}
        </span>
      )}
    </>
  );

  const date = new Date(payload.date).toISOString().split('T')[0];
  const title = <h3>{date}</h3>;

  return <TooltipContent body={body} title={title} />;
};

const tickFormatter = (tick: number) => {
  return tick * 100 + '%';
};

export const composeGraphData = (_: ChartProps, data: DoraRecord[]) => {
  const allData: ProcessRepository[] = [];

  const processed = new Map<number, ProcessData>();

  data.forEach((record: DoraRecord) => {
    const date = stripTimeUTC(record.created_at).getTime();
    let entry = processed.get(date);

    if (!entry) {
      entry = {
        date: date,
        repositories: new Map<string, ProcessRepository>(),
      };

      processed.set(date, entry);
    }

    const key = record.repository;
    let count = entry.repositories.get(key);

    if (!count) {
      count = {
        date: date,
        repository: key,
        successful: 0,
        failed: 0,
        total: 0,
        failureUrls: [],
        successUrls: [],
      };

      if (record.status && !record.failed_at) {
        count.successful = 1;
        count.successUrls.push(record.deploy_url);
      } else {
        count.failed = 1;
        count.failureUrls.push(record.issue_url ?? record.deploy_url);
      }

      entry.repositories.set(key, count);
    } else {
      if (record.status && !record.failed_at) {
        count.successful++;
        count.successUrls.push(record.deploy_url);
      } else {
        count.failed++;
        count.failureUrls.push(record.issue_url ?? record.deploy_url);
      }
    }
  });

  processed.forEach((data: ProcessData) => {
    Array.from(data.repositories.keys()).forEach(
      (key: string, index: number) => {
        const repoData = data.repositories.get(key)!;

        const total = repoData.failed + repoData.successful;

        repoData.total = repoData.failed / (total < 1 ? 1 : total);

        repoData.date += index;

        allData.push(repoData);
      },
    );
  });

  allData.sort((l: any, r: any) => r.total - l.total);

  return allData;
};

const ChangeFailureRateGraph: React.FC<ChartProps> = (props: ChartProps) => {
  const tooltipRef = useRef<TooltipRefProps>(null);
  const [graphData, setGraphData] = useState<ProcessData[]>([]);

  const [startDate, endDate, colors, repositories, noData] = useSharedLogic(
    props,
    composeGraphData,
    setGraphData,
  );

  const chartProperties = useMemo(() => {
    return {
      tickFill: { fill: props.theme === Theme.Dark ? '#FFF' : '#000' },
      xTicks: generateTicks(startDate, endDate, 5),
      xDomain: [startDate.getTime(), endDate.getTime()],
      xPadding: { left: 9, right: 9 },
      maxBarWidth:
        (1 / ((endDate.getTime() - startDate.getTime()) / millisecondsToDays)) *
          33 +
        '%',
    };
  }, [startDate, endDate, props.theme]);

  const nonGraphBody = buildNonGraphBody(
    props,
    noData,
    changeFailureRateName,
    styles.messageContainer,
    props.theme,
  );

  if (nonGraphBody) {
    return nonGraphBody;
  }

  return (
    <div
      data-testid={changeFailureRateName}
      className={styles.chartWrapper}
      data-theme={props.theme}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={graphData}
          margin={{
            right: 40,
            top: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <YAxis
            type="number"
            tick={chartProperties.tickFill}
            tickFormatter={tickFormatter}
          />
          <XAxis
            padding={chartProperties.xPadding}
            dataKey="date"
            tickSize={15}
            type="number"
            tick={chartProperties.tickFill}
            ticks={chartProperties.xTicks}
            domain={chartProperties.xDomain}
            tickFormatter={formatDateTicks}
          />
          <Bar
            animationDuration={0}
            dataKey="total"
            shape={(props: any) => (
              <CustomLayeredBar
                {...props}
                color={
                  colors[repositories.findIndex(r => r === props.repository)]
                }
                tooltipId="cfrTooltip"
                barWidth={chartProperties.maxBarWidth}
                tooltipContentBuilder={renderTooltip}
                tooltipRef={tooltipRef}
              />
            )}
          />
        </BarChart>
      </ResponsiveContainer>
      <Tooltip
        ref={tooltipRef}
        className={styles.tooltip}
        delayHide={tooltipHideDelay}
        clickable={true}
        classNameArrow={styles.tooltipArrow}
        id="cfrTooltip"
        border="1px"
        opacity="1"
      />
    </div>
  );
};

export default ChangeFailureRateGraph;
