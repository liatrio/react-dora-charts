import React from 'react';
import './Loading.css'

interface Props {
  enabled: boolean
}

const Loading = (props: Props) => {
  if(!props.enabled) {
    return (<></>)
  }

  return (
    <div className="overlay"><span className="loader"></span></div>
  )
}

export default Loading