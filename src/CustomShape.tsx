import React from 'react';
import { DotProps } from 'recharts';

interface CustomShapeProps extends DotProps {
  payload: any;
  tooltipId: string;
  mouseOver: (event: any, payload: any) => void;
}

const CustomShape: React.FC<CustomShapeProps> = ({
  cx,
  cy,
  fill,
  payload,
  mouseOver,
  tooltipId,
}) => {
  const mOver = (e: any) => {
    if (mouseOver) {
      mouseOver(e, payload);
    }
  };

  return (
    <circle
      className="customRechartShape"
      cx={cx}
      cy={cy}
      r={4}
      fill={fill}
      stroke="none"
      style={{ cursor: 'pointer' }}
      data-tooltip-id={tooltipId}
      onMouseOver={mOver}
    />
  );
};

export default CustomShape;
