import React from 'react';
import { DotProps } from 'recharts';

interface CustomDotProps extends DotProps {
  payload: any
  tooltipId: string
  mouseOver: (event: any, payload: any, repository: string) => void
  repository: string
}

const CustomDot: React.FC<CustomDotProps> = ({ cx, cy, fill, repository, payload, mouseOver, tooltipId}) => {
  const repositoryData = payload.repositories.get(repository)

  if(!repositoryData) {
    return
  }

  const mOver = (e: any) => {
    if(mouseOver) {
      mouseOver(e, payload, repository)
    }
  }

  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill={fill}
      stroke="none"
      onMouseOver={mOver}
      style={{ cursor: 'pointer' }}
      data-tooltip-id={tooltipId}
    />
  );
};

export default CustomDot;
