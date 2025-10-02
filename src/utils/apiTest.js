// Simple test to verify Gemini API connectivity
import { callGeminiAPI, generateMCQInterviewQuestions, scoreCandidateAnswer, generateMCQCandidateSummary } from './geminiAPI'

export const testGeminiAPI = async () => {
  try {
    console.log('Testing basic API connectivity...')
    const testPrompt = "Say 'Hello, World!' in 3 different programming languages."
    const response = await callGeminiAPI(testPrompt)
    console.log('Basic API Test Response:', response)
    
    console.log('\nTesting question generation...')
    const candidateInfo = {
      name: "Test Candidate",
      text: "Software engineer with 3 years experience in React, Node.js, and JavaScript"
    }
    
    const questions = await generateMCQInterviewQuestions(candidateInfo)
    console.log('Generated Questions:', questions)
    
    console.log('\nTesting answer scoring...')
    if (questions && questions.length > 0) {
      const firstQuestion = questions[0]
      const score = await scoreCandidateAnswer(firstQuestion, "This is a test answer.")
      console.log('Answer Score:', score)
    }
    
    console.log('\nTesting candidate summary...')
    if (questions && questions.length > 0) {
      const sampleAnswers = questions.slice(0, 2).map((q, i) => ({
        questionId: q.id,
        selectedOption: "A"
      }))
      
      const summary = await generateMCQCandidateSummary(questions.slice(0, 2), sampleAnswers)
      console.log('Candidate Summary:', summary)
    }
    
    return { success: true, message: "All API tests completed successfully" }
  } catch (error) {
    console.error('Gemini API Test Error:', error)
    return { success: false, error: error.message }
  }
}