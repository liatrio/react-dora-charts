import { DoraRecord } from './apiInterfaces';

export enum Theme {
  Light,
  Dark,
}

export interface ChartProps {
  data: DoraRecord[];
  graphEnd?: Date;
  graphStart?: Date;
  loading?: boolean;
  includeWeekendsInCalculations?: boolean;
  metricThresholdSet?: MetricThresholdSet;
  message?: string;
  holidays?: Date[];
  theme?: Theme;
}

export interface ThresholdColors {
  elite?: string;
  high?: string;
  medium?: string;
  low?: string;
}

export interface BoardProps extends ChartProps {
  alwaysShowDetails?: boolean;
  colors?: ThresholdColors;
  showTrends?: boolean;
  hideColors?: boolean;
}

export interface TrendProps extends ChartProps {
  showIndividualTrends?: boolean;
}

export interface MetricThresholds {
  elite?: number;
  high?: number;
  medium?: number;
}

export interface MetricThresholdSet {
  deploymentFrequency?: MetricThresholds;
  changeLeadTime?: MetricThresholds;
  changeFailureRate?: MetricThresholds;
  recoverTime?: MetricThresholds;
}
