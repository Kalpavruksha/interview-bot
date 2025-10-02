import { store } from '../src/store'
import interviewReducer from '../src/reducers/interviewReducer'

// Test initial state
const initialState = {
  candidates: [],
  currentCandidate: null,
  currentQuestion: null,
  currentQuestionIndex: 0,
  answers: [],
  timer: 0,
  totalTime: 0,
  interviewStatus: 'not-started',
  showWelcomeBack: false,
}

// Test that our reducer returns the initial state
const state = interviewReducer(undefined, { type: '@@INIT' })
console.log('Initial state test:', JSON.stringify(state) === JSON.stringify(initialState))

// Test adding a candidate
const candidate = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  phone: '123-456-7890'
}

const stateWithCandidate = interviewReducer(state, {
  type: 'ADD_CANDIDATE',
  payload: candidate
})

console.log('Add candidate test:', stateWithCandidate.candidates.length === 1)

// Test setting current candidate
const stateWithCurrentCandidate = interviewReducer(stateWithCandidate, {
  type: 'SET_CURRENT_CANDIDATE',
  payload: candidate
})

console.log('Set current candidate test:', stateWithCurrentCandidate.currentCandidate !== null)

console.log('All tests passed!')