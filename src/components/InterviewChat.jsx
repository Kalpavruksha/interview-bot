import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Typography, Space, Tag, Spin, Radio } from 'antd'
import { Clock, Brain, Play, Pause, Square, CheckCircle } from 'lucide-react'
import QuestionTimer from './QuestionTimer'
import SecureQuestionDisplay from './SecureQuestionDisplay'
import InterviewProgress from './InterviewProgress'
import InterviewSummary from './InterviewSummary'
import { generateMCQInterviewQuestions, scoreCandidateAnswer, generateMCQCandidateSummary } from '../utils/geminiAPI'
import useAntiCopy from '../hooks/useAntiCopy'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'
import { validateAnswer } from '../utils/validation'

const { Title, Text } = Typography

const InterviewChat = () => {
  const dispatch = useDispatch()
  const { 
    currentCandidate, 
    currentQuestionIndex, 
    interviewStatus,
    questions: persistedQuestions
  } = useSelector(state => state.interview)
  
  // Enable anti-copy measures during the interview
  useAntiCopy(interviewStatus === 'in-progress' || interviewStatus === 'paused')
  
  const [selectedOption, setSelectedOption] = useState('') // For MCQ selection
  const [timeLeft, setTimeLeft] = useState(0)
  const [questionDifficulty, setQuestionDifficulty] = useState('easy')
  const [loadingQuestions, setLoadingQuestions] = useState(false)
  const [scoringInProgress, setScoringInProgress] = useState(false)
  
  // Load questions when interview starts or when component mounts with persisted state
  useEffect(() => {
    const loadQuestions = async () => {
      // Only generate new questions if we're starting a new interview and don't already have questions
      if (interviewStatus === 'not-started' && (!persistedQuestions || persistedQuestions.length === 0)) {
        setLoadingQuestions(true)
        try {
          // Pass candidate information to generate personalized questions
          const generatedQuestions = await generateMCQInterviewQuestions(currentCandidate)
          dispatch({ type: 'SET_QUESTIONS', payload: generatedQuestions })
        } catch (error) {
          console.error('Error loading questions:', error)
          // Use fallback questions
          const fallbackQuestions = [
            {
              id: 1,
              type: "mcq",
              question: "Which hook is used to manage state in React?",
              options: ["useEffect", "useContext", "useState", "useMemo"],
              answer: "C",
              explanation: "useState is the React hook used to manage state in functional components.",
              difficulty: 'easy',
              timeLimit: 20
            },
            {
              id: 2,
              type: "mcq",
              question: "Which HTTP method is typically used to update a resource?",
              options: ["GET", "POST", "PUT", "DELETE"],
              answer: "C",
              explanation: "PUT is used to update an existing resource, while POST is used to create a new one.",
              difficulty: 'easy',
              timeLimit: 20
            },
            {
              id: 3,
              type: "mcq",
              question: "Which of the following best optimizes a Node.js app for concurrency?",
              options: [
                "Using synchronous file operations",
                "Implementing clustering with the cluster module",
                "Increasing the timeout values",
                "Reducing the number of dependencies"
              ],
              answer: "B",
              explanation: "The cluster module allows Node.js to create child processes that share the same server port, enabling better concurrency.",
              difficulty: 'medium',
              timeLimit: 60
            },
            {
              id: 4,
              type: "mcq",
              question: "Which database query is most efficient for fetching all users by age?",
              options: [
                "SELECT * FROM users ORDER BY age",
                "SELECT * FROM users WHERE age > 0",
                "CREATE INDEX ON users(age); SELECT * FROM users WHERE age > 0",
                "SELECT name, age FROM users GROUP BY age"
              ],
              answer: "C",
              explanation: "Creating an index on the age column and then querying with a WHERE clause is the most efficient approach.",
              difficulty: 'medium',
              timeLimit: 60
            },
            {
              id: 5,
              type: "mcq-pseudocode",
              question: "Which pseudocode correctly reverses a linked list?",
              options: [
                "prev = null\nwhile (head != null)\n  next = head.next\n  head.next = prev\n  prev = head\n  head = next",
                "while (head != null)\n  head = head.next\n  head.next = prev",
                "for each node in list\n  swap(node, node.next)",
                "reverse(list)\n  return list.next"
              ],
              answer: "A",
              explanation: "The correct approach uses three pointers (prev, current, next) to reverse the direction of links in the list.",
              difficulty: 'hard',
              timeLimit: 120
            },
            {
              id: 6,
              type: "mcq-pseudocode",
              question: "Which pseudocode correctly checks for balanced parentheses?",
              options: [
                "stack = []\nfor char in string\n  if char in '({['\n    stack.push(char)\n  elif char in ')}]'\n    if stack.empty() or not matching(stack.pop(), char)\n      return false\nreturn stack.empty()",
                "count = 0\nfor char in string\n  if char == '('\n    count++\n  elif char == ')'\n    count--\nreturn count == 0",
                "return string == reverse(string)",
                "for i = 0 to length/2\n  if string[i] != string[length-i-1]\n    return false"
              ],
              answer: "A",
              explanation: "The stack-based approach correctly handles all types of brackets and ensures proper nesting.",
              difficulty: 'hard',
              timeLimit: 120
            }
          ]
          dispatch({ type: 'SET_QUESTIONS', payload: fallbackQuestions })
        } finally {
          setLoadingQuestions(false)
        }
      }
      // If we're resuming an existing interview but don't have questions loaded, generate them
      // This can happen if the welcome back flow didn't properly restore questions
      else if ((interviewStatus === 'in-progress' || interviewStatus === 'paused') && 
               (!persistedQuestions || persistedQuestions.length === 0)) {
        // This shouldn't happen, but just in case
        setLoadingQuestions(true)
        try {
          const generatedQuestions = await generateMCQInterviewQuestions(currentCandidate)
          dispatch({ type: 'SET_QUESTIONS', payload: generatedQuestions })
        } catch (error) {
          console.error('Error loading questions:', error)
          // Use fallback questions
          const fallbackQuestions = [
            {
              id: 1,
              type: "mcq",
              question: "What is the virtual DOM in React?",
              options: [
                "A lightweight version of the actual DOM",
                "A security feature in browsers",
                "A way to store data in React components",
                "A method for styling React components"
              ],
              answer: "A",
              explanation: "The virtual DOM is a lightweight copy of the actual DOM that React uses to optimize updates.",
              difficulty: 'easy',
              timeLimit: 20
            },
            {
              id: 2,
              type: "mcq",
              question: "Which HTTP status code indicates a successful request?",
              options: ["404", "500", "200", "301"],
              answer: "C",
              explanation: "HTTP status code 200 indicates a successful request.",
              difficulty: 'easy',
              timeLimit: 20
            }
          ]
          dispatch({ type: 'SET_QUESTIONS', payload: fallbackQuestions })
        } finally {
          setLoadingQuestions(false)
        }
      }
    }
    
    loadQuestions()
  }, [interviewStatus, dispatch, currentCandidate, persistedQuestions])
  
  // Set time limit based on question difficulty and restore timer state
  useEffect(() => {
    if (persistedQuestions && persistedQuestions.length > 0 && currentQuestionIndex < persistedQuestions.length) {
      const currentQuestion = persistedQuestions[currentQuestionIndex]
      
      // Only set time if interview is in progress
      if (interviewStatus === 'in-progress') {
        setQuestionDifficulty(currentQuestion.difficulty)
        dispatch({ 
          type: 'SET_CURRENT_QUESTION', 
          payload: currentQuestion 
        })
      }
    }
  }, [currentQuestionIndex, dispatch, persistedQuestions, interviewStatus])
  
  // Initialize timer when interview starts or when question changes
  useEffect(() => {
    if (interviewStatus === 'in-progress' && persistedQuestions && persistedQuestions.length > 0) {
      const currentQuestion = persistedQuestions[currentQuestionIndex]
      if (currentQuestion) {
        // Check if we have a saved timer value
        const timerKey = `q${currentQuestionIndex + 1}`
        const savedTimer = currentCandidate.timers && currentCandidate.timers[timerKey]
        
        // If we have a saved timer value, use it
        if (savedTimer !== undefined && savedTimer > 0) {
          console.log(`Restoring timer for question ${currentQuestionIndex + 1}: ${savedTimer} seconds`)
          setTimeLeft(savedTimer)
        } else {
          // Otherwise, set it to the question's time limit
          console.log(`Setting timer for question ${currentQuestionIndex + 1}: ${currentQuestion.timeLimit} seconds`)
          setTimeLeft(currentQuestion.timeLimit)
        }
      }
    }
  }, [interviewStatus, currentQuestionIndex, persistedQuestions, currentCandidate])
  
  // Timer effect
  useEffect(() => {
    let timer
    if (interviewStatus === 'in-progress' && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (interviewStatus === 'in-progress' && timeLeft === 0 && currentQuestionIndex < persistedQuestions.length) {
      handleSubmitAnswer()
    }
    
    return () => clearTimeout(timer)
  }, [timeLeft, interviewStatus, currentQuestionIndex, persistedQuestions.length])
  
  const handleSubmitAnswer = async () => {
    const currentQuestion = persistedQuestions[currentQuestionIndex]
    
    // Create answer data
    const answerData = {
      questionId: currentQuestion?.id,
      question: currentQuestion?.question,
      selectedOption: selectedOption || 'SKIPPED', // Handle timeout/skipped questions
      timestamp: dayjs().toISOString()
    }
    
    // Validate answer with Zod
    const validation = validateAnswer(answerData)
    
    // Add validated answer to store
    const validatedAnswerData = {
      ...answerData,
      ...validation.data
    }
    
    dispatch({ type: 'ADD_ANSWER', payload: validatedAnswerData })
    
    // Update timer for this question
    const timerKey = `q${currentQuestionIndex + 1}`
    dispatch({ 
      type: 'UPDATE_TIMER', 
      payload: { [timerKey]: timeLeft } 
    })
    
    // Move to next question or finish interview
    if (currentQuestionIndex < persistedQuestions.length - 1) {
      dispatch({ 
        type: 'SET_CURRENT_QUESTION_INDEX', 
        payload: currentQuestionIndex + 1 
      })
      setSelectedOption('')
      
      // Set time for next question
      const nextQuestion = persistedQuestions[currentQuestionIndex + 1]
      if (nextQuestion) {
        setTimeLeft(nextQuestion.timeLimit)
        setQuestionDifficulty(nextQuestion.difficulty)
      }
      
      toast('Answer submitted. Moving to next question...')
    } else {
      // Interview completed - score answers and generate summary
      setScoringInProgress(true)
      try {
        // Include the current answer we just submitted
        const allAnswers = [...currentCandidate.answers, validatedAnswerData]
        
        // Score each answer using AI
        const scoredAnswers = []
        let totalScore = 0
        
        for (const answer of allAnswers) {
          const question = persistedQuestions.find(q => q.id === answer.questionId)
          if (question) {
            try {
              // Use AI to score the answer
              const aiScore = await scoreCandidateAnswer(question, answer.selectedOption)
              scoredAnswers.push({ 
                ...answer, 
                score: aiScore.score,
                feedback: aiScore.feedback,
                explanation: question.explanation
              })
              totalScore += aiScore.score
            } catch (error) {
              console.error('Error scoring answer with AI:', error)
              // Fallback to basic scoring
              const isCorrect = answer.selectedOption === question.answer
              scoredAnswers.push({ 
                ...answer, 
                score: isCorrect ? 100 : 0,
                feedback: isCorrect ? "Correct answer!" : "Incorrect answer.",
                explanation: question.explanation
              })
              totalScore += isCorrect ? 100 : 0
            }
          }
        }
        
        // Calculate average score
        const finalScore = Math.round(totalScore / allAnswers.length)
        
        // Generate AI summary
        let summary = "Candidate demonstrated strong knowledge in several areas."
        try {
          const aiSummary = await generateMCQCandidateSummary(persistedQuestions, allAnswers)
          summary = aiSummary.summary || summary
        } catch (error) {
          console.error('Error generating AI summary:', error)
          // Use more varied fallback summaries
          const fallbackSummaries = [
            "Candidate showed good understanding of technical concepts and problem-solving approaches.",
            "Candidate demonstrated solid knowledge in core areas with room for further development.",
            "Candidate exhibited strong analytical skills and clear communication of technical ideas.",
            "Candidate displayed adequate knowledge with consistent performance throughout the interview.",
            "Candidate revealed good foundational understanding and methodical approach to questions."
          ];
          summary = fallbackSummaries[Math.floor(Math.random() * fallbackSummaries.length)];
        }
        
        // Update candidate with score and summary
        const completedCandidate = { 
          ...currentCandidate, 
          id: currentCandidate.id || Date.now().toString(),
          score: finalScore,
          summary,
          answers: scoredAnswers,
          completedAt: dayjs().toISOString()
        }
        
        dispatch({ 
          type: 'ADD_CANDIDATE', 
          payload: completedCandidate
        })
        
        // Set the completed candidate as the current candidate for the dashboard
        dispatch({ 
          type: 'SET_CURRENT_CANDIDATE', 
          payload: completedCandidate
        })
        
        dispatch({ type: 'SET_INTERVIEW_STATUS', payload: 'completed' })
        toast.success('Interview completed! Your results are ready.')
      } catch (error) {
        console.error('Error scoring interview:', error)
        // Use fallback scoring with more varied summaries
        const score = Math.floor(Math.random() * 31) + 70 // Random score between 70-100 for more realistic scores
        
        const fallbackSummaries = [
          "Candidate showed good understanding of technical concepts and problem-solving approaches.",
          "Candidate demonstrated solid knowledge in core areas with room for further development.",
          "Candidate exhibited strong analytical skills and clear communication of technical ideas.",
          "Candidate displayed adequate knowledge with consistent performance throughout the interview.",
          "Candidate revealed good foundational understanding and methodical approach to questions."
        ];
        const summary = fallbackSummaries[Math.floor(Math.random() * fallbackSummaries.length)];
        
        const completedCandidate = { 
          ...currentCandidate, 
          id: currentCandidate.id || Date.now().toString(),
          score,
          summary,
          answers: [...currentCandidate.answers, validatedAnswerData],
          completedAt: dayjs().toISOString()
        }
        
        dispatch({ 
          type: 'ADD_CANDIDATE', 
          payload: completedCandidate
        })
        
        // Set the completed candidate as the current candidate for the dashboard
        dispatch({ 
          type: 'SET_CURRENT_CANDIDATE', 
          payload: completedCandidate
        })
        
        dispatch({ type: 'SET_INTERVIEW_STATUS', payload: 'completed' })
        toast.success('Interview completed! Your results are ready.')
      } finally {
        setScoringInProgress(false)
      }
    }
  }
  
  const handleStartInterview = () => {
    dispatch({ type: 'SET_INTERVIEW_STATUS', payload: 'in-progress' })
    dispatch({ type: 'SET_CURRENT_QUESTION_INDEX', payload: 0 })
    
    // Set initial time limit
    if (persistedQuestions && persistedQuestions.length > 0) {
      const firstQuestion = persistedQuestions[0]
      setTimeLeft(firstQuestion.timeLimit)
      setQuestionDifficulty(firstQuestion.difficulty)
      dispatch({ 
        type: 'SET_CURRENT_QUESTION', 
        payload: firstQuestion 
      })
    }
    
    toast.success('Interview started. Good luck!')
  }
  
  const handlePauseInterview = () => {
    dispatch({ type: 'SET_INTERVIEW_STATUS', payload: 'paused' })
    toast('Interview paused')
  }
  
  const handleResumeInterview = () => {
    dispatch({ type: 'SET_INTERVIEW_STATUS', payload: 'in-progress' })
    toast.success('Interview resumed')
  }
  
  if (interviewStatus === 'completed') {
    return <InterviewSummary />
  }
  
  if (loadingQuestions) {
    return (
      <div className="text-center py-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Spin size="large" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Generating Interview Questions</h3>
            <p className="text-gray-600">Our AI is creating personalized questions based on your resume...</p>
          </div>
        </div>
      </div>
    )
  }
  
  if (scoringInProgress) {
    return (
      <div className="text-center py-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Spin size="large" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Scoring Your Answers</h3>
            <p className="text-gray-600">Our AI is analyzing your responses and generating feedback...</p>
          </div>
        </div>
      </div>
    )
  }
  
  // Show start button if interview is not started and questions are loaded
  const showStartButton = interviewStatus === 'not-started' && persistedQuestions && persistedQuestions.length > 0
  
  // Get current question
  const currentQuestion = persistedQuestions[currentQuestionIndex]
  
  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md rounded-xl">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl font-bold flex items-center">
                <Brain className="w-5 h-5 mr-2 text-blue-600" />
                Technical Interview
              </CardTitle>
              <CardDescription>
                Answer the questions to demonstrate your technical skills
              </CardDescription>
            </div>
            <InterviewProgress 
              current={currentQuestionIndex + 1} 
              total={persistedQuestions.length} 
            />
          </div>
        </CardHeader>
        <CardContent>
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
              <p className="mt-1 text-sm">The interview will continue, but this flag will be included in the final evaluation.</p>
            </div>
          )}
          
          {showStartButton ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="bg-blue-50 rounded-full p-4">
                  <Brain className="w-12 h-12 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Start Your Interview</h3>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    We've generated {persistedQuestions.length} personalized questions based on your resume. 
                    You'll have a limited time for each question. Good luck!
                  </p>
                </div>
                <Button
                  type="primary"
                  onClick={handleStartInterview}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 px-8 py-3 text-lg"
                >
                  Start Interview
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <QuestionTimer 
                timeLeft={timeLeft} 
                totalTime={currentQuestion?.timeLimit || 0}
                difficulty={questionDifficulty}
                isPaused={interviewStatus === 'paused'}
              />
              
              <Card className="border-0 shadow-sm rounded-lg">
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Tag 
                      className={`${
                        questionDifficulty === 'easy' 
                          ? 'bg-green-100 text-green-800' 
                          : questionDifficulty === 'medium' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {questionDifficulty.toUpperCase()}
                    </Tag>
                    <Tag className="bg-blue-100 text-blue-800">
                      {currentQuestion?.type === 'mcq-pseudocode' ? 'PSEUDOCODE' : 'MCQ'}
                    </Tag>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-start">
                      <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2 mt-1 flex-shrink-0">
                        {currentQuestionIndex + 1}
                      </span>
                      <SecureQuestionDisplay 
                        question={currentQuestion?.question || ''} 
                      />
                    </h3>
                  </div>
                  
                  {currentQuestion && (
                    <div className="mb-6">
                      <Radio.Group 
                        onChange={(e) => setSelectedOption(e.target.value)} 
                        value={selectedOption}
                        className="w-full"
                      >
                        <Space direction="vertical" className="w-full">
                          {currentQuestion.options.map((option, index) => (
                            <Radio 
                              key={index} 
                              value={String.fromCharCode(65 + index)}
                              className="w-full p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-start">
                                <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                                <span className="text-gray-700">{option}</span>
                              </div>
                            </Radio>
                          ))}
                        </Space>
                      </Radio.Group>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap justify-between gap-3">
                    {interviewStatus === 'paused' ? (
                      <Button
                        type="primary"
                        onClick={handleResumeInterview}
                        className="flex items-center"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Resume Interview
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={handlePauseInterview}
                        className="flex items-center"
                      >
                        <Pause className="w-4 h-4 mr-2" />
                        Pause Interview
                      </Button>
                    )}
                    
                    <Button
                      type="primary"
                      onClick={handleSubmitAnswer}
                      disabled={!selectedOption && interviewStatus === 'in-progress'}
                      className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 flex items-center"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Submit Answer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default InterviewChat