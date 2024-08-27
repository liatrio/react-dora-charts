import React, { useMemo } from 'react';

interface Props {
  color?: string;
  scale?: number;
}

const ChangeLeadTimeIcon: React.FC<Props> = (props: Props) => {
  const color = useMemo(
    () => (props.color ? props.color : '#000000'),
    [props.color],
  );
  const scale = props.scale ? props.scale : 1;

  return (
    <svg
      fill={color}
      width="28px"
      height="28px"
      viewBox="0 0 51 51"
      xmlns="http://www.w3.org/2000/svg"
      transform={`scale(${scale} ${scale})`}
    >
      <g
        style={{ fill: 'none' }}
        transform="matrix(2.125,0,0,2.125,-0.07661427,-0.03851964)"
      >
        <path
          d="m 5.06152,12 c 0.4921,-3.94631 3.85849,-7 7.93808,-7 4.4183,0 8,3.58172 8,8 0,4.4183 -3.5817,8 -8,8 H 8 m 5,-8 V 9 M 11,3 h 4 M 3,15 h 5 m -3,3 h 5"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default ChangeLeadTimeIcon;
