import React from 'react'
import { Input, Button } from 'antd'

const { TextArea } = Input

const AnswerInput = ({ value, onChange, onSubmit, disabled }) => {
  return (
    <div style={{ spaceY: '1rem' }}>
      <div>
        <label htmlFor="answer" style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#333', marginBottom: '8px' }}>
          Your Answer
        </label>
        <TextArea
          id="answer"
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Type your answer here..."
        />
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
        <Button
          type="primary"
          onClick={onSubmit}
          disabled={disabled}
        >
          Submit Answer
        </Button>
      </div>
    </div>
  )
}

export default AnswerInput