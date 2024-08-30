import React, { useEffect, useState } from 'react';
import styles from './board.module.css';
import { Tooltip } from 'react-tooltip';
import DeployFrequencyIcon from '../icons/DeploymentFrequencyIcon';
import ChangeLeadTimeIcon from '../icons/ChangeLeadTimeIcon';
import ChangeFailureRateIcon from '../icons/ChangeFailureRateIcon';
import RecoverTimeIcon from '../icons/RecoverTimeIcon';
import { BoardProps } from '../interfaces/propInterfaces';
import { DoraState } from '../interfaces/metricInterfaces';
import { boardName, defaultDoraState } from '../constants';
import { buildDoraState } from '../functions/metricFunctions';
import { buildNonGraphBody } from '../functions/chartFunctions';
import MetricIcon from '../icons/MetricIcon';
import TrendIcon from '../icons/TrendIcon';

const Board: React.FC<BoardProps> = props => {
  const [state, setState] = useState<DoraState>({ ...defaultDoraState });
  const [noData, setNoData] = useState<boolean>(false);
  const [tooltipContent, setTooltipContent] = useState<any>(true);

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

  const nonGraphBody = buildNonGraphBody(props, noData, boardName);

  if (nonGraphBody) {
    return nonGraphBody;
  }

  if (props.showTrends) {
    return (
      <div data-testid={boardName} className={styles.board}>
        <TrendIcon
          metric={state.deploymentFrequency}
          metricTitle={'Deployment Frequency'}
          alwaysShowDetails={props.alwaysShowDetails}
          setTooltipContent={setTooltipContent}
        >
          <DeployFrequencyIcon />
        </TrendIcon>
        <TrendIcon
          metric={state.changeLeadTime}
          metricTitle={'Change Lead Time'}
          alwaysShowDetails={props.alwaysShowDetails}
          setTooltipContent={setTooltipContent}
        >
          <ChangeLeadTimeIcon />
        </TrendIcon>
        <TrendIcon
          metric={state.changeFailureRate}
          metricTitle={'Change Failure Rate'}
          alwaysShowDetails={props.alwaysShowDetails}
          setTooltipContent={setTooltipContent}
        >
          <ChangeFailureRateIcon />
        </TrendIcon>
        <TrendIcon
          metric={state.recoverTime}
          metricTitle={'Recover Time'}
          alwaysShowDetails={props.alwaysShowDetails}
          setTooltipContent={setTooltipContent}
        >
          <RecoverTimeIcon />
        </TrendIcon>
        {!props.alwaysShowDetails && (
          <Tooltip
            className={styles.boardTooltip}
            id="scoreTooltip"
            classNameArrow={styles.boardTooltipArrow}
            border="1"
            content={tooltipContent}
          />
        )}
      </div>
    );
  } else {
    return (
      <div data-testid={boardName} className={styles.board}>
        <MetricIcon
          metric={state.deploymentFrequency}
          metricTitle={'Deployment Frequency'}
          alwaysShowDetails={props.alwaysShowDetails}
          hideColors={props.hideColors}
          setTooltipContent={setTooltipContent}
        >
          <DeployFrequencyIcon />
        </MetricIcon>
        <MetricIcon
          metric={state.changeLeadTime}
          metricTitle={'Change Lead Time'}
          alwaysShowDetails={props.alwaysShowDetails}
          hideColors={props.hideColors}
          setTooltipContent={setTooltipContent}
        >
          <ChangeLeadTimeIcon />
        </MetricIcon>
        <MetricIcon
          metric={state.changeFailureRate}
          metricTitle={'Change Failure Rate'}
          alwaysShowDetails={props.alwaysShowDetails}
          hideColors={props.hideColors}
          setTooltipContent={setTooltipContent}
        >
          <ChangeFailureRateIcon />
        </MetricIcon>
        <MetricIcon
          metric={state.recoverTime}
          metricTitle={'Recover Time'}
          alwaysShowDetails={props.alwaysShowDetails}
          hideColors={props.hideColors}
          setTooltipContent={setTooltipContent}
        >
          <RecoverTimeIcon />
        </MetricIcon>
        {!props.alwaysShowDetails && (
          <Tooltip
            className={styles.boardTooltip}
            id="scoreTooltip"
            classNameArrow={styles.boardTooltipArrow}
            border="1"
            opacity="1"
            content={tooltipContent}
          />
        )}
      </div>
    );
  }
};

export default Board;
