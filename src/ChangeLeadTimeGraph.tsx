import React, { useState, useRef } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import TooltipContent from './ToolTip/TooltipContent';
import { Tooltip } from 'react-tooltip';
import CustomShape from './CustomShape';
import { DoraRecord } from './interfaces/apiInterfaces';
import { ChartProps, Theme } from './interfaces/propInterfaces';
import {
  buildNonGraphBody,
  formatDateTicks,
  generateTicks,
  useSharedLogic,
} from './functions/chartFunctions';
import { buildDoraState } from './functions/metricFunctions';
import { changeLeadTimeName } from './constants';
import { v4 as uuidv4 } from 'uuid';
import styles from './chart.module.css';

interface ProcessRepository {
  mergeTime: number;
  graphCycleTime: number;
  originalCycleTime: number;
  cycleLabel: string;
  changeUrl: string;
  title: string;
  user: string;
  id: string;
}

export const composeGraphData = (_: ChartProps, data: DoraRecord[]) => {
  const resp = data.reduce(
    (acc: Map<string, ProcessRepository[]>, record: DoraRecord) => {
      if (!record.merged_at) {
        return acc;
      }

      const repository = record.repository;

      let entry: ProcessRepository = {
        mergeTime: record.merged_at.getTime(),
        originalCycleTime: record.totalCycle,
        graphCycleTime: record.totalCycle,
        cycleLabel: ' hrs',
        changeUrl: record.change_url,
        title: record.title ?? '',
        user: record.user ?? '',
        id: uuidv4(),
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

const ChangeLeadTimeGraph: React.FC<ChartProps> = (props: ChartProps) => {
  const [graphData, setGraphData] = useState<Map<string, ProcessRepository[]>>(
    new Map<string, ProcessRepository[]>(),
  );
  const [tooltipContent, setTooltipContent] = useState<any>(null);
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);
  const [node, setNode] = useState<any>(null);
  const [position, setPosition] = useState<any>(null);
  const [yLabel, setYLabel] = useState<any>(' hrs');

  const postCompose = (
    componentProps: ChartProps,
    data: DoraRecord[],
    composedData: any,
  ) => {
    const state = buildDoraState(componentProps, data);

    let label = ' hrs';
    let multiplier = 1;

    if (state.changeLeadTime.average > 48) {
      multiplier = 1 / 24;
      label = ' days';
    } else if (state.changeLeadTime.average < 1) {
      multiplier = 60;
      label = ' mins';
    }

    composedData.forEach((repositories: ProcessRepository[], key: string) => {
      repositories.forEach((repository: ProcessRepository) => {
        repository.graphCycleTime *= multiplier;
      });
    });

    setYLabel(label);
  };

  const [startDate, endDate, colors, _, noData] = useSharedLogic(
    props,
    composeGraphData,
    setGraphData,
    postCompose,
  );

  const timeoutRef = useRef<any>(null);

  const ticks = generateTicks(startDate, endDate, 5);

  const nonGraphBody = buildNonGraphBody(
    props,
    noData,
    changeLeadTimeName,
    styles.messageContainer,
  );

  if (nonGraphBody) {
    return nonGraphBody;
  }

  function getElementCenter(element: any) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return { x: centerX, y: centerY };
  }

  const handleMouseOverDot = (
    event: any,
    payload: ProcessRepository,
    repository: string,
  ) => {
    if (payload.id === node) {
      return;
    } else {
      setNode(payload.id);
      setTooltipOpen(true);
    }

    const center = getElementCenter(event.target);

    setPosition(center);

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

    setTooltipContent(
      <TooltipContent title={title} body={body} footer={footer} />,
    );
  };

  const handleMouseMoveContainer = (event: any) => {
    if (!tooltipOpen) {
      return;
    }

    if (event.target.tagName === 'svg' || event.target.tagName === 'line') {
      if (!timeoutRef.current) {
        setNode(null);
        timeoutRef.current = setTimeout(() => {
          setTooltipOpen(false);
        }, 1000);
      }
    } else if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleMouseMoveChart = (coords: any, event: any) => {
    handleMouseMoveContainer(event);
  };

  const handleMouseOut = (event: any) => {
    if (!timeoutRef.current) {
      setNode('');
      timeoutRef.current = setTimeout(() => {
        setTooltipOpen(false);
      }, 1000);
    }
  };

  const tickColor = props.theme === Theme.Dark ? '#FFF' : '#000';

  return (
    <div
      data-testid={changeLeadTimeName}
      className={styles.chartWrapper}
      onMouseMove={handleMouseMoveContainer}
      onMouseOut={handleMouseOut}
      data-theme={props.theme === Theme.Dark ? 'dark' : 'light'}
    >
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          width={500}
          height={300}
          margin={{
            right: 40,
            top: 10,
          }}
          onMouseMove={handleMouseMoveChart}
          onMouseLeave={handleMouseOut}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            padding={{ left: 9, right: 9 }}
            dataKey="mergeTime"
            tickSize={15}
            type={'number'}
            tick={{ fill: tickColor }}
            ticks={ticks}
            domain={[startDate.getTime(), endDate.getTime()]}
            tickFormatter={formatDateTicks}
          />
          <YAxis
            type="number"
            dataKey="graphCycleTime"
            name="Time"
            unit={yLabel}
            tick={{ fill: tickColor }}
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
                    mouseOver={(event: any, payload: ProcessRepository) =>
                      handleMouseOverDot(event, payload, repository)
                    }
                  />
                )}
                activeShape={(props: any) => (
                  <CustomShape
                    {...props}
                    tooltipId="cltTooltip"
                    mouseOver={(event: any, payload: ProcessRepository) =>
                      handleMouseOverDot(event, payload, repository)
                    }
                  />
                )}
              />
            ),
          )}
        </ScatterChart>
      </ResponsiveContainer>
      <Tooltip
        className={styles.chartTooltip}
        offset={20}
        isOpen={tooltipOpen}
        position={position}
        clickable={true}
        classNameArrow={styles.chartTooltipArrow}
        id="cltTooltip"
        border="1px"
        opacity="1"
        content={tooltipContent}
      />
    </div>
  );
};

export default ChangeLeadTimeGraph;
