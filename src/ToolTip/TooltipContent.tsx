import React, { ReactNode } from 'react'
import './TooltipContent.css'

export interface Props {
  onClose?: () => void
  title?: ReactNode
  body?: ReactNode
  footer?: ReactNode
}

const TooltipContent : React.FC<Props> = ({title, body, footer}: Props) => {
  return (
    <div>
      <div className="dora-tooltip-header">
        {title}
      </div>
      <div className="dora-tooltip-body">
        {body}
      </div>
      {footer &&
        <div className="dora-tooltip-footer">{footer}</div>
      }
    </div>
  )
}

export default TooltipContent