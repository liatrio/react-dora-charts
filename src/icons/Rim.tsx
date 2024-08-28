import React, { Children, ReactNode, useMemo } from 'react';

interface Props {
  color?: string;
  children: ReactNode;
}

const IconRim: React.FC<Props> = props => {
  const color = useMemo(
    () => (props.color ? props.color : '#000000'),
    [props.color],
  );

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <svg
        fill={color}
        width="96px"
        height="96px"
        viewBox="0 0 51 51"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <polygon points="9.81,29 12.63,25.06 16.24,20.02 12.63,20.02 12.63,18.23 25.54,10.78 38.45,18.23 38.45,22.96 41.19,19.14    43.95,23.01 43.95,15.06 25.54,4.43 7.13,15.06 7.13,20.02 3.39,20.02 7.13,25.25  " />
          <polygon points="43.95,25.92 41.19,22.06 38.45,25.88 34.76,31.04 38.45,31.04 38.45,33.14 25.54,40.59 12.63,33.14 12.63,28.02    9.81,31.96 7.13,28.22 7.13,36.32 25.54,46.94 43.95,36.32 43.95,31.04 47.61,31.04  " />
        </g>
      </svg>
      <div style={{ position: 'absolute', display: 'flex' }}>
        {props.children}
      </div>
    </div>
  );
};

export default IconRim;
