import React from 'react';
import { RectangleProps } from 'recharts';

interface CustomBarProps extends RectangleProps {
  payload: any
  tooltipId: string
  mouseOver: (event: any, payload: any) => void
}

const CustomBar: React.FC<CustomBarProps> = ({ x, y, width, height, payload, fill, mouseOver, tooltipId }) => {
  const mOver = (e: any) => {
    if(mouseOver) {
      mouseOver(e, payload)
    }
  }

  return (
    <rect
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
  )
}

export default CustomBar;
