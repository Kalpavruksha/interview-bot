import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, Button, Result } from 'antd'
import { FieldTimeOutlined } from '@ant-design/icons'

const WelcomeBackModal = ({ onResume, onRestart }) => {
  const dispatch = useDispatch()
  const { currentCandidate, interviewStatus, questions, currentQuestionIndex } = useSelector(state => state.interview)
  
  // Calculate progress
  const totalQuestions = questions ? questions.length : 0
  const answeredQuestions = currentCandidate && currentCandidate.answers ? currentCandidate.answers.length : 0
  const progressText = totalQuestions > 0 ? `${answeredQuestions}/${totalQuestions} questions completed` : 'Starting interview'
  
  const handleResume = () => {
    console.log('Resuming interview with state:', { 
      interviewStatus, 
      currentQuestionIndex, 
      totalQuestions, 
      answeredQuestions 
    })
    
    // Restore the interview state properly
    dispatch({ type: 'SET_SHOW_WELCOME_BACK', payload: false })
    
    // If we're resuming an interview that was in progress or paused, make sure the status is correct
    if (interviewStatus === 'not-started' && totalQuestions > 0) {
      // If interview hasn't started yet but questions are generated, we can start it
      // The user will still need to click "Start Interview" in the chat
    } else if ((interviewStatus === 'in-progress' || interviewStatus === 'paused') && totalQuestions > 0) {
      // Ensure the interview status is set correctly
      dispatch({ type: 'SET_INTERVIEW_STATUS', payload: interviewStatus })
    }
    
    onResume()
  }
  
  const handleRestart = () => {
    dispatch({ type: 'SET_SHOW_WELCOME_BACK', payload: false })
    dispatch({ type: 'RESET_INTERVIEW' })
    onRestart()
  }
  
  return (
    <Modal
      open={true}
      footer={null}
      closable={false}
      width={400}
      className="welcome-modal"
    >
      <Result
        icon={<FieldTimeOutlined style={{ color: '#1890ff' }} />}
        title="Welcome Back!"
        subTitle={
          <div>
            <p>We found an unfinished interview session.</p>
            <p className="text-sm text-gray-600 mt-2">{progressText}</p>
            <p className="text-sm text-gray-600">Would you like to resume where you left off or start a new interview?</p>
          </div>
        }
        extra={[
          <Button type="primary" key="resume" onClick={handleResume} size="large">
            Resume Interview
          </Button>,
          <Button key="restart" onClick={handleRestart} size="large">
            Start New Interview
          </Button>
        ]}
      />
    </Modal>
  )
}

export default WelcomeBackModal