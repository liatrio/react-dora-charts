import React, { ReactNode, useState } from 'react'
import { GraphProperties } from './useGraph'
import DatePicker from 'react-datepicker'
import './general.css'
import "react-datepicker/dist/react-datepicker.css"
import {v4 as uuidv4} from 'uuid'
import { isWeekend } from '../src/functions/dateFunctions'

interface Props {
  children: ReactNode,
  args: GraphProperties,
  showStandardFields: boolean,
}

const EditPanel : React.FC<Props> = (props: Props) => {
  const [dataSet, setDataSet] = useState<number>(0)

  const children = React.Children.toArray(props.children)

  const makeSplitter = () => {
    return (
      <div className="editorSplit"></div>
    )
  }

  const childrenWithSeparator = children.reduce<React.ReactNode[]>((acc, child, index) => {
    if (index > 0 && index % 2 === 0) {
      acc.push(makeSplitter())
    }

    acc.push(<div key={uuidv4()} className="editorFieldContainer">{child}</div>)

    return acc
  }, [])

  const onSelect = (event: any) => {
    props.args.changeDataSet(event)

    setDataSet(event.target.value)
  }

  const caledarChange = props.args.changeDateRange

  return (<>
    <div className="editor">
      <div className="editorFieldContainer">
        <label>Data Set:</label>
        <select onChange={onSelect} value={dataSet}>
          <option value={0}>Low</option>
          <option value={1}>Medium</option>
          <option value={2}>High</option>
          <option value={3}>Elite</option>
          <option value={4}>Team</option>
        </select>
      </div>
      {props.showStandardFields && <>
        <div className="editorFieldContainer">
          <label>Message:</label>
          <input type='text' value={props.args.message ?? ""} onChange={props.args.changeMessage} />
        </div>
        {makeSplitter()}
        <div className="editorFieldContainer">
          <label>Loading:</label>
          <input type='checkbox' checked={props.args.loading} onChange={props.args.changeLoading} />
        </div>
        <div className="editorFieldContainer">
          <label>Include Weekends:</label>
          <input type='checkbox' checked={props.args.includeWeekends} onChange={props.args.changeIncludeWeekends} />
        </div>
        {makeSplitter()}
        {/* todo
        holidays
        */}
      </>}
      {childrenWithSeparator}
      <div className="editorFieldContainer">
        <label>Graph Date Range:</label>
        <DatePicker
            selected={props.args.calendarStartDate}
            onChange={caledarChange}
            startDate={props.args.calendarStartDate}
            endDate={props.args.calendarEndDate}
            selectsRange
            popperPlacement="bottom"
            filterDate={isWeekend}
          />
      </div>
    </div>
  </>)
}

export default EditPanel
