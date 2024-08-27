import { DoraRecord } from "../interfaces/apiInterfaces"
import { defaultDaysToPull, millisecondsToHours, recordDateKeys } from "../constants"
import { subtractHolidays, subtractWeekends, getDateDaysInPastUtc, utcDateToLocal } from "./dateFunctions"

export const recordReviver = (key: string, value: any) => {
  if (recordDateKeys.includes(key) && value) {
      return new Date(value)
  }

  return value
}

export const expandFetchedData = (props: FetchProps, data: DoraRecord[]) => {
  data.forEach((record) => {
    if(record.merged_at) {
      const mergedAt = record.merged_at
      const deployedAt = record.fixed_at ? record.fixed_at : record.created_at

      let diff = deployedAt.getTime() - mergedAt.getTime()

      if(!props.includeWeekendsInCalculations) {
        diff = subtractWeekends(diff, mergedAt, deployedAt)
      }

      if(props.holidays && props.holidays.length > 0) {
        diff = subtractHolidays(diff, mergedAt, deployedAt, props.holidays)
      }

      record.totalCycle = diff / millisecondsToHours
    }

    const fixedAt = record.fixed_at ? record.fixed_at : getDateDaysInPastUtc(0)

    if(record.failed_at) {
      const failedAt = record.failed_at.getTime()

      record.recoverTime = parseFloat(((fixedAt.getTime() - failedAt) / millisecondsToHours).toFixed(2))
    }

    record.created_at = record.created_at ? utcDateToLocal(record.created_at, false) : record.created_at
    record.merged_at = record.merged_at ? utcDateToLocal(record.merged_at, false) : record.merged_at
    record.fixed_at = record.failed_at ? utcDateToLocal(fixedAt, false) : fixedAt
    record.failed_at = record.failed_at ? utcDateToLocal(record.failed_at, false) : record.failed_at
  })
}

export const filterFetchedData = (props: FetchProps, data: DoraRecord[]) : DoraRecord[] => {
  return data.filter(record => {
    const repositoryMatch = props.repositories === undefined || props.repositories.length === 0 || props.repositories.includes(record.repository)
    const teamMatch = !props.team || record.team === props.team

    return repositoryMatch && teamMatch
  })
}

export interface FetchProps {
  api?: string
  getAuthHeaderValue?: () => Promise<string | undefined>
  team?: string
  repositories?: string[]
  daysToPull?: number
  includeWeekendsInCalculations?: boolean
  holidays?: Date[]
}

export const processData = (json: string, props: FetchProps) => {
  let parsedData = JSON.parse(json, recordReviver)

  parsedData = filterFetchedData(props, parsedData.records)

  expandFetchedData(props, parsedData)

  return parsedData
}

export const fetchData = async (props: FetchProps, onSuccess: (data: any) => void, onFailure?: (data: any) => void) => {
  if(!props.api) {
    return
  }

  const start = props.daysToPull ? getDateDaysInPastUtc(props.daysToPull) : getDateDaysInPastUtc(defaultDaysToPull)
  const end = getDateDaysInPastUtc(1)

  const body = {
      repositories: props.repositories,
      team: props.team,
      start: start,
      end: end
  }

  let headers = {}

  if(props.getAuthHeaderValue) {
    headers = {
      'Content-Type': 'application/json',
      'Authorization': await props.getAuthHeaderValue()
    }
  } else {
    headers = {
      'Content-Type': 'application/json',
    }
  }

  const options = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
  }

  try {
      const response = await fetch(props.api, options)
      const json = await response.text()

      let parsedData = processData(json, props)

      onSuccess(parsedData)
  } catch (error) {
      if(onFailure) {
        onFailure(error)
      }
  }
}
