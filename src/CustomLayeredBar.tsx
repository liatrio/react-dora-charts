import React from 'react';
import { RectangleProps } from 'recharts';
import { v4 as uuidv4 } from 'uuid';

interface CustomBarProps extends RectangleProps {
  payload: any;
  color: string;
  tooltipId: string;
  barWidth: number;
  mouseOver: (event: any, payload: any) => void;
}

const CustomBar: React.FC<CustomBarProps> = ({
  x,
  y,
  barWidth,
  height,
  payload,
  mouseOver,
  tooltipId,
  color,
}) => {
  const mOver = (e: any) => {
    if (mouseOver) {
      mouseOver(e, payload);
    }
  };

  return (
    <rect
      x={x}
      y={y}
      width={barWidth}
      height={height}
      fill={color}
      stroke="none"
      onMouseOver={mOver}
      style={{ cursor: 'pointer' }}
      data-tooltip-id={tooltipId}
    />
  );
};

export default CustomBar;
