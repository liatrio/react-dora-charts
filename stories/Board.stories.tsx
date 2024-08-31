import React, { useState } from 'react';
import { StoryFn, Meta } from '@storybook/react';
import Board from '../src/Boards/Board';
import { ChartProps, Theme } from '../src/interfaces/propInterfaces';
import dataSet from './data';
import {
  changeFailureRateName,
  changeLeadTimeName,
  deploymentFrequencyName,
  recoverTimeName,
} from '../src/constants';
import './general.css';
import { useGraph } from './useGraph';
import EditPanel from './EditPanel';
import MetricEditor from './MetricEditor';
import { useDarkMode } from 'storybook-dark-mode';

export default {
  title: 'Board',
  component: Board,
} as Meta;

const Template: StoryFn<ChartProps> = () => {
  const graphArgs = useGraph(dataSet);
  const isDark = useDarkMode();

  const [hideColors, setHideColors] = useState<boolean>(false);
  const [showTrends, setShowTrends] = useState<boolean>(false);
  const [alwaysShowDetails, setAlwaysShowDetails] = useState<boolean>(false);

  const changeHideColors = (event: any) => {
    setHideColors(event.target.checked);
  };

  const changeShowTrends = (event: any) => {
    setShowTrends(event.target.checked);
  };

  const changeAlwaysShowDetails = (event: any) => {
    setAlwaysShowDetails(event.target.checked);
  };

  return (
    <div className="graphContainer" data-theme={isDark ? Theme.Dark : Theme.Light}>
      <EditPanel args={graphArgs} showStandardFields>
        <MetricEditor
          metricName={deploymentFrequencyName}
          metricThresholds={graphArgs.metricThresholdSet.deploymentFrequency!}
          onChange={graphArgs.changeThreshold}
        />
        <MetricEditor
          metricName={changeLeadTimeName}
          metricThresholds={graphArgs.metricThresholdSet.changeLeadTime!}
          onChange={graphArgs.changeThreshold}
        />
        <MetricEditor
          metricName={changeFailureRateName}
          metricThresholds={graphArgs.metricThresholdSet.changeFailureRate!}
          onChange={graphArgs.changeThreshold}
        />
        <MetricEditor
          metricName={recoverTimeName}
          metricThresholds={graphArgs.metricThresholdSet.recoverTime!}
          onChange={graphArgs.changeThreshold}
        />
        <div>
          <label>Hide Colors:</label>
          <input
            type="checkbox"
            checked={hideColors}
            onChange={changeHideColors}
          />
        </div>
        <div>
          <label>Show Trends:</label>
          <input
            type="checkbox"
            checked={showTrends}
            onChange={changeShowTrends}
          />
        </div>
        <div>
          <label>Always Show Details:</label>
          <input
            type="checkbox"
            checked={alwaysShowDetails}
            onChange={changeAlwaysShowDetails}
          />
        </div>
      </EditPanel>
      <Board
        hideColors={hideColors}
        alwaysShowDetails={alwaysShowDetails}
        showTrends={showTrends}
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
