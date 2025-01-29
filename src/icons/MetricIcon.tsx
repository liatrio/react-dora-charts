import React, { ReactNode, Dispatch, SetStateAction } from 'react';
import { DoraMetric } from '../interfaces/metricInterfaces';
import IconRim from './Rim';
import { purple } from '../constants';
import styles from './icon.module.css';

interface Props {
  metric: DoraMetric;
  metricTitle: string;
  children: ReactNode;
  hideColors?: boolean;
  alwaysShowDetails?: boolean;
}

const MetricIcon: React.FC<Props> = (props: Props) => {
  const childrenWithOverriddenProps = React.Children.map(
    props.children,
    (child: any) => {
      return React.cloneElement(child, { scale: 1.0 });
    },
  );

  return (
    <div className={styles.metricContainer}>
      <div
        className={styles.iconContainer}
        data-tooltip-id="metricTooltip"
        data-tooltip-content={`${props.metricTitle}: ${props.metric.display}`}
      >
        <IconRim color={props.hideColors ? purple : props.metric.color}>
          {childrenWithOverriddenProps}
        </IconRim>
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

export default MetricIcon;
