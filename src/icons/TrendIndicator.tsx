import React from 'react'
import { DoraTrend } from '../interfaces/metricInterfaces'
import { green, grey, purple, yellow } from '../constants'

interface Props {
  trend: DoraTrend
}

const TrendIndicator : React.FC<Props> = (props: Props) => {
  let indicator = <></>

  if (props.trend === DoraTrend.Unknown) {
    indicator =
      <svg className='lrd_unknownIndicator' viewBox="0 0 24 24" fill={grey} xmlns="http://www.w3.org/2000/svg">
        <rect x="10.75" y="15.75" width="2.5" height="2.5" fill={grey}/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 8C10.8048 8 10 9.08576 10 10H8C8 8.19752 9.49569 6 12 6C14.4955 6 16 8.14203 16 10C16 11.5781 14.8917 12.3782 14.2062 12.8732C14.1659 12.9023 14.1271 12.9303 14.09 12.9574C13.3354 13.5088 13 13.8231 13 14.5H11C11 12.7382 12.1612 11.8897 12.9067 11.345L12.91 11.3426C13.7425 10.7343 14 10.5038 14 10C14 9.0498 13.2039 8 12 8Z" fill={grey} />
      </svg>
  } else if (props.trend === DoraTrend.Neutral) {
    indicator =
    <svg className='lrd_neutralIndicator' fill={purple} viewBox="-3 0 19 19" xmlns="http://www.w3.org/2000/svg">
      <path d="M.289 6.883a1.03 1.03 0 0 1 1.03-1.03h10.363a1.03 1.03 0 0 1 0 2.059H1.318A1.03 1.03 0 0 1 .29 6.882zm12.422 4.604a1.03 1.03 0 0 1-1.03 1.03H1.319a1.03 1.03 0 1 1 0-2.059h10.364a1.03 1.03 0 0 1 1.029 1.03z"/>
    </svg>
  } else {
    const rotation = props.trend === DoraTrend.Declining ? 90 : 270
    const color = props.trend === DoraTrend.Declining ? yellow : green

    indicator = (
      <svg className='lrd_arrowIndicator' fill={color} transform={`rotate(${rotation})`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.027 512.027">
        <g>
          <g>
            <path d="M508.907,248.087L295.467,36.033c-4.16-4.053-10.987-4.053-15.04,0.107c-1.92,1.92-2.987,4.587-3.093,7.36v126.72H10.667
              C4.8,170.22,0,175.02,0,180.887V330.22c0,5.867,4.8,10.667,10.667,10.667h266.667v127.467c0,4.267,2.56,8.213,6.613,9.813
              c1.28,0.533,2.667,0.853,4.053,0.853c2.88,0,5.547-1.067,7.573-3.093l213.333-212.693
              C513.067,258.967,513.067,252.247,508.907,248.087z M298.667,443.073V330.22c0-5.867-4.8-10.667-10.667-10.667H21.333v-128H288
              c5.867,0,10.667-4.8,10.667-10.667V67.927l187.627,187.307L298.667,443.073z"/>
          </g>
        </g>
      </svg>
    )
  }

  return indicator
}

export default TrendIndicator
