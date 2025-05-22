import { DoraRecord } from '../interfaces/apiInterfaces';
import { defaultDaysToPull, recordDateKeys } from '../constants';
import { getDateDaysInPastUtc } from './dateFunctions';

export const recordReviver = (key: string, value: any) => {
  if (recordDateKeys.includes(key) && value) {
    return new Date(value);
  }

  return value;
};

export const filterFetchedData = (
  props: FetchProps,
  data: DoraRecord[],
): DoraRecord[] => {
  return data.filter(record => {
    const repositoryMatch =
      props.repositories === undefined ||
      props.repositories.length === 0 ||
      props.repositories.includes(record.repository);
    const teamMatch = !props.team || record.team === props.team;

    return repositoryMatch && teamMatch;
  });
};

export interface FetchProps {
  api?: string;
  getAuthHeaderValue?: () => Promise<string | undefined>;
  team?: string;
  repositories?: string[];
  daysToPull?: number;
  includeWeekendsInCalculations?: boolean;
  holidays?: Date[];
}

export const processData = (json: string, props: FetchProps) => {
  let parsedData = JSON.parse(json, recordReviver);

  parsedData = filterFetchedData(props, parsedData.records);

  return parsedData;
};

export const fetchData = async (
  props: FetchProps,
  onSuccess: (data: any) => void,
  onFailure?: (data: any) => void,
) => {
  if (!props.api) {
    return;
  }

  const start = props.daysToPull
    ? getDateDaysInPastUtc(props.daysToPull)
    : getDateDaysInPastUtc(defaultDaysToPull);
  const end = getDateDaysInPastUtc(1);

  const body = {
    repositories: props.repositories,
    team: props.team,
    start: start,
    end: end,
  };

  let headers = {};

  if (props.getAuthHeaderValue) {
    headers = {
      'Content-Type': 'application/json',
      Authorization: await props.getAuthHeaderValue(),
    };
  } else {
    headers = {
      'Content-Type': 'application/json',
    };
  }

  const options = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body),
  };

  try {
    const response = await fetch(props.api, options);
    const json = await response.text();

    let parsedData = processData(json, props);

    onSuccess(parsedData);
  } catch (error) {
    if (onFailure) {
      onFailure(error);
    }
  }
};
