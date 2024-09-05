import React, { ReactNode, RefObject } from 'react';
import { TooltipRefProps } from 'react-tooltip';
import { DotProps } from 'recharts';
import { v4 as uuidv4 } from 'uuid';

interface CustomDotProps extends DotProps {
  payload: any;
  repository: string;
  tooltipId: string;
  tooltipRef: RefObject<TooltipRefProps>;
  tooltipContentBuilder: () => ReactNode;
}

const CustomDot: React.FC<CustomDotProps> = ({
  cx,
  cy,
  fill,
  payload,
  repository,
  tooltipContentBuilder,
  tooltipRef,
  tooltipId,
}) => {
  const repositoryData = payload.repositories.get(repository);

  if (!repositoryData) {
    return null;
  }

  const mOver = (e: any) => {
    const tooltipContent = tooltipContentBuilder();

    if (tooltipContent) {
      tooltipRef.current?.open({
        content: tooltipContent,
      });
    }
  };

  return (
    <circle
      id={uuidv4()}
      key={uuidv4()}
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
