// Test file to verify Gemini API integration
import { generateInterviewQuestions, scoreCandidateAnswer, generateCandidateSummary } from '../utils/geminiAPI'

// Test question generation
console.log('Testing question generation...')
generateInterviewQuestions({
  name: "Test Candidate",
  text: "Software engineer with experience in React, Node.js, and JavaScript"
})
  .then(questions => {
    console.log('Generated questions:', questions)
  })
  .catch(error => {
    console.error('Error generating questions:', error)
  })

// Test answer scoring
console.log('Testing answer scoring...')
scoreCandidateAnswer(
  "What is React?",
  "React is a JavaScript library for building user interfaces."
)
  .then(score => {
    console.log('Answer score:', score)
  })
  .catch(error => {
    console.error('Error scoring answer:', error)
  })

// Test summary generation
console.log('Testing summary generation...')
generateCandidateSummary([
  {
    question: "What is React?",
    answer: "React is a JavaScript library for building user interfaces."
  },
  {
    question: "What are React hooks?",
    answer: "React hooks are functions that let you use state and other React features in functional components."
  }
])
  .then(summary => {
    console.log('Generated summary:', summary)
  })
  .catch(error => {
    console.error('Error generating summary:', error)
  })

console.log('All AI tests completed!')