import React from 'react'
import { Progress, Tag, Space } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'

const QuestionTimer = ({ timeLeft, totalTime, difficulty, isPaused }) => {
  // Calculate percentage for progress bar
  const percentage = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0
  
  // Determine color based on difficulty
  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy': return 'success'
      case 'medium': return 'warning'
      case 'hard': return 'error'
      default: return 'default'
    }
  }
  
  // Determine progress bar color
  const getProgressColor = () => {
    if (percentage > 50) return '#52c41a' // green
    if (percentage > 25) return '#faad14' // yellow
    return '#ff4d4f' // red
  }
  
  return (
    <div className="timer-container">
      <div className="timer-header">
        <Tag color={getDifficultyColor()}>{difficulty} Question</Tag>
        <Space>
          <ClockCircleOutlined />
          <span className="timer-display" style={{ color: getProgressColor() }}>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </span>
        </Space>
      </div>
      
      <Progress 
        percent={percentage} 
        strokeColor={getProgressColor()}
        showInfo={false}
        size="small"
      />
      
      {isPaused && (
        <div style={{ textAlign: 'center', color: '#faad14', fontWeight: '500', marginTop: '8px' }}>
          Interview Paused
        </div>
      )}
    </div>
  )
}

export default QuestionTimer