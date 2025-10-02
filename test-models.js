// Test script to verify that both Gemini models are working correctly with improved prompts
import { generateMCQInterviewQuestions, scoreCandidateAnswer, generateMCQCandidateSummary } from './src/utils/geminiAPI.js'

async function testModels() {
  console.log('🚀 Testing Gemini Model Integration with Improved Prompts')
  console.log('========================================================')
  
  // Check if API key is available
  const apiKey = import.meta.env?.VITE_GOOGLE_API_KEY || process.env.VITE_GOOGLE_API_KEY
  if (!apiKey) {
    console.log('⚠️  No API key found. Using fallback responses.')
    console.log('   To enable real AI features, set VITE_GOOGLE_API_KEY in your .env file')
  } else {
    console.log('✅ API key found. Using real AI services.')
  }
  
  try {
    // Test 1: Question Generation (should use gemini-1.5-flash with improved prompts)
    console.log('\n1. Testing Question Generation (gemini-1.5-flash with improved prompts)...')
    const candidateInfo = {
      name: "Test Candidate",
      text: "Software engineer with 3 years experience in React, Node.js, and JavaScript. Worked on e-commerce platforms and real-time applications."
    }
    
    const questions = await generateMCQInterviewQuestions(candidateInfo)
    console.log('✅ Generated', questions.length, 'questions')
    console.log('Sample question:', questions[0]?.question)
    console.log('Difficulty:', questions[0]?.difficulty)
    console.log('Time limit:', questions[0]?.timeLimit, 'seconds')
    
    // Test 2: Answer Scoring (should use gemini-1.5-pro with improved prompts)
    console.log('\n2. Testing Answer Scoring (gemini-1.5-pro with improved prompts)...')
    if (questions && questions.length > 0) {
      const firstQuestion = questions[0]
      const score = await scoreCandidateAnswer(firstQuestion, "This is a test answer demonstrating knowledge of the topic with clear explanation.")
      console.log('✅ Answer scored:', score.score, '/ 100')
      console.log('Feedback:', score.feedback)
    }
    
    // Test 3: Candidate Summary (should use gemini-1.5-pro with improved prompts)
    console.log('\n3. Testing Candidate Summary (gemini-1.5-pro with improved prompts)...')
    if (questions && questions.length > 0) {
      const sampleAnswers = questions.slice(0, 3).map((q, i) => ({
        questionId: q.id,
        selectedOption: q.options[0], // Use first option as sample answer
        score: 75 + i * 5 // Different scores for variety
      }))
      
      const summary = await generateMCQCandidateSummary(questions.slice(0, 3), sampleAnswers)
      console.log('✅ Summary generated with score:', summary.score, '/ 100')
      console.log('Summary:', summary.summary)
      console.log('Strengths:', summary.strengths)
      console.log('Improvements:', summary.improvements)
      console.log('Recommendation:', summary.recommendation)
    }
    
    console.log('\n🎉 All tests completed successfully with improved prompts!')
    
  } catch (error) {
    console.error('❌ Error during testing:', error)
  }
}

testModels()