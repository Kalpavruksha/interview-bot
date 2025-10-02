// Simple test to verify core functionality
import { store } from './store'
import { parseResume } from './utils/resumeParser'

// Test Redux store
console.log('Testing Redux store...')
console.log('Initial state:', store.getState())

// Test resume parsing (simulated)
console.log('Testing resume parsing...')
parseResume({ type: 'application/pdf' })
  .then(result => {
    console.log('Parsed resume:', result)
  })
  .catch(error => {
    console.error('Error parsing resume:', error)
  })

// Test adding a candidate
store.dispatch({
  type: 'ADD_CANDIDATE',
  payload: {
    id: 1,
    name: 'Test Candidate',
    email: 'test@example.com',
    phone: '123-456-7890',
    score: 85,
    summary: 'Test candidate summary',
    completedAt: new Date().toISOString(),
    answers: []
  }
})

console.log('State after adding candidate:', store.getState())

console.log('All tests completed!')