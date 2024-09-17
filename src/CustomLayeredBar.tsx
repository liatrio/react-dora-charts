import React, { ReactNode, RefObject } from 'react';
import { TooltipRefProps } from 'react-tooltip';
import { RectangleProps } from 'recharts';
import { v4 as uuidv4 } from 'uuid';

interface CustomBarProps extends RectangleProps {
  payload: any;
  color: string;
  tooltipId: string;
  barWidth: number;
  tooltipRef: RefObject<TooltipRefProps>;
  tooltipContentBuilder: (payload: any) => ReactNode;
}

const CustomBar: React.FC<CustomBarProps> = ({
  x,
  y,
  barWidth,
  height,
  payload,
  tooltipId,
  tooltipContentBuilder,
  tooltipRef,
  color,
}) => {
  const mouseOver = (e: any) => {
    const tooltipContent = tooltipContentBuilder(payload);
    tooltipRef.current?.open({
      content: tooltipContent,
    });
  };

  return (
    <rect
      id={uuidv4()}
      key={uuidv4()}
      x={x}
      y={y}
      width={barWidth}
      height={height}
      fill={color}
      stroke="none"
      style={{ cursor: 'pointer' }}
      data-tooltip-id={tooltipId}
      onMouseOver={mouseOver}
    />
  );
};

export default CustomBar;
