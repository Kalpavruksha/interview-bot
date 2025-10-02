import React from 'react'
import { Card, CardContent } from './ui/card'
import { CheckCircle, XCircle, Clock, BarChart } from 'lucide-react'

const AnswerDisplay = ({ answer, questionNumber, difficulty, timeTaken }) => {
  const isCorrect = answer.selectedOption === answer.answer
  
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }
  
  return (
    <Card className="border-0 shadow-sm rounded-lg">
      <CardContent className="p-5">
        <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
          <div className="flex items-center">
            <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
              {questionNumber}
            </span>
            <h4 className="font-semibold text-gray-900">Question {questionNumber}</h4>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(difficulty)}`}>
              {difficulty.toUpperCase()}
            </span>
            {timeTaken !== null && (
              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {timeTaken}s
              </span>
            )}
            {answer.score !== undefined && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getScoreColor(answer.score)}`}>
                <BarChart className="w-3 h-3 mr-1" />
                {answer.score}
              </span>
            )}
          </div>
        </div>
        
        <p className="text-gray-700 mb-4">{answer.question}</p>
        
        <div className="mb-4">
          <h5 className="font-medium text-gray-900 mb-2">Your Answer:</h5>
          <div className={`p-3 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center mb-1">
              {isCorrect ? (
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600 mr-2" />
              )}
              <span className="font-medium">Option {answer.selectedOption}</span>
            </div>
            <p className="text-sm text-gray-600">
              {answer.feedback || (isCorrect ? "Correct answer!" : "Incorrect answer.")}
            </p>
          </div>
        </div>
        
        {answer.explanation && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <h5 className="font-medium text-gray-900 mb-1 flex items-center">
              <BarChart className="w-4 h-4 text-blue-600 mr-2" />
              Explanation
            </h5>
            <p className="text-sm text-gray-700">{answer.explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default AnswerDisplay