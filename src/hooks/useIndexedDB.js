import { useCallback } from 'react'
import db from '../utils/db'

// Hook for IndexedDB operations
export const useIndexedDB = () => {
  // Add a candidate
  const addCandidate = useCallback(async (candidate) => {
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
  }, [])

  // Get all candidates
  const getCandidates = useCallback(async () => {
    try {
      const candidates = await db.candidates.toArray()
      return candidates
    } catch (error) {
      console.error('Error getting candidates:', error)
      throw error
    }
  }, [])

  // Get a candidate by ID
  const getCandidateById = useCallback(async (id) => {
    try {
      const candidate = await db.candidates.get(id)
      return candidate
    } catch (error) {
      console.error('Error getting candidate:', error)
      throw error
    }
  }, [])

  // Update a candidate
  const updateCandidate = useCallback(async (id, updates) => {
    try {
      await db.candidates.update(id, updates)
    } catch (error) {
      console.error('Error updating candidate:', error)
      throw error
    }
  }, [])

  // Add an interview
  const addInterview = useCallback(async (interview) => {
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
  }, [])

  // Update an interview
  const updateInterview = useCallback(async (id, updates) => {
    try {
      await db.interviews.update(id, updates)
    } catch (error) {
      console.error('Error updating interview:', error)
      throw error
    }
  }, [])

  // Add a question
  const addQuestion = useCallback(async (question) => {
    try {
      const id = await db.questions.add(question)
      return id
    } catch (error) {
      console.error('Error adding question:', error)
      throw error
    }
  }, [])

  // Get questions by interview ID
  const getQuestionsByInterviewId = useCallback(async (interviewId) => {
    try {
      const questions = await db.questions.where('interviewId').equals(interviewId).toArray()
      return questions
    } catch (error) {
      console.error('Error getting questions:', error)
      throw error
    }
  }, [])

  // Add an answer
  const addAnswer = useCallback(async (answer) => {
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
  }, [])

  // Get answers by candidate ID
  const getAnswersByCandidateId = useCallback(async (candidateId) => {
    try {
      const answers = await db.answers.where('candidateId').equals(candidateId).toArray()
      return answers
    } catch (error) {
      console.error('Error getting answers:', error)
      throw error
    }
  }, [])

  // Update a timer
  const updateTimer = useCallback(async (questionId, timeLeft) => {
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
  }, [])

  // Get timer by question ID
  const getTimerByQuestionId = useCallback(async (questionId) => {
    try {
      const timer = await db.timers.where('questionId').equals(questionId).first()
      return timer
    } catch (error) {
      console.error('Error getting timer:', error)
      throw error
    }
  }, [])

  return {
    addCandidate,
    getCandidates,
    getCandidateById,
    updateCandidate,
    addInterview,
    updateInterview,
    addQuestion,
    getQuestionsByInterviewId,
    addAnswer,
    getAnswersByCandidateId,
    updateTimer,
    getTimerByQuestionId
  }
}