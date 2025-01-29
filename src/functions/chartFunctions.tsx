import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { DoraRecord } from '../interfaces/apiInterfaces';
import { ChartProps, Theme } from '../interfaces/propInterfaces';
import Loading from '../Loading/Loading';
import noDataImg from '../assets/no_data.png';
import { getDateDaysInPast, stripTime } from './dateFunctions';
import {
  defaultGraphEnd,
  defaultGraphStart,
  millisecondsToDays,
} from '../constants';

const hslToHex = (h: number, s: number, l: number) => {
  const hue = Math.round(360 * h);
  const saturation = Math.round(100 * s);
  const lightness = Math.round(100 * l);

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export const extractUniqueRepositories = (data: DoraRecord[]) => {
  const repositorySet = new Set<string>();

  data.forEach(record => {
    repositorySet.add(record.repository);
  });

  return Array.from(repositorySet);
};

export const generateDistinctColors = (count: number) => {
  const colors = [];
  const goldenRatioConjugate = 0.618033988749895;
  let hue = 1; // Start at a random hue

  for (let i = 0; i < count; i++) {
    hue += goldenRatioConjugate;
    hue %= 1;
    const color = hslToHex(hue, 0.9, 0.6); // Convert HSL color to hex
    colors.push(color);
  }

  return colors;
};

export const generateTicks = (start: Date, end: Date, numIntervals: number) => {
  const ticks = [];
  const diff = end.getTime() - start.getTime();

  if (diff / millisecondsToDays < numIntervals) {
    numIntervals = diff / millisecondsToDays;
  }

  const interval = diff / numIntervals;

  for (let i = 0; i < numIntervals; i++) {
    ticks.push(new Date(start.getTime() + interval * i).getTime());
  }

  ticks.push(end.getTime());

  return [...new Set(ticks)];
};

export const formatDateTicks = (tick: any): string => {
  return new Date(tick).toLocaleDateString();
};

export const buildNonGraphBody = (
  componentProps: ChartProps,
  noData: boolean,
  chartType: string,
  messageContainerClassName: string,
  theme?: Theme,
) => {
  let content: any = null;

  if (componentProps.message) {
    content = <span>{componentProps.message}</span>;
  } else if (componentProps.loading) {
    content = <Loading enabled={componentProps.loading} />;
  } else if (noData) {
    content = (
      <img
        alt="No Data"
        title="No Data"
        src={noDataImg}
        style={{ width: '150px' }}
      />
    );
  }

  if (content === null) {
    return null;
  }

  return (
    <div
      data-testid={chartType}
      className={messageContainerClassName}
      data-theme={theme}
    >
      {content}
    </div>
  );
};

const filterGraphData = (data: DoraRecord[], start: Date, end: Date) => {
  const filteredData: DoraRecord[] = [];

  for (let index = 0; index < data.length; index++) {
    const record = data[index];

    const recordTime = record.created_at.getTime();

    if (
      recordTime < end.getTime() + millisecondsToDays &&
      recordTime >= start.getTime()
    ) {
      filteredData.push(record);
    }
  }

  return filteredData;
};

type SharedLogicReturnType = [Date, Date, string[], string[], boolean];

export const useSharedLogic = (
  componentProps: ChartProps,
  graphDataComposer: (componentProps: ChartProps, data: DoraRecord[]) => any,
  setGraphData: Dispatch<SetStateAction<any>>,
  postCompose?: (
    componentProps: ChartProps,
    allData: DoraRecord[],
    composedData: any,
  ) => void,
): SharedLogicReturnType => {
  const [repositories, setRepositories] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [noData, setNoData] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date>(
    componentProps.graphStart ?? getDateDaysInPast(defaultGraphStart),
  );
  const [endDate, setEndDate] = useState<Date>(
    componentProps.graphEnd ?? getDateDaysInPast(defaultGraphEnd),
  );

  const organizeData = (data: DoraRecord[], start: Date, end: Date) => {
    if (!data || data.length === 0) {
      setNoData(true);
      setRepositories([]);
      setGraphData([]);
      setColors([]);
      return;
    }

    setNoData(false);

    const filteredData = filterGraphData(componentProps.data, start, end);

    const composedData = graphDataComposer(componentProps, filteredData);

    if (postCompose) {
      postCompose(componentProps, filteredData, composedData);
    }

    setGraphData(composedData);

    const repositories = extractUniqueRepositories(filteredData);

    setRepositories(repositories);

    setColors(generateDistinctColors(repositories.length));
  };

  useEffect(() => {
    let start =
      componentProps.graphStart || getDateDaysInPast(defaultGraphStart);
    let end = componentProps.graphEnd || getDateDaysInPast(defaultGraphEnd);

    start = stripTime(start);
    end = stripTime(end);

    setStartDate(start);
    setEndDate(end);

    organizeData(componentProps.data, start, end);
  }, [componentProps.data, componentProps.graphEnd, componentProps.graphStart]);

  return [startDate, endDate, colors, repositories, noData];
};
