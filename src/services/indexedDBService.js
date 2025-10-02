import db from '../utils/db'

// Service for IndexedDB operations
class IndexedDBService {
  // Add a candidate
  async addCandidate(candidate) {
    try {
      const id = await db.candidates.add({
        ...candidate,
        createdAt: new Date()
      })
      return id
    } catch (error) {
      console.error('Error adding candidate:', error)
      throw error
    }
  }

  // Get all candidates
  async getCandidates() {
    try {
      const candidates = await db.candidates.toArray()
      return candidates
    } catch (error) {
      console.error('Error getting candidates:', error)
      throw error
    }
  }

  // Get a candidate by ID
  async getCandidateById(id) {
    try {
      const candidate = await db.candidates.get(id)
      return candidate
    } catch (error) {
      console.error('Error getting candidate:', error)
      throw error
    }
  }

  // Update a candidate
  async updateCandidate(id, updates) {
    try {
      await db.candidates.update(id, updates)
    } catch (error) {
      console.error('Error updating candidate:', error)
      throw error
    }
  }

  // Add an interview
  async addInterview(interview) {
    try {
      const id = await db.interviews.add({
        ...interview,
        startedAt: new Date()
      })
      return id
    } catch (error) {
      console.error('Error adding interview:', error)
      throw error
    }
  }

  // Update an interview
  async updateInterview(id, updates) {
    try {
      await db.interviews.update(id, updates)
    } catch (error) {
      console.error('Error updating interview:', error)
      throw error
    }
  }

  // Add a question
  async addQuestion(question) {
    try {
      const id = await db.questions.add(question)
      return id
    } catch (error) {
      console.error('Error adding question:', error)
      throw error
    }
  }

  // Get questions by interview ID
  async getQuestionsByInterviewId(interviewId) {
    try {
      const questions = await db.questions.where('interviewId').equals(interviewId).toArray()
      return questions
    } catch (error) {
      console.error('Error getting questions:', error)
      throw error
    }
  }

  // Add an answer
  async addAnswer(answer) {
    try {
      const id = await db.answers.add({
        ...answer,
        submittedAt: new Date()
      })
      return id
    } catch (error) {
      console.error('Error adding answer:', error)
      throw error
    }
  }

  // Get answers by candidate ID
  async getAnswersByCandidateId(candidateId) {
    try {
      const answers = await db.answers.where('candidateId').equals(candidateId).toArray()
      return answers
    } catch (error) {
      console.error('Error getting answers:', error)
      throw error
    }
  }

  // Update a timer
  async updateTimer(questionId, timeLeft) {
    try {
      // Check if timer exists
      const existingTimer = await db.timers.where('questionId').equals(questionId).first()
      
      if (existingTimer) {
        await db.timers.update(existingTimer.id, {
          timeLeft,
          updatedAt: new Date()
        })
      } else {
        await db.timers.add({
          questionId,
          timeLeft,
          updatedAt: new Date()
        })
      }
    } catch (error) {
      console.error('Error updating timer:', error)
      throw error
    }
  }

  // Get timer by question ID
  async getTimerByQuestionId(questionId) {
    try {
      const timer = await db.timers.where('questionId').equals(questionId).first()
      return timer
    } catch (error) {
      console.error('Error getting timer:', error)
      throw error
    }
  }
}

const indexedDBService = new IndexedDBService()

export default indexedDBService