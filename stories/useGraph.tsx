import { useState } from "react"
import { getDateRange } from "../src/functions/dateFunctions"
import { MetricThresholdSet } from "../src/interfaces/propInterfaces"
import { DoraRecord } from "../src/interfaces/apiInterfaces"
import { defaultMetricThresholdSet, millisecondsToDays } from "../src/constants"

export interface GraphProperties {
  data: DoraRecord[]
  loading: boolean
  includeWeekends: boolean
  message: string | undefined
  graphStart: Date
  graphEnd: Date
  metricThresholdSet: MetricThresholdSet
  calendarStartDate: Date
  calendarEndDate: Date
  holidays: Date[]
  changeDataSet: (event: any) => void
  changeLoading: (event: any) => void
  changeIncludeWeekends: (event: any) => void
  changeMessage: (event: any) => void
  changeDateRange: (event: any) => void
  changeThreshold: (event: any) => void
  changeHolidays: (event: any) => void
}

export const useGraph = (dataSet: any[]) : GraphProperties => {
  let {start, end} = getDateRange(dataSet[0])

  if(end.getTime() - start.getTime() < millisecondsToDays) {
    start = new Date(start.getTime() - millisecondsToDays)
    end = new Date(end.getTime() + millisecondsToDays)
  }

  const [data, setData] = useState<any>(dataSet[0])
  const [loading, setLoading] = useState<boolean>(false)
  const [includeWeekends, setIncludeWeekends] = useState<boolean>(false)
  const [message, setMessage] = useState<string | undefined>()
  const [graphStartDate, setGraphStartDate] = useState<Date>(start)
  const [graphEndDate, setGraphEndDate] = useState<Date>(end)
  const [calendarStartDate, setCalendarStartDate] = useState<Date>(start)
  const [calendarEndDate, setCalendarEndDate] = useState<Date>(end)
  const [metricThresholdSet, setMetricThresholdSet] = useState<MetricThresholdSet>({...defaultMetricThresholdSet})
  const [holidays, setHolidays] = useState<Date[]>([])

  const changeHolidays = (event: any) => {
    //todo
  }

  const changeDataSet = (event: any) => {
    setData(dataSet[event.target.value])

    let {start, end} = getDateRange(dataSet[event.target.value])

    if(end.getTime() - start.getTime() < millisecondsToDays) {
      start = new Date(start.getTime() - millisecondsToDays)
      end = new Date(end.getTime() + millisecondsToDays)
    }

    setGraphStartDate(start)
    setGraphEndDate(end)
    setCalendarStartDate(start)
    setCalendarEndDate(end)
  }

  const changeLoading = (event: any) => {
    setLoading(event.target.checked)
  }

  const changeIncludeWeekends = (event: any) => {
    setIncludeWeekends(event.target.checked)
  }

  const changeMessage = (event: any) => {
    if(event.target.value !== message) {
      setMessage(event.target.value)
    }
  }

  const changeDateRange = (dates: any) => {
    let [start, end] = dates

    setCalendarStartDate(start)
    setCalendarEndDate(end)

    if(!start || !end) {
      return
    }

    if(end.getTime() - start.getTime() < millisecondsToDays) {
      start = new Date(start.getTime() - millisecondsToDays)
      end = new Date(end.getTime() + millisecondsToDays)
    }

    setGraphStartDate(start)
    setGraphEndDate(end)
  }

  const changeThreshold = (event: any) => {
    const metric = event.target.dataset.metric
    const rank = event.target.dataset.rank

    setMetricThresholdSet(prev => {
      const obj = {...prev} as any
      const def = defaultMetricThresholdSet as any

      const newValue = event.target.value ?? def[metric][rank]

      if(obj[metric][rank] === newValue) {
        return prev
      }

      obj[metric][rank] = Number.parseFloat(newValue)

      return obj
    })
  }

  return {
    metricThresholdSet: metricThresholdSet,
    includeWeekends: includeWeekends,
    graphStart: graphStartDate,
    graphEnd: graphEndDate,
    loading: loading,
    message: message,
    data: data,
    holidays: holidays,
    calendarEndDate: calendarEndDate,
    calendarStartDate: calendarStartDate,
    changeDataSet: changeDataSet,
    changeLoading: changeLoading,
    changeIncludeWeekends: changeIncludeWeekends,
    changeMessage: changeMessage,
    changeDateRange: changeDateRange,
    changeThreshold: changeThreshold,
    changeHolidays: changeHolidays,
  }
}
