export interface DoraMetric {
  average: number;
  display: string;
  color: string;
  trend: DoraTrend;
  rank: DoraRank;
}

export interface DoraState {
  deploymentFrequency: DoraMetric;
  changeLeadTime: DoraMetric;
  changeFailureRate: DoraMetric;
  recoverTime: DoraMetric;
}

export enum DoraRank {
  unknown,
  low,
  medium,
  high,
  elite,
}

export enum DoraTrend {
  Improving,
  Declining,
  Neutral,
  Unknown,
}
