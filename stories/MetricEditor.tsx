import React from 'react'
import { MetricThresholds } from '../src/interfaces/propInterfaces'
import './general.css'

interface Props {
  metricThresholds: MetricThresholds
  onChange: (event: any) => void
  metricName: string
  postFix?: string
}

const capitalizeCamelCase = (camelCaseString) => {
  const words = camelCaseString.replace(/([a-z])([A-Z])/g, '$1 $2').split(' ')
  
  const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  
  return capitalizedWords.join(' ')
}

const MetricEditor : React.FC<Props> = (props: Props) => {

  return (<>
      <label>{capitalizeCamelCase(props.metricName)} Thresholds:</label>
      <div>
        <label>Elite:</label>&nbsp;
        <input className="editorMetricInput" min={0} type='number' value={props.metricThresholds!.elite!} onChange={props.onChange} data-metric={props.metricName} data-rank="elite" /><span> {props.postFix ? props.postFix : "hrs"}</span>
        <br/>
        <label>High:</label>&nbsp;
        <input className="editorMetricInput" min={0} type='number' value={props.metricThresholds!.high!} onChange={props.onChange} data-metric={props.metricName} data-rank="high" /><span> {props.postFix ? props.postFix : "hrs"}</span>
        <br/>
        <label>Medium:</label>&nbsp;
        <input className="editorMetricInput" min={0} type='number' value={props.metricThresholds!.medium!} onChange={props.onChange} data-metric={props.metricName} data-rank="medium" /><span> {props.postFix ? props.postFix : "hrs"}</span>
      </div>
  </>)
}

export default MetricEditor
