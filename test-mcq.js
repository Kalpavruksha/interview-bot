// Simple test script for MCQ functions
import { generateMCQInterviewQuestions } from './src/utils/geminiAPI.js'

async function testMCQ() {
  console.log('🚀 Testing MCQ Generation')
  console.log('=========================')
  
  // Check if API key is available
  const apiKey = typeof process !== 'undefined' && process.env?.VITE_GOOGLE_API_KEY || typeof import.meta !== 'undefined' && import.meta.env?.VITE_GOOGLE_API_KEY
  if (!apiKey) {
    console.log('⚠️  No API key found. Using fallback responses.')
    console.log('   To enable real AI features, set VITE_GOOGLE_API_KEY in your .env file')
  } else {
    console.log('✅ API key found. Using real AI services.')
  }
  
  try {
    // Test MCQ Generation
    console.log('\n1. Testing MCQ Question Generation...')
    const candidateInfo = {
      name: "Test Candidate",
      text: "Software engineer with 3 years experience in React, Node.js, and JavaScript"
    }
    
    const questions = await generateMCQInterviewQuestions(candidateInfo)
    console.log('✅ Generated', questions.length, 'MCQ questions')
    
    // Display sample questions
    questions.slice(0, 3).forEach((q, index) => {
      console.log(`\nQ${index + 1} (${q.difficulty.toUpperCase()} - ${q.type}):`)
      console.log(`  ${q.question}`)
      console.log(`  Options: ${q.options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join(' | ')}`)
      console.log(`  Correct Answer: ${q.answer}`)
      console.log(`  Time Limit: ${q.timeLimit}s`)
    })
    
    console.log('\n🎉 MCQ tests completed!')
    console.log('========================')
    
  } catch (error) {
    console.error('❌ Error testing MCQ functions:', error.message)
  }
}

testMCQ()