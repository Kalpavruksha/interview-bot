import React, { useEffect } from 'react'
import { Typography, Tooltip } from 'antd'
import { QuestionCircleOutlined, LockOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const SecureQuestionDisplay = ({ question }) => {
  // Function to prevent text selection
  const preventSelection = (e) => {
    e.preventDefault()
    return false
  }

  // Function to prevent context menu
  const preventContextMenu = (e) => {
    e.preventDefault()
    return false
  }

  // Function to prevent keyboard shortcuts for copying
  const preventKeyboardCopy = (e) => {
    // Prevent Ctrl+C, Ctrl+X, Ctrl+V, Ctrl+A
    if (
      (e.ctrlKey && (e.keyCode === 67 || e.keyCode === 88 || e.keyCode === 86 || e.keyCode === 65)) ||
      (e.metaKey && (e.keyCode === 67 || e.keyCode === 88 || e.keyCode === 86 || e.keyCode === 65))
    ) {
      e.preventDefault()
      return false
    }
  }

  // Function to prevent drag and drop
  const preventDrag = (e) => {
    e.preventDefault()
    return false
  }

  useEffect(() => {
    // Add event listeners to prevent copying
    document.addEventListener('copy', preventSelection)
    document.addEventListener('cut', preventSelection)
    document.addEventListener('paste', preventSelection)
    document.addEventListener('contextmenu', preventContextMenu)
    document.addEventListener('keydown', preventKeyboardCopy)
    document.addEventListener('dragstart', preventDrag)
    document.addEventListener('selectstart', preventSelection)

    // Cleanup event listeners
    return () => {
      document.removeEventListener('copy', preventSelection)
      document.removeEventListener('cut', preventSelection)
      document.removeEventListener('paste', preventSelection)
      document.removeEventListener('contextmenu', preventContextMenu)
      document.removeEventListener('keydown', preventKeyboardCopy)
      document.removeEventListener('dragstart', preventDrag)
      document.removeEventListener('selectstart', preventSelection)
    }
  }, [])

  return (
    <div 
      className="question-card secure-question"
      onCopy={preventSelection}
      onCut={preventSelection}
      onPaste={preventSelection}
      onContextMenu={preventContextMenu}
      onSelect={preventSelection}
      onMouseDown={preventSelection}
      onDragStart={preventDrag}
    >
      <div className="question-header">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <QuestionCircleOutlined className="question-icon" />
          <Title level={4} className="question-title">Question</Title>
        </div>
        <Tooltip title="Copying is disabled to maintain interview integrity">
          <LockOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
        </Tooltip>
      </div>
      <Text 
        className="question-text no-select secure-text"
        onSelect={preventSelection}
        onMouseDown={preventSelection}
        onContextMenu={preventContextMenu}
      >
        {question}
      </Text>
      <div style={{ 
        fontSize: '12px', 
        color: '#8c8c8c', 
        marginTop: '12px', 
        fontStyle: 'italic',
        display: 'flex',
        alignItems: 'center'
      }}>
        <LockOutlined style={{ marginRight: '4px', fontSize: '12px' }} />
        This content is protected. Copying is disabled.
      </div>
    </div>
  )
}

export default SecureQuestionDisplay