import React, { useEffect, useState } from 'react';
import styles from './chart.module.css';
import { Tooltip } from 'react-tooltip';
import DeployFrequencyIcon from './icons/DeploymentFrequencyIcon';
import ChangeLeadTimeIcon from './icons/ChangeLeadTimeIcon';
import ChangeFailureRateIcon from './icons/ChangeFailureRateIcon';
import RecoverTimeIcon from './icons/RecoverTimeIcon';
import { BoardProps } from './interfaces/propInterfaces';
import { DoraState } from './interfaces/metricInterfaces';
import { boardName, defaultDoraState } from './constants';
import { buildDoraState } from './functions/metricFunctions';
import { buildNonGraphBody } from './functions/chartFunctions';
import MetricIcon from './icons/MetricIcon';
import TrendIcon from './icons/TrendIcon';

const Board: React.FC<BoardProps> = props => {
  const [state, setState] = useState<DoraState>({ ...defaultDoraState });
  const [noData, setNoData] = useState<boolean>(false);

  useEffect(() => {
    if (!props.data || props.data.length === 0) {
      setNoData(true);
      return;
    }

    setNoData(false);

    const state = buildDoraState(props, props.data);

    setState(state);
  }, [
    props.data,
    props.graphEnd,
    props.graphStart,
    props.includeWeekendsInCalculations,
    props.holidays,
    props.metricThresholdSet,
  ]);

  const nonGraphBody = buildNonGraphBody(
    props,
    noData,
    boardName,
    styles.messageContainer,
    props.theme,
  );

  if (nonGraphBody) {
    return nonGraphBody;
  }

  if (props.showTrends) {
    return (
      <div
        data-testid={boardName}
        className={styles.board}
        data-theme={props.theme}
      >
        <TrendIcon
          metric={state.deploymentFrequency}
          metricTitle={'Deployment Frequency'}
          alwaysShowDetails={props.alwaysShowDetails}
        >
          <DeployFrequencyIcon />
        </TrendIcon>
        <TrendIcon
          metric={state.changeLeadTime}
          metricTitle={'Change Lead Time'}
          alwaysShowDetails={props.alwaysShowDetails}
        >
          <ChangeLeadTimeIcon />
        </TrendIcon>
        <TrendIcon
          metric={state.changeFailureRate}
          metricTitle={'Change Failure Rate'}
          alwaysShowDetails={props.alwaysShowDetails}
        >
          <ChangeFailureRateIcon />
        </TrendIcon>
        <TrendIcon
          metric={state.recoverTime}
          metricTitle={'Recover Time'}
          alwaysShowDetails={props.alwaysShowDetails}
        >
          <RecoverTimeIcon />
        </TrendIcon>
        {!props.alwaysShowDetails && (
          <Tooltip
            className={styles.tooltip}
            id="metricTooltip"
            classNameArrow={styles.tooltipArrow}
            border="1px"
          />
        )}
      </div>
    );
  } else {
    return (
      <div
        data-testid={boardName}
        className={styles.board}
        data-theme={props.theme}
      >
        <MetricIcon
          metric={state.deploymentFrequency}
          metricTitle={'Deployment Frequency'}
          alwaysShowDetails={props.alwaysShowDetails}
          hideColors={props.hideColors}
        >
          <DeployFrequencyIcon />
        </MetricIcon>
        <MetricIcon
          metric={state.changeLeadTime}
          metricTitle={'Change Lead Time'}
          alwaysShowDetails={props.alwaysShowDetails}
          hideColors={props.hideColors}
        >
          <ChangeLeadTimeIcon />
        </MetricIcon>
        <MetricIcon
          metric={state.changeFailureRate}
          metricTitle={'Change Failure Rate'}
          alwaysShowDetails={props.alwaysShowDetails}
          hideColors={props.hideColors}
        >
          <ChangeFailureRateIcon />
        </MetricIcon>
        <MetricIcon
          metric={state.recoverTime}
          metricTitle={'Recover Time'}
          alwaysShowDetails={props.alwaysShowDetails}
          hideColors={props.hideColors}
        >
          <RecoverTimeIcon />
        </MetricIcon>
        {!props.alwaysShowDetails && (
          <Tooltip
            className={styles.tooltip}
            id="metricTooltip"
            classNameArrow={styles.tooltipArrow}
            border="1px"
            opacity="1"
          />
        )}
      </div>
    );
  }
};

export default Board;
