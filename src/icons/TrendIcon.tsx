import React, { ReactNode, Dispatch, SetStateAction } from 'react';
import { DoraMetric } from '../interfaces/metricInterfaces';
import styles from './icon.module.css';
import TrendIndicator from './TrendIndicator';

interface Props {
  metric: DoraMetric;
  metricTitle: string;
  children: ReactNode;
  setTooltipContent: Dispatch<SetStateAction<string>>;
  alwaysShowDetails?: boolean;
}

const TrendIcon: React.FC<Props> = (props: Props) => {
  const childrenWithOverriddenProps = React.Children.map(
    props.children,
    (child: any) => {
      return React.cloneElement(child, { scale: 2.5 });
    },
  );

  return (
    <div
      className={styles.metricContainer}
      data-tooltip-id="scoreTooltip"
      onMouseOver={() =>
        props.setTooltipContent(`${props.metricTitle}: ${props.metric.display}`)
      }
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '76px',
          height: '76px',
        }}
      >
        {childrenWithOverriddenProps}
        <TrendIndicator trend={props.metric.trend} />
      </div>
      {props.alwaysShowDetails && (
        <div className={styles.detailContent}>
          <span>
            {props.metricTitle}:<br />
            {props.metric.display}
          </span>
        </div>
      )}
    </div>
  );
};

export default TrendIcon;
