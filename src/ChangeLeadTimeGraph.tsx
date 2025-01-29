import React, { useState, useRef, useMemo } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import TooltipContent from './ToolTip/TooltipContent';
import { Tooltip, TooltipRefProps } from 'react-tooltip';
import CustomShape from './CustomShape';
import { DoraRecord } from './interfaces/apiInterfaces';
import { ChartProps, Theme } from './interfaces/propInterfaces';
import {
  buildNonGraphBody,
  formatDateTicks,
  generateTicks,
  useSharedLogic,
} from './functions/chartFunctions';
import {
  buildDoraState,
  calculateCycleTime,
} from './functions/metricFunctions';
import { changeLeadTimeName, tooltipHideDelay } from './constants';
import styles from './chart.module.css';

interface ProcessRepository {
  mergeTime: number;
  graphCycleTime: number;
  originalCycleTime: number;
  cycleLabel: string;
  changeUrl: string;
  title: string;
  user: string;
}

export const composeGraphData = (props: ChartProps, data: DoraRecord[]) => {
  let resp = data.reduce(
    (acc: Map<string, ProcessRepository[]>, record: DoraRecord) => {
      if (!record.merged_at) {
        return acc;
      }

      const repository = record.repository;

      const cycleTime = calculateCycleTime(props, record);

      let entry: ProcessRepository = {
        mergeTime: record.merged_at.getTime(),
        originalCycleTime: cycleTime,
        graphCycleTime: cycleTime,
        cycleLabel: ' hrs',
        changeUrl: record.change_url,
        title: record.title ?? '',
        user: record.user ?? '',
      };

      let repositoryEntry = acc.get(repository);

      if (!repositoryEntry) {
        repositoryEntry = [];

        acc.set(repository, repositoryEntry);
      }

      repositoryEntry.push(entry);

      return acc;
    },
    new Map<string, ProcessRepository[]>(),
  );

  return resp;
};

const renderTooltip = (payload: ProcessRepository, repository: string) => {
  const title = (
    <h3>
      <a
        className={styles.toolTipLink}
        href={payload.changeUrl}
        target="_blank"
      >
        {payload.title}
      </a>
    </h3>
  );

  const body = (
    <>
      <p>Repository: {repository}</p>
      <p>
        Total Cycle Time: {payload.originalCycleTime.toFixed(2)}{' '}
        {payload.cycleLabel}
      </p>
    </>
  );

  const footer = <span>Commit By: {payload.user}</span>;

  return <TooltipContent title={title} body={body} footer={footer} />;
};

const ChangeLeadTimeGraph: React.FC<ChartProps> = (props: ChartProps) => {
  const [graphData, setGraphData] = useState<Map<string, ProcessRepository[]>>(
    new Map<string, ProcessRepository[]>(),
  );
  const tooltipRef = useRef<TooltipRefProps>(null);
  const [yLabel, setYLabel] = useState<any>(' hrs');

  const postCompose = (
    componentProps: ChartProps,
    data: DoraRecord[],
    composedData: any,
  ) => {
    const state = buildDoraState(componentProps, data);

    let graphMultiplier = 1;

    if (state.changeLeadTime.average > 48) {
      graphMultiplier = 1 / 24;
      setYLabel(' days');
    } else if (state.changeLeadTime.average < 1) {
      graphMultiplier = 60;
      setYLabel(' mins');
    } else {
      setYLabel(' hrs');
    }

    composedData.forEach((repositories: ProcessRepository[], key: string) => {
      repositories.forEach((repository: ProcessRepository) => {
        repository.graphCycleTime *= graphMultiplier;

        let multiplier = 1;
        let label = ' hrs';

        if (repository.originalCycleTime > 48) {
          multiplier = 1 / 24;
          label = ' days';
        } else if (repository.originalCycleTime < 1) {
          multiplier = 60;
          label = ' mins';
        }

        repository.originalCycleTime *= multiplier;
        repository.cycleLabel = label;
      });
    });
  };

  const [startDate, endDate, colors, _, noData] = useSharedLogic(
    props,
    composeGraphData,
    setGraphData,
    postCompose,
  );

  const tickProperties = useMemo(() => {
    return {
      fill: { fill: props.theme === Theme.Dark ? '#FFF' : '#000' },
      ticks: generateTicks(startDate, endDate, 5),
      domain: [startDate.getTime(), endDate.getTime()],
      padding: { left: 9, right: 9 },
    };
  }, [startDate, endDate, props.theme]);

  const nonGraphBody = buildNonGraphBody(
    props,
    noData,
    changeLeadTimeName,
    styles.messageContainer,
    props.theme,
  );

  if (nonGraphBody) {
    return nonGraphBody;
  }

  return (
    <div
      data-testid={changeLeadTimeName}
      className={styles.chartWrapper}
      data-theme={props.theme}
    >
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          width={500}
          height={300}
          margin={{
            right: 40,
            top: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            padding={tickProperties.padding}
            dataKey="mergeTime"
            tickSize={15}
            type={'number'}
            ticks={tickProperties.ticks}
            tick={tickProperties.fill}
            domain={tickProperties.domain}
            tickFormatter={formatDateTicks}
          />
          <YAxis
            type="number"
            dataKey="graphCycleTime"
            name="Time"
            unit={yLabel}
            tick={tickProperties.fill}
          />
          {Array.from(graphData.keys()).map(
            (repository: string, idx: number) => (
              <Scatter
                animationDuration={0}
                key={repository}
                data={graphData.get(repository)}
                fill={colors[idx]}
                shape={(props: any) => (
                  <CustomShape
                    {...props}
                    tooltipId="cltTooltip"
                    tooltipRef={tooltipRef}
                    tooltipContentBuilder={() =>
                      renderTooltip(props.payload, repository)
                    }
                  />
                )}
                activeShape={(props: any) => (
                  <CustomShape
                    {...props}
                    tooltipId="cltTooltip"
                    tooltipRef={tooltipRef}
                    tooltipContentBuilder={() =>
                      renderTooltip(props.payload, repository)
                    }
                  />
                )}
              />
            ),
          )}
        </ScatterChart>
      </ResponsiveContainer>
      <Tooltip
        ref={tooltipRef}
        className={styles.tooltip}
        delayHide={tooltipHideDelay}
        clickable={true}
        classNameArrow={styles.tooltipArrow}
        id="cltTooltip"
        border="1px"
        opacity="1"
      />
    </div>
  );
};

export default ChangeLeadTimeGraph;
