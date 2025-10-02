import React from 'react'
import { Progress } from 'antd'

const InterviewProgress = ({ current, total }) => {
  const percentage = (current / total) * 100
  
  return (
    <div className="progress-container">
      <span className="progress-text">Question {current} of {total}</span>
      <Progress 
        percent={percentage} 
        showInfo={false} 
        size="small"
        strokeColor="#1890ff"
        className="progress-bar"
      />
    </div>
  )
}

export default InterviewProgress