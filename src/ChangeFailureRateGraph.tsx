import React, { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import CustomLayeredBar from './CustomLayeredBar';
import { Tooltip } from 'react-tooltip';
import TooltipContent from './ToolTip/TooltipContent';
import { ChartProps, Theme } from './interfaces/propInterfaces';
import { DoraRecord } from './interfaces/apiInterfaces';
import {
  buildNonGraphBody,
  formatDateTicks,
  generateTicks,
  useSharedLogic,
} from './functions/chartFunctions';
import { changeFailureRateName, millisecondsToDays } from './constants';
import { v4 as uuidv4 } from 'uuid';
import styles from './chart.module.css';

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

export const composeGraphData = (_: ChartProps, data: DoraRecord[]) => {
  const allData: ProcessRepository[] = [];

  const processed = new Map<number, ProcessData>();

  data.forEach((record: DoraRecord) => {
    const date = new Date(
      Date.UTC(
        record.created_at.getUTCFullYear(),
        record.created_at.getUTCMonth(),
        record.created_at.getUTCDate(),
      ),
    ).getTime();
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

      if (record.status === true && !record.failed_at) {
        count.successful = 1;
        count.successUrls.push(record.deploy_url);
      } else {
        count.failed = 1;
        count.failureUrls.push(record.issue_url ?? record.deploy_url);
      }

      entry.repositories.set(key, count);
    } else {
      if (record.status === true && !record.failed_at) {
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
  const [tooltipContent, setTooltipContent] = useState<any>(null);
  const [graphData, setGraphData] = useState<any>(null);

  const [startDate, endDate, colors, repositories, noData] = useSharedLogic(
    props,
    composeGraphData,
    setGraphData,
  );

  const ticks = useMemo(
    () => generateTicks(startDate, endDate, 5),
    [startDate, endDate],
  );
  const maxBarWidth = useMemo(
    () =>
      (1 / ((endDate.getTime() - startDate.getTime()) / millisecondsToDays)) *
        33 +
      '%',
    [startDate, endDate],
  );

  const nonGraphBody = buildNonGraphBody(props, noData, changeFailureRateName, styles.messageContainer);

  if (nonGraphBody) {
    return nonGraphBody;
  }

  const handleMouseOverBar = (event: any, payload: ProcessRepository) => {
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

    setTooltipContent(<TooltipContent body={body} title={title} />);
  };

  const tickColor = props.theme === Theme.Dark ? '#FFF' : '#000';

  return (
    <div data-testid={changeFailureRateName} className={styles.chartWrapper} data-theme={props.theme === Theme.Dark ? 'dark' : 'light'}>
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
            tick={{ fill: tickColor }}
            tickFormatter={tick => tick * 100 + '%'}
          />
          <XAxis
            padding={{ left: 9, right: 9 }}
            dataKey="date"
            tickSize={15}
            type="number"
            tick={{ fill: tickColor }}
            ticks={ticks}
            domain={[startDate.getTime(), endDate.getTime()]}
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
                barWidth={maxBarWidth}
                mouseOver={handleMouseOverBar}
              />
            )}
          />
        </BarChart>
      </ResponsiveContainer>
      <Tooltip
        className={styles.chartTooltip}
        delayHide={1000}
        clickable={true}
        classNameArrow={styles.chartTooltipArrow}
        id="cfrTooltip"
        border="1px"
        opacity="1"
        content={tooltipContent}
      />
    </div>
  );
};

export default ChangeFailureRateGraph;
