import React, { ReactNode, RefObject } from 'react';
import { TooltipRefProps } from 'react-tooltip';
import { RectangleProps } from 'recharts';
import { v4 as uuidv4 } from 'uuid';

interface CustomBarProps extends RectangleProps {
  tooltipId: string;
  tooltipRef: RefObject<TooltipRefProps>;
  tooltipContentBuilder: () => ReactNode;
}

const CustomBar: React.FC<CustomBarProps> = ({
  x,
  y,
  width,
  height,
  fill,
  tooltipContentBuilder,
  tooltipRef,
  tooltipId,
}) => {
  const mOver = (e: any) => {
    const tooltipContent = tooltipContentBuilder();
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
      width={width}
      height={height}
      fill={fill}
      stroke="none"
      onMouseOver={mOver}
      style={{ cursor: 'pointer' }}
      data-tooltip-id={tooltipId}
    />
  );
};

export default CustomBar;
