import React, { ReactNode, RefObject } from 'react';
import { TooltipRefProps } from 'react-tooltip';
import { DotProps } from 'recharts';
import { v4 as uuidv4 } from 'uuid';

interface CustomShapeProps extends DotProps {
  tooltipId: string;
  tooltipRef: RefObject<TooltipRefProps>;
  tooltipContentBuilder: () => ReactNode;
}

const CustomShape: React.FC<CustomShapeProps> = ({
  cx,
  cy,
  fill,
  tooltipContentBuilder,
  tooltipRef,
  tooltipId,
}) => {
  const mouseOver = (e: any) => {
    const tooltipContent = tooltipContentBuilder();
    tooltipRef.current?.open({
      content: tooltipContent,
    });
  };

  return (
    <circle
      id={uuidv4()}
      key={uuidv4()}
      className="customRechartShape"
      cx={cx}
      cy={cy}
      r={4}
      fill={fill}
      stroke="none"
      style={{ cursor: 'pointer' }}
      data-tooltip-id={tooltipId}
      onMouseOver={mouseOver}
    />
  );
};

export default CustomShape;
