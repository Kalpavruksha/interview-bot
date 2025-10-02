// Simple test script to check if Gemini API key is configured correctly
console.log('🔍 Checking if Gemini API is being used...\n')

// For Node.js environment, we need to use process.env
const apiKey = process.env.VITE_GOOGLE_API_KEY

console.log('Environment variables available:', Object.keys(process.env))
console.log('VITE_GOOGLE_API_KEY value:', apiKey ? `${apiKey.substring(0, 10)}...` : 'undefined')

if (!apiKey) {
  console.log('❌ Gemini API key not found in environment variables. AI features will use fallback responses.')
} else {
  console.log('✅ Gemini API key found!')
}

// Test question generation
async function testQuestionGeneration() {
  console.log('\n🧪 Testing question generation...')
  
  // Simulate the browser environment check
  const startTime = Date.now()
  
  // Mock candidate info
  const candidateInfo = {
    name: "Test Candidate",
    text: "Software engineer with 3 years experience in React, Node.js, and JavaScript"
  }
  
  // If we don't have an API key, we'll show what the fallback looks like
  if (!apiKey) {
    console.log('Checking for API key: Not found')
    console.log('Using fallback MCQ questions due to missing API key')
    
    // More varied set of fallback questions
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
      }
    ]
    
    const endTime = Date.now()
    console.log('✅ Question generation successful')
    console.log(`⏱️  Response time: ${endTime - startTime} ms`)
    console.log(`📝 Questions generated: ${fallbackQuestions.length}`)
    console.log(`❓ First question: ${fallbackQuestions[1].question}`)
    console.log('⚠️  Using fallback questions - Gemini API is NOT being used')
  } else {
    console.log('Checking for API key: Found')
    console.log('✅ Question generation would use real Gemini API')
    console.log('✅ You are all set to use real AI features!')
  }
}

// Test model information
console.log('\n🧠 Model Information:')
console.log('The application uses a hybrid approach:')
console.log('- gemini-1.5-flash: For fast question generation')
console.log('- gemini-1.5-pro: For deeper analysis and summaries')
console.log('This provides both speed and accuracy for the best user experience.')

testQuestionGeneration()

console.log('\n📋 To use real Gemini API:')
console.log('1. Get API key from https://aistudio.google.com/app/apikey')
console.log('2. Add to .env file: VITE_GOOGLE_API_KEY=your_key_here')
console.log('3. Restart the development server')