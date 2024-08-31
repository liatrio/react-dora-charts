import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import ChangeLeadTimeGraph from '../src/ChangeLeadTimeGraph';
import { ChartProps, Theme } from '../src/interfaces/propInterfaces';
import dataSet from './data';
import { changeLeadTimeName } from '../src/constants';
import './general.css';
import { useGraph } from './useGraph';
import MetricEditor from './MetricEditor';
import EditPanel from './EditPanel';
import { useDarkMode } from 'storybook-dark-mode';

export default {
  title: 'ChangeLeadTimeGraph',
  component: ChangeLeadTimeGraph,
} as Meta;

const Template: StoryFn<ChartProps> = () => {
  const graphArgs = useGraph(dataSet);
  const isDark = useDarkMode();

  return (
    <div
      className="graphContainer"
      data-theme={isDark ? Theme.Dark : Theme.Light}
    >
      <EditPanel args={graphArgs} showStandardFields>
        <MetricEditor
          metricName={changeLeadTimeName}
          metricThresholds={graphArgs.metricThresholdSet.changeLeadTime!}
          onChange={graphArgs.changeThreshold}
        />
      </EditPanel>
      <ChangeLeadTimeGraph
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
