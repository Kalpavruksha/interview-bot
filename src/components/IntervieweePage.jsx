import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card'
import ResumeUpload from './ResumeUpload'
import CandidateInfoForm from './CandidateInfoForm'
import InterviewChat from './InterviewChat'
import WelcomeBackModal from './WelcomeBackModal'

const IntervieweePage = () => {
  const dispatch = useDispatch()
  const { 
    currentCandidate, 
    interviewStatus, 
    showWelcomeBack,
    allCandidates,
    questions
  } = useSelector(state => state.interview)
  
  const [step, setStep] = useState('upload') // upload, info, interview
  const [isProcessingResume, setIsProcessingResume] = useState(false); // Track if we're processing a resume
  
  // Check if we have an ongoing interview
  useEffect(() => {
    // Skip this effect if we're currently processing a resume
    if (isProcessingResume) {
      return;
    }
    
    // Only auto-derive step if we're still at upload step
    // This prevents the effect from overriding step when it's explicitly set elsewhere
    if (step === 'upload') {
      // First check if we already have an active interview in progress
      if (currentCandidate && currentCandidate.name && currentCandidate.email) {
        // If interview is in progress or paused, go to interview step
        if (interviewStatus === 'in-progress' || interviewStatus === 'paused') {
          setStep('interview')
          return
        } 
        // If interview is completed, stay on upload step for new interview
        else if (interviewStatus === 'completed') {
          setStep('upload')
          return
        }
        // If interview not started but we have candidate info, ONLY go to interview step if 
        // we actually have a valid candidate (not just default/placeholder data)
        else if (interviewStatus === 'not-started') {
          // Check if we have all required info AND this is a real candidate (not just default data)
          // We'll check if the name is not just "Candidate" and if we have a proper email/phone
          if (currentCandidate.name && currentCandidate.name !== 'Candidate' && 
              currentCandidate.email && currentCandidate.phone) {
            // Don't automatically start, let user click start
            setStep('interview')
          } else if (currentCandidate.name !== 'Candidate' && 
                     (currentCandidate.email || currentCandidate.phone)) {
            // If we have some info but not all, go to info step
            setStep('info')
          }
          // Otherwise, stay on upload step for new resume
          return
        }
      }
      
      // Check for unfinished interviews in localStorage (redux-persist storage)
      const savedInterviewState = localStorage.getItem('persist:interview-app')
      if (savedInterviewState) {
        try {
          const parsedState = JSON.parse(savedInterviewState)
          if (parsedState.interview) {
            const interview = JSON.parse(parsedState.interview)
            console.log('Found persisted interview state:', interview)
            
            // Check if there's an unfinished interview
            // An interview is considered unfinished if:
            // 1. It has a candidate with a name (and it's not the default "Candidate")
            // 2. The status is in-progress or paused or not-started (with questions)
            // 3. Either no answers yet, or answered some questions but not all
            if (interview.currentCandidate && interview.currentCandidate.name && 
                interview.currentCandidate.name !== 'Candidate' &&
                (interview.interviewStatus === 'in-progress' || interview.interviewStatus === 'paused' ||
                 (interview.interviewStatus === 'not-started' && interview.questions && interview.questions.length > 0))) {
              
              // Check if interview is incomplete (not all questions answered)
              const totalQuestions = interview.questions ? interview.questions.length : 0
              const answeredQuestions = interview.currentCandidate.answers ? interview.currentCandidate.answers.length : 0
              
              // Show welcome back if there are questions and not all are answered
              if (totalQuestions > 0 && answeredQuestions < totalQuestions) {
                console.log(`Found unfinished interview: ${answeredQuestions}/${totalQuestions} questions answered`)
                dispatch({ type: 'SET_SHOW_WELCOME_BACK', payload: true })
                return
              }
              
              // Also show welcome back if interview hasn't started but questions are generated
              if (interview.interviewStatus === 'not-started' && totalQuestions > 0) {
                console.log('Found not-started interview with generated questions')
                dispatch({ type: 'SET_SHOW_WELCOME_BACK', payload: true })
                return
              }
            }
          }
        } catch (error) {
          console.error('Error parsing saved state:', error)
        }
      }
      
      // If no unfinished interview found, ensure we're not showing the welcome back modal
      if (showWelcomeBack) {
        dispatch({ type: 'SET_SHOW_WELCOME_BACK', payload: false })
      }
    }
  }, [currentCandidate, interviewStatus, dispatch, showWelcomeBack, isProcessingResume, step])
  
  const handleResumeProcessed = (candidateData) => {
    console.log('handleResumeProcessed called with:', candidateData);
    
    // Set flag to indicate we're processing a resume
    setIsProcessingResume(true);
    
    // Generate a unique ID for the candidate
    const candidateWithId = {
      ...candidateData,
      id: Date.now().toString()
    }
    
    // 🔥 Reset before setting new candidate to ensure clean state
    dispatch({ type: 'RESET_INTERVIEW' });
    dispatch({ type: 'SET_CURRENT_CANDIDATE', payload: candidateWithId });
    dispatch({ type: 'SET_INTERVIEW_STATUS', payload: 'not-started' });
    
    // Check if we have all required info
    if (candidateData.name && candidateData.email && candidateData.phone) {
      console.log('All required info present, setting step to interview');
      // Don't automatically start interview, let user click start
      setStep('interview')
    } else {
      console.log('Missing required info, setting step to info');
      setStep('info')
    }
    
    // Reset the processing flag after a short delay to allow state to settle
    setTimeout(() => {
      setIsProcessingResume(false);
    }, 100);
  }
  
  const handleInfoComplete = (completeCandidateData) => {
    const candidateWithId = {
      ...currentCandidate,
      ...completeCandidateData
    }
    
    dispatch({ type: 'UPDATE_CURRENT_CANDIDATE', payload: candidateWithId })
    // Don't automatically start interview, let user click start
    setStep('interview')
  }
  
  const renderCurrentStep = () => {
    switch (step) {
      case 'upload':
        return (
          <div>
            <ResumeUpload onProcessed={handleResumeProcessed} />
          </div>
        )
      case 'info':
        return <CandidateInfoForm onComplete={handleInfoComplete} />
      case 'interview':
        return <InterviewChat />
      default:
        return <ResumeUpload onProcessed={handleResumeProcessed} />
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Interview Assistant</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload your resume and take an AI-powered technical interview. 
          Get personalized questions and instant feedback.
        </p>
      </div>
      
      <Card className="max-w-4xl mx-auto shadow-lg border-0 rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
          <CardHeader className="p-0">
            <CardTitle className="text-2xl text-white">
              {step === 'upload' && 'Upload Your Resume'}
              {step === 'info' && 'Complete Your Information'}
              {step === 'interview' && 'Technical Interview'}
            </CardTitle>
            <CardDescription className="text-blue-100">
              {step === 'upload' && 'Start by uploading your resume to get personalized questions'}
              {step === 'info' && 'We need some additional information before starting the interview'}
              {step === 'interview' && 'Answer the questions and get AI-powered feedback'}
            </CardDescription>
          </CardHeader>
        </div>
        <CardContent className="p-6">
          {showWelcomeBack && (
            <WelcomeBackModal 
              onResume={() => {
                dispatch({ type: 'SET_SHOW_WELCOME_BACK', payload: false })
                setStep('interview')
              }}
              onRestart={() => {
                dispatch({ type: 'SET_SHOW_WELCOME_BACK', payload: false })
                dispatch({ type: 'RESET_INTERVIEW' })
                setStep('upload')
              }}
            />
          )}
          
          {renderCurrentStep()}
        </CardContent>
      </Card>
      
      {/* Progress indicator */}
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-medium text-gray-700">
            {step === 'upload' && 'Step 1 of 3'}
            {step === 'info' && 'Step 2 of 3'}
            {step === 'interview' && 'Step 3 of 3'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
            style={{ 
              width: step === 'upload' ? '33%' : step === 'info' ? '66%' : '100%' 
            }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default IntervieweePage