import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card'
import { Button } from './ui/button'
import { CheckCircle, Trophy, Target, Clock, BarChart } from 'lucide-react'
import dayjs from 'dayjs'

const InterviewSummary = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentCandidate } = useSelector(state => state.interview)
  
  const handleRestart = () => {
    dispatch({ type: 'RESET_INTERVIEW' })
    navigate('/')
  }
  
  const handleViewDashboard = () => {
    // Set the completed candidate as the current candidate in the dashboard
    if (currentCandidate && currentCandidate.id) {
      // The candidate is already in allCandidates, so we just navigate
      navigate('/interviewer')
    } else {
      navigate('/interviewer')
    }
  }
  
  // Automatically navigate to dashboard after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      handleViewDashboard()
    }, 5000)
    
    return () => clearTimeout(timer)
  }, [])
  
  // Calculate detailed statistics
  const correctAnswers = currentCandidate?.answers?.filter(a => a.correct).length || 0
  const totalQuestions = currentCandidate?.answers?.length || 0
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
  
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }
  
  const getScoreRange = (score) => {
    if (score >= 90) return 'Outstanding'
    if (score >= 80) return 'Excellent'
    if (score >= 70) return 'Good'
    if (score >= 60) return 'Satisfactory'
    if (score >= 50) return 'Needs Improvement'
    return 'Poor'
  }
  
  const getScoreDescription = (score) => {
    if (score >= 90) return 'Exceptional performance demonstrating mastery of the subject matter.'
    if (score >= 80) return 'Strong performance with solid understanding of key concepts.'
    if (score >= 70) return 'Good performance with competent knowledge in most areas. Well done!'
    if (score >= 60) return 'Satisfactory performance with basic understanding of core concepts.'
    if (score >= 50) return 'Below average performance indicating areas for improvement.'
    return 'Poor performance requiring significant improvement in fundamental concepts.'
  }
  
  const getScoreRecommendation = (score) => {
    if (score >= 90) return 'Ready for advanced positions. Continue expanding expertise.'
    if (score >= 80) return 'Well-suited for intermediate roles. Focus on advanced topics.'
    if (score >= 70) return 'Good fit for entry-level positions. Minor improvements would make you even stronger.'
    if (score >= 60) return 'Consider additional training before applying for positions.'
    if (score >= 50) return 'Significant improvement needed. Recommend foundational courses.'
    return 'Extensive foundational training required before considering technical roles.'
  }
  
  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-teal-600 p-8 text-white text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-white" />
          <h1 className="text-3xl font-bold mb-2">Interview Completed!</h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            Thank you for completing the interview, {currentCandidate?.name}.
          </p>
          <p className="text-green-100 mt-2">
            Redirecting to dashboard in 5 seconds...
          </p>
        </div>
        <CardContent className="p-8">
          {/* Flagged candidate warning */}
          {currentCandidate?.flagged && (
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl text-center border border-blue-100">
              <Trophy className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-gray-900">{currentCandidate?.score || 0}</h3>
              <p className="text-gray-600">Final Score</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl text-center border border-green-100">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-gray-900">{correctAnswers}<span className="text-lg">/{totalQuestions}</span></h3>
              <p className="text-gray-600">Correct Answers</p>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl text-center border border-amber-100">
              <BarChart className="w-8 h-8 text-amber-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-gray-900">{accuracy}%</h3>
              <p className="text-gray-600">Accuracy</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl text-center border border-purple-100">
              <Clock className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-gray-900">{dayjs().format('HH:mm')}</h3>
              <p className="text-gray-600">Time Completed</p>
            </div>
          </div>
          
          <Card className="border-0 shadow-sm rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 mb-8">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center">
                <BarChart className="w-5 h-5 mr-2 text-blue-600" />
                AI Performance Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Overall Performance: 
                  <span className={`ml-2 ${getScoreColor(currentCandidate?.score || 0)}`}>
                    {getScoreRange(currentCandidate?.score || 0)} ({currentCandidate?.score || 0}/100)
                  </span>
                </h3>
                <p className="text-gray-700 mt-2">
                  {getScoreDescription(currentCandidate?.score || 0)}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Recommendation:</h4>
                <p className="text-gray-700">
                  {getScoreRecommendation(currentCandidate?.score || 0)}
                </p>
              </div>
              <p className="text-gray-700 mt-4">
                {currentCandidate?.summary || "Candidate demonstrated strong knowledge of React fundamentals and advanced concepts. Showed good understanding of performance optimization techniques."}
              </p>
            </CardContent>
          </Card>
          
          {currentCandidate?.answers && currentCandidate.answers.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Question Breakdown</h3>
              <div className="space-y-4">
                {currentCandidate.answers.map((answer, index) => {
                  const isCorrect = answer.correct
                  return (
                    <Card key={answer.questionId} className="border-0 shadow-sm rounded-lg">
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold text-gray-900">
                            <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 inline-flex items-center justify-center text-sm font-bold mr-2">
                              {index + 1}
                            </span>
                            {answer.question}
                          </h4>
                          <span 
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              isCorrect 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                        </div>
                        <div className="mb-3">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Your answer:</span> Option {answer.selectedOption}
                          </p>
                          {answer.score !== undefined && (
                            <p className={`text-sm font-medium mt-1 ${getScoreColor(answer.score)}`}>
                              Score: {answer.score}/100
                            </p>
                          )}
                        </div>
                        {answer.explanation && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Explanation:</span> {answer.explanation}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap justify-center gap-4 mt-8 pt-6 border-t border-gray-200">
            <Button 
              type="primary" 
              onClick={handleViewDashboard}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 flex items-center"
            >
              View Dashboard Now
            </Button>
            <Button 
              variant="outline" 
              onClick={handleRestart}
              className="flex items-center"
            >
              Start New Interview
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default InterviewSummary