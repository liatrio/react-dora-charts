import React from 'react';
import styles from './icon.module.css';

interface Props {
  scale?: number;
}

const ChangeFailureRateIcon: React.FC<Props> = (props: Props) => {
  const scale = props.scale ? props.scale : 1;

  return (
    <svg
      width="28px"
      height="28px"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      transform={`scale(${scale} ${scale})`}
      className={styles.metricIcon}
    >
      <g>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
          d="M30,14c-1.202,0-2.267,0.541-3,1.38C26.267,14.541,25.202,14,24,14h-1v-3c0-3.314-2.686-6-6-6H6 c-3.314,0-6,2.686-6,6v11c0,2.761,2.239,5,5,5h19c2.761,0,5-2.239,5-5v-2.141c1.722-0.446,3-1.997,3-3.859v-1c0-0.552-0.448-1-1-1 H30z M23,18.617c0.522,0.593,1.21,1.037,2,1.242V21c-1.105,0-2-0.895-2-2V18.617z M1,22v-3h3v6.859C2.278,25.412,1,23.862,1,22z M5,19h3v7H5V19z M16,26h-3v-7h1c1.105,0,2,0.895,2,2V26z M12,26H9v-7h3V26z M31,16c0,1.359-0.926,2.547-2.251,2.891L28,19.085V22 c0,2.209-1.791,4-4,4h-7v-5c0-1.657-1.343-3-3-3H1v-7c0-2.761,2.239-5,5-5h11c2.761,0,5,2.239,5,5v8c0,1.657,1.343,3,3,3h1v-2.915 l-0.749-0.194C23.926,18.547,23,17.359,23,16v-1h1c0.864,0,1.662,0.369,2.247,1.038L27,16.899l0.753-0.861 C28.338,15.369,29.136,15,30,15h1V16z M6,14c0,0.552-0.448,1-1,1s-1-0.448-1-1c0-0.552,0.448-1,1-1S6,13.448,6,14z M13,14 c0,0.552-0.448,1-1,1s-1-0.448-1-1c0-0.552,0.448-1,1-1S13,13.448,13,14z"
        ></path>
      </g>
    </svg>
  );
};

export default ChangeFailureRateIcon;
