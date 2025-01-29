import React, { ReactNode } from 'react';
import styles from './tooltipContent.module.css';

export interface Props {
  onClose?: () => void;
  title?: ReactNode;
  body?: ReactNode;
  footer?: ReactNode;
}

const TooltipContent: React.FC<Props> = ({ title, body, footer }: Props) => {
  return (
    <div>
      <div className={styles.tooltipHeader}>{title}</div>
      <div className={styles.tooltipBody}>{body}</div>
      {footer && <div className={styles.tooltipFooter}>{footer}</div>}
    </div>
  );
};

export default TooltipContent;
