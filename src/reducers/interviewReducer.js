const initialState = {
  // Current candidate with progress tracking
  currentCandidate: {
    id: null,
    name: "",
    email: "",
    phone: "",
    interviewStep: 0,   // question number
    timers: {}, // { q1: 20, q2: 60, ... }
    answers: [], // { questionId: 1, text: "My answer", score: 8 }
    flagged: false, // Whether the candidate has been flagged for cheating
    flaggedReason: "" // Reason for flagging
  },
  // All candidates for dashboard
  allCandidates: [],
  // Interview flow state
  currentQuestion: null,
  currentQuestionIndex: 0,
  interviewStatus: 'not-started', // not-started, in-progress, paused, completed
  showWelcomeBack: false,
  questions: [], // Interview questions
}

const interviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ALL_CANDIDATES':
      return {
        ...state,
        allCandidates: action.payload,
      }
    
    case 'ADD_CANDIDATE':
      return {
        ...state,
        allCandidates: [...state.allCandidates, action.payload],
        // Clear current candidate after adding to all candidates
        currentCandidate: {
          ...initialState.currentCandidate
        }
      }
      
    case 'SET_CURRENT_CANDIDATE':
      return {
        ...state,
        currentCandidate: {
          ...state.currentCandidate,
          ...action.payload
        },
      }
      
    case 'UPDATE_CURRENT_CANDIDATE':
      return {
        ...state,
        currentCandidate: {
          ...state.currentCandidate,
          ...action.payload
        },
      }
      
    case 'SET_CURRENT_QUESTION':
      return {
        ...state,
        currentQuestion: action.payload,
      }
      
    case 'SET_CURRENT_QUESTION_INDEX':
      return {
        ...state,
        currentQuestionIndex: action.payload,
        currentCandidate: {
          ...state.currentCandidate,
          interviewStep: action.payload
        }
      }
      
    case 'ADD_ANSWER':
      return {
        ...state,
        currentCandidate: {
          ...state.currentCandidate,
          answers: [...state.currentCandidate.answers, action.payload],
        }
      }
      
    case 'UPDATE_TIMER':
      return {
        ...state,
        currentCandidate: {
          ...state.currentCandidate,
          timers: {
            ...state.currentCandidate.timers,
            ...action.payload
          }
        }
      }
      
    case 'SET_INTERVIEW_STATUS':
      return {
        ...state,
        interviewStatus: action.payload,
      }
      
    case 'SET_SHOW_WELCOME_BACK':
      return {
        ...state,
        showWelcomeBack: action.payload,
      }
      
    case 'SET_QUESTIONS':
      return {
        ...state,
        questions: action.payload,
      }
      
    case 'RESET_INTERVIEW':
      return {
        ...initialState,
        allCandidates: state.allCandidates,
      }
      
    case 'START_NEW_INTERVIEW':
      return {
        ...state,
        questions: [],
        currentQuestion: null,
        currentQuestionIndex: 0,
        interviewStatus: 'not-started',
        currentCandidate: {
          ...state.currentCandidate,
          interviewStep: 0,
          timers: {},
          answers: [],
          flagged: false,
          flaggedReason: ""
        }
      }

    default:
      return state
  }
}

export default interviewReducer