import React from 'react'
import { StoryFn, Meta } from '@storybook/react'
import DeploymentFrequencyGraph from '../src/DeploymentFrequencyGraph'
import { ChartProps } from '../src/interfaces/propInterfaces'
import dataSet from './data'
import { deploymentFrequencyName } from '../src/constants'
import './general.css'
import { useGraph } from './useGraph'
import MetricEditor from './MetricEditor'
import EditPanel from './EditPanel'

export default {
  title: 'DeploymentFrequencyGraph',
  component: DeploymentFrequencyGraph,
} as Meta

const Template: StoryFn<ChartProps> = () => {
  const graphArgs = useGraph(dataSet)

  return (
    <div className="graphContainer">
      <EditPanel args={graphArgs} showStandardFields>
        <MetricEditor metricName={deploymentFrequencyName} metricThresholds={graphArgs.metricThresholdSet.deploymentFrequency!} onChange={graphArgs.changeThreshold} />
      </EditPanel>
      <DeploymentFrequencyGraph metricThresholdSet={graphArgs.metricThresholdSet} includeWeekendsInCalculations={graphArgs.includeWeekends} graphStart={graphArgs.graphStart} graphEnd={graphArgs.graphEnd} loading={graphArgs.loading} message={graphArgs.message} data={graphArgs.data} holidays={graphArgs.holidays} />
    </div>
  )
}

export const Example = Template.bind({})