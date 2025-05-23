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

interface ProcessService {
  count: number;
  deployments: Array<{ url: string; repo: string; sha: string }>;
}

interface ProcessData {
  date: number;
  services: Map<string, ProcessService>;
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
          services: new Map<string, ProcessService>(),
        };

        acc.set(date, entry);
      }

      // Prefer service over repository for v2 API
      const serviceName = record.service || record.repository;
      let service = entry.services.get(serviceName);

      if (!service) {
        service = {
          count: 1,
          deployments: [
            {
              url: record.deploy_url,
              repo: record.repository,
              sha: record.sha,
            },
          ],
        };

        entry.services.set(serviceName, service);
      } else {
        service.count++;
        service.deployments.push({
          url: record.deploy_url,
          repo: record.repository,
          sha: record.sha,
        });
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

const renderTooltip = (payload: ProcessData, service: string) => {
  const serviceData = payload.services.get(service);

  if (!serviceData) {
    return;
  }

  // Limit to the first 5 deployments to avoid cluttering the tooltip
  const deployments = serviceData.deployments.slice(0, 5);
  const dots = serviceData.deployments.length > 5 ? '...' : '';

  // Function to copy SHA to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch(err => {
      console.error('Could not copy text: ', err);
    });
  };

  const body = (
    <div style={{ minWidth: '300px', maxWidth: '450px' }}>
      <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>{service}:</p>

      {/* Legend row */}
      <div
        style={{
          display: 'flex',
          fontSize: '0.8em',
          color: '#888',
          margin: '0 0 4px 0',
          paddingLeft: '16px',
        }}
      >
        <span style={{ fontStyle: 'italic' }}>
          [Repository, Deployment SHA]
        </span>
      </div>

      <ul
        style={{
          margin: '0',
          paddingLeft: '16px',
          whiteSpace: 'nowrap',
          listStyleType: 'disc',
        }}
      >
        {deployments.map((deployment, index) => {
          // Get abbreviated SHA (first 6 chars)
          const shortSha = deployment.sha?.substring(0, 6) || '';
          const fullSha = deployment.sha || '';

          return (
            <li
              key={index}
              style={{
                margin: '4px 0',
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'nowrap',
                paddingLeft: '4px',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', width: '100%' }}
              >
                {/* Repository column - fixed width with ellipsis */}
                <div
                  style={{
                    minWidth: '120px',
                    maxWidth: '200px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    paddingRight: '12px',
                    flexGrow: 1,
                  }}
                >
                  <span title={deployment.repo}>{deployment.repo}</span>
                </div>

                {/* SHA column - fixed width */}
                <div
                  style={{
                    width: '60px',
                    flexShrink: 0,
                    textAlign: 'left',
                    paddingLeft: '4px',
                    paddingRight: '4px',
                  }}
                >
                  <a
                    className={styles.toolTipLink}
                    href={deployment.url}
                    target="_blank"
                  >
                    {shortSha}
                  </a>
                </div>

                {/* Copy button column - fixed width */}
                <div
                  style={{ width: '30px', flexShrink: 0, textAlign: 'center' }}
                >
                  <span
                    onClick={() => copyToClipboard(fullSha)}
                    style={{
                      cursor: 'pointer',
                      fontSize: '1.2em',
                      color: '#333',
                      fontWeight: 'bold',
                    }}
                    title="Copy full SHA"
                  >
                    ⎘
                  </span>
                </div>
              </div>
            </li>
          );
        })}
        {dots && <li>...</li>}
      </ul>
    </div>
  );

  const date = new Date(payload.date).toISOString().split('T')[0];
  const title = <h3>{date}</h3>;

  return <TooltipContent body={body} title={title} />;
};

const dataKeyFunc = (obj: ProcessData, service: string): any => {
  const serviceData = obj.services.get(service);

  if (!serviceData) {
    return 0;
  }

  return serviceData.count;
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
          {repositories.map((service, idx) => {
            return (
              <Bar
                animationDuration={0}
                key={service}
                dataKey={(obj: ProcessData) => dataKeyFunc(obj, service)}
                stackId="a"
                fill={colors[idx]}
                barSize={chartProperties.maxBarWidth}
                shape={(props: any) => (
                  <CustomBar
                    {...props}
                    tooltipId="dfTooltip"
                    tooltipRef={tooltipRef}
                    tooltipContentBuilder={() =>
                      renderTooltip(props.payload, service)
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
