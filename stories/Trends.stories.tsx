import React, { useState } from 'react'
import { StoryFn, Meta } from '@storybook/react'
import TrendGraph from '../src/TrendGraph'
import { ChartProps } from '../src/interfaces/propInterfaces'
import dataSet from './data'
import { getDateRange, isWeekend } from '../src/functions/dateFunctions'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { millisecondsToDays } from '../src/constants'

export default {
  title: 'TrendGraph',
  component: TrendGraph,
} as Meta

const Template: StoryFn<ChartProps> = () => {
  let {start, end} = getDateRange(dataSet[0])

  if(end.getTime() - start.getTime() < millisecondsToDays) {
    start = new Date(start.getTime() - millisecondsToDays)
    end = new Date(end.getTime() + millisecondsToDays)
  }

  const [dataSetIndex, setDataSetIndex] = useState<number>(0)
  const [data, setData] = useState<any>(dataSet[0])
  const [showIndividualTrends, setShowIndividualTrends] = useState<boolean>(false)
  const [calendarStartDate, setCalendarStartDate] = useState<Date>(start)
  const [calendarEndDate, setCalendarEndDate] = useState<Date>(end)
  const [graphStart, setGraphStartDate] = useState<Date>(start)
  const [graphEnd, setGraphEndDate] = useState<Date>(end)

  const changeDataSet = (event: any) => {
    const data = dataSet[event.target.value]

    setData(data)

    const {start, end} = getDateRange(data)

    setCalendarStartDate(start)
    setCalendarEndDate(end)

    setGraphStartDate(start)
    setGraphEndDate(end)

    setDataSetIndex(event.target.value)
  }

  const changeShowMetricTrends = (event: any) => {
    setShowIndividualTrends(event.target.checked)
  }

  const changeDateRange = (dates: any) => {
    const [start, end] = dates

    setCalendarStartDate(start)
    setCalendarEndDate(end)

    if(!start || !end) {
      return
    }

    setGraphStartDate(start)
    setGraphEndDate(end)
  }

  return (
    <div className="graphContainer">
      <div className="editor">
        <div className="editorFieldContainer">
          <label>Data Set:</label>
          <select onChange={changeDataSet} value={dataSetIndex}>
            <option value={0}>Low</option>
            <option value={1}>Medium</option>
            <option value={2}>High</option>
            <option value={3}>Elite</option>
            <option value={4}>Team</option>
          </select>
        </div>
        <div className="editorFieldContainer">
          <label>Show Metric Trends:</label>
          <input type='checkbox' checked={showIndividualTrends} onChange={changeShowMetricTrends} />
        </div>
        <div className="editorFieldContainer">
          <label>Graph Date Range:</label>
          <DatePicker
              selected={calendarStartDate}
              onChange={changeDateRange}
              startDate={calendarStartDate}
              endDate={calendarEndDate}
              selectsRange
              popperPlacement="bottom"
              filterDate={isWeekend}
            />
        </div>
      </div>
      <br/>
      <br/>
      <TrendGraph showIndividualTrends={showIndividualTrends} data={data} graphStart={graphStart} graphEnd={graphEnd} />
    </div>
  )
}

export const Example = Template.bind({})
