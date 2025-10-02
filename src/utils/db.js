import Dexie from 'dexie'

class InterviewDB extends Dexie {
  constructor() {
    super('InterviewDB')
    
    this.version(1).stores({
      candidates: '++id, name, email, phone, createdAt, completedAt',
      interviews: '++id, candidateId, status, startedAt, completedAt',
      questions: '++id, interviewId, questionText, difficulty, timeLimit',
      answers: '++id, questionId, candidateId, answerText, score, submittedAt',
      timers: '++id, questionId, timeLeft, updatedAt'
    })
  }
}

const db = new InterviewDB()

export default db