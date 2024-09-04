import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import ChangeFailureRateGraph from '../src/ChangeFailureRateGraph';
import { ChartProps, Theme } from '../src/interfaces/propInterfaces';
import dataSet from './data';
import { changeFailureRateName } from '../src/constants';
import './general.css';
import { useGraph } from './useGraph';
import MetricEditor from './MetricEditor';
import EditPanel from './EditPanel';
import { useDarkMode } from 'storybook-dark-mode';

export default {
  title: 'ChangeFailureRateGraph',
  component: ChangeFailureRateGraph,
} as Meta;

const Template: StoryFn<ChartProps> = () => {
  const graphArgs = useGraph(dataSet);
  const isDark = useDarkMode();

  return (
    <div className="graphContainer" data-theme={isDark ? 'dark' : 'light'}>
      <EditPanel args={graphArgs} showStandardFields>
        <MetricEditor
          metricName={changeFailureRateName}
          metricThresholds={graphArgs.metricThresholdSet.changeFailureRate!}
          onChange={graphArgs.changeThreshold}
        />
      </EditPanel>
      <ChangeFailureRateGraph
        metricThresholdSet={graphArgs.metricThresholdSet}
        includeWeekendsInCalculations={graphArgs.includeWeekends}
        graphStart={graphArgs.graphStart}
        graphEnd={graphArgs.graphEnd}
        loading={graphArgs.loading}
        message={graphArgs.message}
        data={graphArgs.data}
        holidays={graphArgs.holidays}
        theme={isDark ? Theme.Dark : Theme.Light}
      />
    </div>
  );
};

export const Example = Template.bind({});
