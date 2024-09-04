import { DoraRecord } from '../interfaces/apiInterfaces';
import {
  blue,
  changeFailureRateName,
  changeLeadTimeName,
  defaultDoraMetric,
  defaultDoraState,
  defaultGraphEnd,
  defaultGraphStart,
  defaultMetricThresholdSet,
  deploymentFrequencyName,
  green,
  grey,
  millisecondsToDays,
  millisecondsToHours,
  orange,
  recoverTimeName,
  yellow,
} from '../constants';
import {
  getDateDaysInPast,
  getDateDaysInPastUtc,
  subtractHolidays,
  subtractWeekends,
} from './dateFunctions';
import {
  BoardProps,
  ChartProps,
  MetricThresholds,
  ThresholdColors,
} from '../interfaces/propInterfaces';
import {
  DoraMetric,
  DoraState,
  DoraRank,
  DoraTrend,
} from '../interfaces/metricInterfaces';

export const calculateCycleTime = (
  props: ChartProps,
  record: DoraRecord,
): number => {
  const mergedAt = record.merged_at!;
  const deployedAt = record.failed_at
    ? record.fixed_at ?? getDateDaysInPastUtc(0)
    : record.created_at;

  let diff = deployedAt.getTime() - mergedAt.getTime();

  if (!props.includeWeekendsInCalculations) {
    diff = subtractWeekends(diff, mergedAt, deployedAt);
  }

  if (props.holidays && props.holidays.length > 0) {
    diff = subtractHolidays(diff, mergedAt, deployedAt, props.holidays);
  }

  const cycleTime = diff / millisecondsToHours;

  return cycleTime;
};

export const calculateRecoverTime = (record: DoraRecord): number => {
  const fixedAt = (record.fixed_at ?? getDateDaysInPastUtc(0)).getTime();
  const failedAt = record.failed_at!.getTime();

  const recoverTime = parseFloat(
    ((fixedAt - failedAt) / millisecondsToHours).toFixed(2),
  );

  return recoverTime;
};

const calculateChangeFailureRateAverage = (
  _: ChartProps,
  data: DoraRecord[],
): number => {
  const totalSuccessfulRecords = data.filter(
    f => f.status && !f.failed_at,
  ).length;
  const totalFailedRecords = data.filter(
    f => !f.status || (f.status && f.failed_at),
  ).length;

  if (totalFailedRecords === 0 && totalSuccessfulRecords === 0) {
    return NaN;
  }

  return (
    (totalFailedRecords /
      (totalSuccessfulRecords === 0 ? 1 : totalSuccessfulRecords)) *
    100
  );
};

const calculateChangeLeadTimeAverage = (
  props: ChartProps,
  data: DoraRecord[],
): number => {
  let totalSuccessfulRecords = 0;
  let totalLeadTime = 0;

  data.forEach(record => {
    if (!record.merged_at) {
      return;
    }

    const cycleTime = calculateCycleTime(props, record);

    totalSuccessfulRecords++;
    totalLeadTime += cycleTime;
  });

  if (totalSuccessfulRecords === 0) {
    return NaN;
  }

  return totalLeadTime / totalSuccessfulRecords;
};

const calculateDeploymentFrequencyAverage = (
  props: ChartProps,
  data: DoraRecord[],
): number => {
  let sorted = data.sort(
    (a, b) => a.created_at.getTime() - b.created_at.getTime(),
  );

  if (sorted.length <= 0) {
    return NaN;
  }

  if (sorted.length === 1) {
    return (
      ((props.graphEnd?.getTime() ?? getDateDaysInPast(1).getTime()) -
        (props.graphStart?.getTime() ?? getDateDaysInPast(31).getTime())) /
      millisecondsToHours
    );
  }

  let totalDeployTime = 0;

  for (let index = 1; index < sorted.length; index++) {
    let start = sorted[index - 1].created_at;
    let end = sorted[index].created_at;
    let diff = end.getTime() - start.getTime();

    if (!props.includeWeekendsInCalculations) {
      diff = subtractWeekends(diff, start, end);
    }

    if (props.holidays && props.holidays.length > 0) {
      diff = subtractHolidays(diff, start, end, props.holidays);
    }

    totalDeployTime += diff;
  }

  const resp = totalDeployTime / sorted.length / millisecondsToHours;
  return resp;
};

const calculateRecoverTimeAverage = (
  _: ChartProps,
  data: DoraRecord[],
): number => {
  let totalFailedRecords = 0;
  let totalRecoveryTime = 0;

  data.forEach(record => {
    if (record.status && !record.failed_at) {
      return;
    }

    const recoverTime = calculateRecoverTime(record);

    totalFailedRecords++;
    totalRecoveryTime += recoverTime;
  });

  if (totalFailedRecords === 0) {
    return NaN;
  }

  return totalRecoveryTime / totalFailedRecords;
};

const calculateMetric = (
  metricName: string,
  props: ChartProps,
  data: DoraRecord[],
) => {
  let calculator: any = null;
  const defaultThresholds: MetricThresholds = (
    defaultMetricThresholdSet as any
  )[metricName];
  const thresholds: MetricThresholds = props.metricThresholdSet
    ? (props.metricThresholdSet as any)[metricName]
    : null;

  if (metricName === deploymentFrequencyName) {
    calculator = calculateDeploymentFrequencyAverage;
  } else if (metricName === changeFailureRateName) {
    calculator = calculateChangeFailureRateAverage;
  } else if (metricName === changeLeadTimeName) {
    calculator = calculateChangeLeadTimeAverage;
  } else if (metricName === recoverTimeName) {
    calculator = calculateRecoverTimeAverage;
  } else {
    return { ...defaultDoraMetric };
  }

  const metric: DoraMetric = { ...defaultDoraMetric };

  metric.average = calculator(props, data);
  metric.rank = determineMetricRank(
    metric.average,
    defaultThresholds,
    thresholds,
  );
  metric.color = determineMetricColor(
    metric.rank,
    (props as BoardProps).colors,
  );
  metric.display = generateMetricDisplay(metric.average, metricName);

  return metric;
};

const determineMetricRank = (
  value: number,
  defaultThresholds?: MetricThresholds,
  thresholds?: MetricThresholds,
): DoraRank => {
  if (Number.isNaN(value)) {
    return DoraRank.unknown;
  } else if (
    value <
    (thresholds?.elite ? thresholds.elite : defaultThresholds?.elite ?? 0)
  ) {
    return DoraRank.elite;
  } else if (
    value < (thresholds?.high ? thresholds.high : defaultThresholds?.high ?? 0)
  ) {
    return DoraRank.high;
  } else if (
    value <
    (thresholds?.medium ? thresholds.medium : defaultThresholds?.medium ?? 0)
  ) {
    return DoraRank.medium;
  } else {
    return DoraRank.low;
  }
};

const determineMetricColor = (
  rank: DoraRank,
  thresholdColors?: ThresholdColors,
): string => {
  if (rank === DoraRank.unknown) {
    return grey;
  } else if (rank === DoraRank.elite) {
    return thresholdColors?.elite ? thresholdColors.elite : green;
  } else if (rank === DoraRank.high) {
    return thresholdColors?.high ? thresholdColors.high : blue;
  } else if (rank === DoraRank.medium) {
    return thresholdColors?.medium ? thresholdColors.medium : yellow;
  } else {
    return thresholdColors?.low ? thresholdColors.low : orange;
  }
};

export const generateMetricDisplay = (
  value: number,
  metricName?: string,
): string => {
  if (Number.isNaN(value)) {
    return '?';
  } else if (metricName === changeFailureRateName) {
    return `${value.toFixed(2)}%`;
  } else if (value < 1) {
    return `${(value * 60).toFixed(2)} mins`;
  } else if (value < 48) {
    return `${value.toFixed(2)} hrs`;
  } else {
    return `${(value / 24).toFixed(2)} days`;
  }
};

export const buildDoraStateForPeriod = (
  props: ChartProps,
  data: DoraRecord[],
  start: Date,
  end: Date,
): DoraState => {
  let state: any = { ...defaultDoraState };

  const filteredData = [...data].filter((record: DoraRecord) => {
    const createdAt = record.created_at.getTime();

    return createdAt >= start.getTime() && createdAt < end.getTime();
  });

  Object.keys(state).forEach(metricName => {
    state[metricName] = calculateMetric(metricName, props, filteredData);
  });

  return state;
};

export const buildDoraState = (
  props: ChartProps,
  data: DoraRecord[],
): DoraState => {
  const start = props.graphStart || getDateDaysInPast(defaultGraphStart);
  const end = props.graphEnd || getDateDaysInPast(defaultGraphEnd);

  const period = (end.getTime() - start.getTime()) * millisecondsToDays;

  const previousStart = new Date(start);
  previousStart.setDate(previousStart.getDate() - period);

  const previousState: any = buildDoraStateForPeriod(
    props,
    data,
    previousStart,
    start,
  );
  const currentState: any = buildDoraStateForPeriod(props, data, start, end);

  Object.keys(currentState).forEach(metricName => {
    const previousAvg = previousState[metricName].average;
    const currentAvg = currentState[metricName].average;
    const previousNaN = Number.isNaN(previousAvg);
    const currentNaN = Number.isNaN(currentAvg);
    let trend = DoraTrend.Unknown;

    if (previousNaN && !currentNaN) {
      trend = DoraTrend.Improving;
    } else if (!previousNaN && currentNaN) {
      trend = DoraTrend.Neutral;
    } else {
      const diff = previousAvg - currentAvg;

      if (diff > 0) {
        trend = DoraTrend.Declining;
      } else if (diff < 0) {
        trend = DoraTrend.Improving;
      } else {
        trend = DoraTrend.Neutral;
      }
    }

    currentState[metricName].trend = trend;
  });

  return currentState;
};
