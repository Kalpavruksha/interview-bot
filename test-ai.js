// Simple test script for AI functions
import { generateMCQInterviewQuestions, scoreCandidateAnswer, generateMCQCandidateSummary } from './src/utils/geminiAPI.js'

async function testAI() {
  console.log('🚀 Testing AI Integration Showcase')
  console.log('=====================================')
  
  // Check if API key is available
  const apiKey = process.env.VITE_GOOGLE_API_KEY
  if (!apiKey) {
    console.log('⚠️  No API key found. Using fallback responses.')
    console.log('   To enable real AI features, set VITE_GOOGLE_API_KEY in your .env file')
  } else {
    console.log('✅ API key found. Using real AI services.')
  }
  
  try {
    // Test 1: Question Generation
    console.log('\n1. Testing Question Generation...')
    const candidateInfo = {
      name: "Test Candidate",
      text: "Software engineer with 3 years experience in React, Node.js, and JavaScript"
    }
    
    const questions = await generateMCQInterviewQuestions(candidateInfo)
    console.log('✅ Generated', questions.length, 'questions')
    console.log('Sample question:', questions[0]?.text)
    
    // Test 2: Answer Scoring
    console.log('\n2. Testing Answer Scoring...')
    const score = await scoreCandidateAnswer(
      "What is React?",
      "React is a JavaScript library for building user interfaces."
    )
    console.log('✅ Answer scored:', score, '/ 100')
    
    // Test 3: Candidate Summary
    console.log('\n3. Testing Candidate Summary...')
    const sampleAnswers = [
      {
        question: "What is React?",
        answer: "React is a JavaScript library for building user interfaces."
      },
      {
        question: "What are React hooks?",
        answer: "React hooks are functions that let you use state and other React features in functional components."
      }
    ]
    
    const summary = await generateMCQCandidateSummary([{ id: 1, question: "What is React?" }, { id: 2, question: "What are React hooks?" }], sampleAnswers)
    console.log('✅ Generated summary:', summary.substring(0, 100) + '...')
    
    console.log('\n🎉 All AI tests completed!')
    console.log('=====================================')
    
  } catch (error) {
    console.error('❌ Error testing AI functions:', error.message)
  }
}

testAI()