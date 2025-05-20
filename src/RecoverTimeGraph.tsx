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

// Helper function to copy SHA to clipboard
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      console.log('SHA copied to clipboard');
    })
    .catch(err => {
      console.error('Could not copy SHA: ', err);
    });
};

interface ProcessService {
  count: number;
  totalTime: number;
  avgTime: number;
  avgLabel: string;
  graphAvgTime: number;
  // Store repository information for detailed tooltips
  repositoryTimes: Array<{ 
    repo: string; 
    time: number; 
    url?: string; 
    sha?: string;
    issueUrl?: string;
  }>
}

interface ProcessData {
  date: number;
  services: Map<string, ProcessService>;
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
          services: new Map<string, ProcessService>(),
        };

        acc.set(date, entry);
      }

      // Use service name if available, fall back to repository for backward compatibility
      const serviceName = record.service || record.repository;
      const repoName = record.repository;
      let service = entry.services.get(serviceName);
      
      const recoverTime = calculateRecoverTime(record);

      if (!service) {
        service = {
          count: 1,
          totalTime: recoverTime,
          avgTime: recoverTime,
          avgLabel: ' hrs',
          graphAvgTime: 0,
          repositoryTimes: [{
            repo: repoName,
            time: recoverTime,
            url: record.deploy_url,
            sha: record.sha,
            issueUrl: record.issue_url
          }]
        };
        
        entry.services.set(serviceName, service);
      } else {
        service.count++;
        service.totalTime += recoverTime;
        service.avgTime = service.totalTime / service.count;
        service.repositoryTimes.push({
          repo: repoName,
          time: recoverTime,
          url: record.deploy_url,
          sha: record.sha,
          issueUrl: record.issue_url
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
    return null;
  }
  
  // Get repository details for better tooltip context
  const repoTimes = serviceData.repositoryTimes || [];

  const body = (
    <div style={{ minWidth: '300px', maxWidth: 'none' }}>
      <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>
        {service}: {serviceData.avgTime.toFixed(2)}{' '}
        {serviceData.avgLabel}
      </p>
      
      {repoTimes.length > 0 && (
        <>
          {/* Legend row */}
          <div style={{ 
            display: 'flex', 
            fontSize: '0.8em', 
            color: '#888', 
            margin: '0 0 4px 0',
            paddingLeft: '16px'
          }}>
            <span style={{ fontStyle: 'italic' }}>Recovery times by repository</span>
          </div>
          
          <ul style={{ margin: '0', paddingLeft: '16px', whiteSpace: 'nowrap', listStyleType: 'disc' }}>
            {repoTimes.map((repo, index) => {
              // Always convert time to minutes to match the label
              let timeValue = repo.time * 60; // Convert hours to minutes
              let timeLabel = ' mins';
              
              // Format SHA for display if available
              const shortSha = repo.sha?.substring(0, 6) || '';
              const fullSha = repo.sha || '';
              
              return (
                <li key={index} style={{ margin: '4px 0', paddingLeft: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%', flexWrap: 'nowrap', justifyContent: 'space-between' }}>
                    {/* Repository column - fixed width with ellipsis */}
                    <div style={{ minWidth: '120px', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '12px', flexGrow: 0 }}>
                      <span title={repo.repo}>{repo.repo}</span>
                    </div>
                    
                    {/* SHA column - with copy button */}
                    {repo.sha && (
                      <div style={{ width: '60px', flexShrink: 0, textAlign: 'left', paddingLeft: '4px', paddingRight: '4px' }}>
                        <a
                          className={styles.toolTipLink}
                          href={repo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View deployment"
                        >
                          {shortSha}
                        </a>
                        <span 
                          onClick={() => copyToClipboard(fullSha)}
                          style={{ 
                            cursor: 'pointer', 
                            fontSize: '1.2em',
                            color: '#333',
                            fontWeight: 'bold'
                          }}
                          title="Copy full SHA"
                        >
                          ⎘
                        </span>
                      </div>
                    )}
                    
                    {/* Link to issue if available */}
                    {repo.issueUrl && (
                      <div style={{ width: '50px', flexShrink: 0, textAlign: 'center', paddingLeft: '16px', paddingRight: '8px' }}>
                        <a
                          href={repo.issueUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View issue"
                          style={{
                            color: '#e74c3c',
                            textDecoration: 'none',
                            border: '1px solid #e74c3c',
                            borderRadius: '3px',
                            padding: '1px 4px',
                            fontSize: '0.8em',
                            fontWeight: 'bold'
                          }}
                        >
                          Issue
                        </a>
                      </div>
                    )}
                    
                    {/* Time value column - always in minutes */}
                    <div style={{ width: '90px', flexShrink: 0, textAlign: 'right', paddingLeft: '8px' }}>
                      {timeValue.toFixed(2)}{timeLabel}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );

  const date = new Date(payload.date).toISOString().split('T')[0];
  const title = <h3>{date}</h3>;

  return <TooltipContent body={body} title={title} />;
};

const dataKeyFunc = (obj: ProcessData, service: string): any => {
  const serviceData = obj.services.get(service);

  if (!serviceData) {
    return NaN;
  }

  return serviceData.graphAvgTime;
};

const RecoverTimeGraph: React.FC<ChartProps> = (props: ChartProps) => {
  const [graphData, setGraphData] = useState<ProcessData[]>([]);
  const tooltipRef = useRef<TooltipRefProps>(null);
  const [usedServices, setUsedServices] = useState<string[]>([]);
  const [yLabel, setYLabel] = useState<any>(' hrs');

  const postCompose = (
    componentProps: ChartProps,
    data: DoraRecord[],
    composedData: ProcessData[],
  ) => {
    const state = buildDoraState(componentProps, data);

    const services: string[] = [];

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
      entry.services.forEach(
        (serviceData: ProcessService, key: string) => {
          services.push(key);

          let multiplier = 1;
          let label = ' hrs';

          if (serviceData.avgTime > 48) {
            multiplier = 1 / 24;
            label = ' days';
          } else if (serviceData.avgTime < 1) {
            multiplier = 60;
            label = ' mins';
          }

          serviceData.graphAvgTime =
            serviceData.avgTime * graphMultiplier;
          serviceData.avgTime *= multiplier;
          serviceData.avgLabel = label;
        },
      );
    });

    setUsedServices(Array.from(new Set(services)));
  };

  const [startDate, endDate, colors, services, noData] = useSharedLogic(
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
          {usedServices.map((service, idx) => (
            <Line
              connectNulls={true}
              type="monotone"
              animationDuration={0}
              key={service}
              dataKey={(obj: ProcessData) => dataKeyFunc(obj, service)}
              fill={colors[idx]}
              stroke={colors[idx]}
              dot={(props: any) => (
                <CustomDot
                  {...props}
                  repository={service} /* Keep prop name for compatibility */
                  tooltipId="rtTooltip"
                  tooltipRef={tooltipRef}
                  tooltipContentBuilder={() =>
                    renderTooltip(props.payload, service)
                  }
                />
              )}
              activeDot={(props: any) => (
                <CustomDot
                  {...props}
                  repository={service} /* Keep prop name for compatibility */
                  tooltipId="rtTooltip"
                  tooltipRef={tooltipRef}
                  tooltipContentBuilder={() =>
                    renderTooltip(props.payload, service)
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
        style={{ position: 'fixed', zIndex: 9999, maxWidth: 'none', overflow: 'visible' }}
      />
    </div>
  );
};

export default RecoverTimeGraph;
