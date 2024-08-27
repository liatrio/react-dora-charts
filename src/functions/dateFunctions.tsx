import { millisecondsToDays } from "../constants";
import { DoraRecord } from "../interfaces/apiInterfaces";

export const stripTime = (date: Date, end?: boolean): Date => {
  let newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  if(end) {
    newDate.setMilliseconds(date.getMilliseconds() - 1)
  }

  return newDate
}

export const getDateDaysInPast = (daysInPast: number, dateOnly: boolean = true) : Date => {
  let date = new Date();

  date.setDate(date.getDate() - daysInPast)

  if(dateOnly) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
  } else {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds())
  }
}

export const getDateDaysInPastUtc = (daysInPast: number, dateOnly: boolean = true) : Date => {
  let date = new Date()

  date.setDate(date.getDate() - daysInPast)

  return dateToUtc(date, dateOnly)
}

export const utcDateToLocal = (date: Date, dateOnly: boolean = true) => {
  if(dateOnly) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
  } else {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds())
  }
}

export const dateToUtc = (date: Date, dateOnly: boolean = true) => {
  if(dateOnly) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
  } else {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()))
  }
}

export const getDateRange = (data: DoraRecord[]) : {start: Date, end: Date} => {
  let start = getDateDaysInPast(-30000)
  let end = getDateDaysInPast(30000)

  data.forEach((value: DoraRecord) => {
    if(value.created_at.getTime() < start.getTime()) {
      start = value.created_at
    }
    if(value.created_at.getTime() > end.getTime()) {
      end = value.created_at
    }
  })

  return {start, end}
}

export const subtractHolidays = (diff: number, start: Date, end: Date, holidays: Date[]) : number => {
  for(const holiday of holidays) {
    if(holiday >= start && holiday < end) {
      diff -= millisecondsToDays
    }
  }

  return diff
}

export const subtractWeekends = (diff: number, start: Date, end: Date) : number => {
  let local_start = new Date(start)
  let local_end = new Date(end)
  const gapDays = Math.floor(diff / millisecondsToDays)

  if(gapDays > 1) {
    while(local_start.getTime() <= local_end.getTime()) {
      let current_day = local_start.getDay()

      if(current_day === 0 || current_day === 6) {
        diff -= millisecondsToDays
      }

      local_start.setDate(local_start.getDate() + 1)
    }
  }

  return diff
}

export const getStartOfWeek = (date: Date): number => {
  date = new Date(date)
  const day = date.getDay()
  const diff = date.getDate() - day
  const startOfWeek = new Date(date.setDate(diff))

  startOfWeek.setHours(0, 0, 0, 0)

  return startOfWeek.getTime()
}

export const getEndOfWeek = (date: Date): number => {
  const startOfWeek = new Date(getStartOfWeek(date))
  const endOfWeek = new Date(startOfWeek)

  endOfWeek.setDate(startOfWeek.getDate() + 6)
  endOfWeek.setHours(23, 59, 59, 999)

  return endOfWeek.getTime()
}

export const isWeekend = (date: Date) => {
  const day = date.getDay()

  return day === 0 || day === 6
}