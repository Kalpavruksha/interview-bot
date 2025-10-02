import React, { useState, useEffect } from 'react'
import { callGeminiAPI, generateMCQInterviewQuestions, scoreCandidateAnswer, generateMCQCandidateSummary } from '../utils/geminiAPI'

const APITest = () => {
  const [apiKeyStatus, setApiKeyStatus] = useState('Checking...')
  const [apiResponse, setApiResponse] = useState('')
  const [questionGeneration, setQuestionGeneration] = useState('')
  const [answerScoring, setAnswerScoring] = useState('')
  const [candidateSummary, setCandidateSummary] = useState('')

  useEffect(() => {
    const checkApiKey = async () => {
      try {
        // Check if API key is available
        const apiKey = import.meta.env.VITE_GOOGLE_API_KEY
        if (!apiKey || apiKey === 'your_google_api_key_here') {
          setApiKeyStatus('❌ API Key Not Found or Invalid')
          return
        }
        
        setApiKeyStatus('✅ API Key Found')
        
        // Test the API with a simple prompt
        const response = await callGeminiAPI('Say "Hello, World!" in 3 different programming languages.')
        setApiResponse(response)
        
        // Test question generation
        const candidateInfo = {
          name: "Test Candidate",
          text: "Software engineer with 3 years experience in React, Node.js, and JavaScript"
        }
        
        const questions = await generateMCQInterviewQuestions(candidateInfo)
        setQuestionGeneration(JSON.stringify(questions, null, 2))
        
        // Test answer scoring
        if (questions && questions.length > 0) {
          const firstQuestion = questions[0]
          const score = await scoreCandidateAnswer(firstQuestion, "This is a test answer.")
          setAnswerScoring(JSON.stringify(score, null, 2))
        }
        
        // Test candidate summary
        if (questions && questions.length > 0) {
          const sampleAnswers = questions.slice(0, 2).map((q, i) => ({
            questionId: q.id,
            selectedOption: "A"
          }))
          
          const summary = await generateMCQCandidateSummary(questions.slice(0, 2), sampleAnswers)
          setCandidateSummary(JSON.stringify(summary, null, 2))
        }
      } catch (error) {
        setApiKeyStatus('❌ API Key Error')
        setApiResponse(`Error: ${error.message}`)
      }
    }

    checkApiKey()
  }, [])

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">API Key Status Check</h1>
      
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">API Key Status:</h2>
        <p className="text-lg">{apiKeyStatus}</p>
      </div>
      
      {apiResponse && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Basic API Response:</h2>
          <pre className="whitespace-pre-wrap bg-white p-3 rounded border">{apiResponse}</pre>
        </div>
      )}
      
      {questionGeneration && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Question Generation:</h2>
          <pre className="whitespace-pre-wrap bg-white p-3 rounded border max-h-60 overflow-y-auto">{questionGeneration}</pre>
        </div>
      )}
      
      {answerScoring && (
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Answer Scoring:</h2>
          <pre className="whitespace-pre-wrap bg-white p-3 rounded border">{answerScoring}</pre>
        </div>
      )}
      
      {candidateSummary && (
        <div className="mb-6 p-4 bg-purple-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Candidate Summary:</h2>
          <pre className="whitespace-pre-wrap bg-white p-3 rounded border">{candidateSummary}</pre>
        </div>
      )}
      
      <div className="text-sm text-gray-600">
        <p className="mb-2">To use real AI features:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Get your API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a></li>
          <li>Replace the key in your <code className="bg-gray-100 px-1 rounded">.env</code> file</li>
          <li>Restart the development server</li>
        </ol>
      </div>
    </div>
  )
}

export default APITest