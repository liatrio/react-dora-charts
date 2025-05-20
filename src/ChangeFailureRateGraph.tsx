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
  services: Map<string, ProcessService>;
}

interface ProcessService {
  date: number;
  service: string;
  successful: number;
  failed: number;
  total: number;
  failureDeployments: Array<{ url: string; repo: string; sha?: string; issueUrl?: string }>;
  successDeployments: Array<{ url: string; repo: string; sha?: string; }>;
}

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

const renderTooltip = (payload: ProcessService) => {
  const service = payload.service;
  const successDeployments = payload.successDeployments.slice(0, 5);
  const successDots = payload.successDeployments.length > 5 ? '...' : '';
  const failureDeployments = payload.failureDeployments.slice(0, 5);
  const failureDots = payload.failureDeployments.length > 5 ? '...' : '';

  const body = (
    <div style={{ minWidth: '300px', maxWidth: 'none' }}>
      <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>
        {service}: {(payload.total * 100).toFixed(2)}%
      </p>
      
      {/* Legend row */}
      <div style={{ 
        display: 'flex', 
        fontSize: '0.8em', 
        color: '#888', 
        margin: '0 0 4px 0',
        paddingLeft: '16px'
      }}>
        <span style={{ fontStyle: 'italic' }}>[Repository, SHA]</span>
      </div>
      
      {payload.successful > 0 && (
        <>
          <span className={styles.toolTipSpan} style={{ fontWeight: 'bold', display: 'block', marginTop: '8px' }}>
            Successes:
          </span>
          <ul style={{ margin: '0', paddingLeft: '16px', whiteSpace: 'nowrap', listStyleType: 'disc' }}>
            {successDeployments.map((deployment, index) => {
              // Get abbreviated SHA (first 6 chars)
              const shortSha = deployment.sha?.substring(0, 6) || '';
              const fullSha = deployment.sha || '';
              
              return (
                <li key={index} style={{ margin: '4px 0', display: 'flex', alignItems: 'center', flexWrap: 'nowrap', paddingLeft: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    {/* Repository column - fixed width with ellipsis */}
                    <div style={{ minWidth: '120px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '12px', flexGrow: 1 }}>
                      <span title={deployment.repo}>{deployment.repo}</span>
                    </div>
                    

                    {/* SHA column - fixed width */}
                    <div style={{ width: '60px', flexShrink: 0, textAlign: 'left', paddingLeft: '4px', paddingRight: '4px' }}>
                      <a
                        className={styles.toolTipLink}
                        href={deployment.url}
                        target="_blank"
                      >
                        {shortSha || 'Deployment'}
                      </a>
                    </div>
                    
                    {/* Copy button column - fixed width */}
                    <div style={{ width: '30px', flexShrink: 0, textAlign: 'center' }}>
                      {shortSha && (
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
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
            {successDots && <li>...</li>}
          </ul>
        </>
      )}
      
      {payload.failed > 0 && (
        <>
          <span className={styles.toolTipSpan} style={{ fontWeight: 'bold', display: 'block', marginTop: '8px' }}>
            Issues:
          </span>
          <ul style={{ margin: '0', paddingLeft: '16px', whiteSpace: 'nowrap', listStyleType: 'disc' }}>
            {failureDeployments.map((deployment, index) => {
              // Get abbreviated SHA (first 6 chars)
              const shortSha = deployment.sha?.substring(0, 6) || '';
              const fullSha = deployment.sha || '';
              
              return (
                <li key={index} style={{ margin: '4px 0', display: 'flex', alignItems: 'center', flexWrap: 'nowrap', paddingLeft: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    {/* Repository column - fixed width with ellipsis */}
                    <div style={{ minWidth: '120px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '12px', flexGrow: 0 }}>
                      <span title={deployment.repo}>{deployment.repo}</span>
                    </div>
                    
                    {/* SHA column - with deployment link */}
                    {deployment.sha && (
                      <div style={{ width: '60px', flexShrink: 0, textAlign: 'left', paddingLeft: '4px', paddingRight: '4px' }}>
                        <a
                          className={styles.toolTipLink}
                          href={deployment.url}
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
                    {deployment.issueUrl && (
                      <div style={{ width: '50px', flexShrink: 0, textAlign: 'center', paddingLeft: '16px', paddingRight: '8px' }}>
                        <a
                          href={deployment.issueUrl}
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
                    
                  </div>
                </li>
              );
            })}
            {failureDots && <li>...</li>}
          </ul>
        </>
      )}

    </div>
  );

  const date = new Date(payload.date).toISOString().split('T')[0];
  const title = <h3>{date}</h3>;

  return <TooltipContent body={body} title={title} />;
};

const tickFormatter = (tick: number) => {
  return tick * 100 + '%';
};

export const composeGraphData = (_: ChartProps, data: DoraRecord[]) => {
  const allData: ProcessService[] = [];

  const processed = new Map<number, ProcessData>();

  data.forEach((record: DoraRecord) => {
    const date = stripTimeUTC(record.created_at).getTime();
    let entry = processed.get(date);

    if (!entry) {
      entry = {
        date: date,
        services: new Map<string, ProcessService>(),
      };

      processed.set(date, entry);
    }

    // Use service if available, fall back to repository for backward compatibility
    const serviceName = record.service || record.repository;
    // Keep track of the actual repository for display
    const repoName = record.repository;
    let service = entry.services.get(serviceName);

    if (!service) {
      service = {
        date: date,
        service: serviceName,
        successful: 0,
        failed: 0,
        total: 0,
        failureDeployments: [],
        successDeployments: []
      };

      if (record.status && !record.failed_at) {
        service.successful = 1;
        service.successDeployments.push({
          url: record.deploy_url,
          repo: repoName,
          sha: record.sha
        });

      } else {
        service.failed = 1;
        service.failureDeployments.push({
          url: record.issue_url ?? record.deploy_url,
          repo: repoName,
          sha: record.sha,
          issueUrl: record.issue_url
        });

      }

      entry.services.set(serviceName, service);
    } else {
      if (record.status && !record.failed_at) {
        service.successful++;
        service.successDeployments.push({
          url: record.deploy_url,
          repo: repoName,
          sha: record.sha
        });
      } else {
        service.failed++;
        service.failureDeployments.push({
          url: record.issue_url ?? record.deploy_url,
          repo: repoName,
          sha: record.sha,
          issueUrl: record.issue_url
        });
      }
    }
  });

  processed.forEach((data: ProcessData) => {
    Array.from(data.services.keys()).forEach(
      (key: string, index: number) => {
        const serviceData = data.services.get(key)!;

        const total = serviceData.failed + serviceData.successful;

        serviceData.total = serviceData.failed / (total < 1 ? 1 : total);

        serviceData.date += index;

        allData.push(serviceData);
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
                  colors[repositories.findIndex(r => r === props.service)]
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
