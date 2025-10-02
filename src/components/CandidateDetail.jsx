import React from 'react'
import { useSelector } from 'react-redux'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card'
import { Button } from './ui/button'
import { toast } from 'react-hot-toast'
import { exportCandidateReport } from '../utils/exportUtils'
import AnswerDisplay from './AnswerDisplay'
import { Download, User, Mail, Phone, Calendar, Award, BarChart } from 'lucide-react'

const CandidateDetail = () => {
  const { currentCandidate } = useSelector(state => state.interview)
  
  if (!currentCandidate) {
    return null
  }
  
  const handleExportReport = () => {
    try {
      exportCandidateReport(currentCandidate, `candidate_${currentCandidate.id}_report.json`)
      toast.success('Candidate report exported successfully!')
    } catch (error) {
      console.error('Error exporting candidate report:', error)
      toast.error('Failed to export candidate report')
    }
  }
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
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
    <Card className="border-0 shadow-md rounded-xl">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-xl font-bold flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Candidate Profile
            </CardTitle>
            <CardDescription>
              Detailed interview results and performance analysis
            </CardDescription>
          </div>
          <Button onClick={handleExportReport} size="sm" className="flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Flagged candidate warning */}
        {currentCandidate.flagged && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-bold">Candidate Flagged for Review</span>
            </div>
            <p className="mt-2">This candidate has been flagged for potential cheating: {currentCandidate.flaggedReason}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-center">
              <User className="w-5 h-5 text-blue-600 mr-2" />
              <h4 className="font-medium text-gray-900">Name</h4>
            </div>
            <p className="text-lg font-semibold mt-1">{currentCandidate.name}</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg border border-green-100">
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-green-600 mr-2" />
              <h4 className="font-medium text-gray-900">Email</h4>
            </div>
            <p className="text-lg font-semibold mt-1">{currentCandidate.email}</p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100">
            <div className="flex items-center">
              <Phone className="w-5 h-5 text-purple-600 mr-2" />
              <h4 className="font-medium text-gray-900">Phone</h4>
            </div>
            <p className="text-lg font-semibold mt-1">{currentCandidate.phone}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-100">
            <div className="flex items-center">
              <Award className="w-5 h-5 text-amber-600 mr-2" />
              <h4 className="font-medium text-gray-900">Final Score</h4>
            </div>
            <p className={`text-2xl font-bold mt-1 ${getScoreColor(currentCandidate.score || 0)}`}>
              {currentCandidate.score || 'N/A'}
              <span className="text-lg">/100</span>
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-lg border border-emerald-100">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-emerald-600 mr-2" />
              <h4 className="font-medium text-gray-900">Completed</h4>
            </div>
            <p className="text-lg font-semibold mt-1">
              {formatDate(currentCandidate.completedAt)}
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-4 rounded-lg border border-violet-100">
            <div className="flex items-center">
              <BarChart className="w-5 h-5 text-violet-600 mr-2" />
              <h4 className="font-medium text-gray-900">Questions Answered</h4>
            </div>
            <p className="text-2xl font-bold mt-1 text-violet-600">
              {currentCandidate.answers?.length || 0}
            </p>
          </div>
        </div>
        
        {currentCandidate.summary && (
          <Card className="mb-6 border-0 shadow-sm rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <BarChart className="w-5 h-5 mr-2 text-blue-600" />
                AI Performance Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{currentCandidate.summary}</p>
            </CardContent>
          </Card>
        )}
        
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart className="w-5 h-5 mr-2 text-gray-600" />
            Question & Answers
          </h3>
          <div className="space-y-4">
            {currentCandidate.answers && currentCandidate.answers.length > 0 ? (
              currentCandidate.answers.map((answer, index) => (
                <AnswerDisplay 
                  key={answer.id || index}
                  answer={answer}
                  questionNumber={index + 1}
                  difficulty={answer.difficulty || 'medium'}
                  timeTaken={currentCandidate.timers ? currentCandidate.timers[`q${index + 1}`] : null}
                />
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No answers available</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CandidateDetail