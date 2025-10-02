import React from 'react'
import { Typography } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const QuestionCard = ({ question }) => {
  // Function to prevent copying
  const handleSelectStart = (e) => {
    e.preventDefault()
    return false
  }

  // Function to prevent context menu (right-click)
  const handleContextMenu = (e) => {
    e.preventDefault()
    return false
  }

  // Function to prevent copy, cut, and paste events
  const handleCopy = (e) => {
    e.preventDefault()
    return false
  }

  return (
    <div 
      className="question-card"
      onCopy={handleCopy}
      onCut={handleCopy}
      onPaste={handleCopy}
      onContextMenu={handleContextMenu}
    >
      <div className="question-header">
        <QuestionCircleOutlined className="question-icon" />
        <Title level={4} className="question-title">Question</Title>
      </div>
      <Text 
        className="question-text no-select"
        onSelect={handleSelectStart}
        onMouseDown={handleSelectStart}
      >
        {question}
      </Text>
    </div>
  )
}

export default QuestionCard