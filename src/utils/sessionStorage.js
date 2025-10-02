// Utility functions for session storage management
import { validateSessionData } from './validation'

// Save data to session storage
export const saveToSessionStorage = (key, data) => {
  try {
    // Validate data before saving
    const validation = validateSessionData(data)
    if (!validation.success) {
      console.warn('Invalid session data:', validation.errors)
      // Still save but log the validation errors
    }
    
    const serializedData = JSON.stringify(data)
    sessionStorage.setItem(key, serializedData)
    return true
  } catch (error) {
    console.error('Error saving to session storage:', error)
    return false
  }
}

// Load data from session storage
export const loadFromSessionStorage = (key) => {
  try {
    const serializedData = sessionStorage.getItem(key)
    if (serializedData === null) {
      return null
    }
    
    const data = JSON.parse(serializedData)
    
    // Validate loaded data
    const validation = validateSessionData(data)
    if (!validation.success) {
      console.warn('Invalid session data loaded:', validation.errors)
      // Return data but log validation errors
    }
    
    return data
  } catch (error) {
    console.error('Error loading from session storage:', error)
    return null
  }
}

// Remove data from session storage
export const removeFromSessionStorage = (key) => {
  try {
    sessionStorage.removeItem(key)
    return true
  } catch (error) {
    console.error('Error removing from session storage:', error)
    return false
  }
}

// Clear all session storage
export const clearSessionStorage = () => {
  try {
    sessionStorage.clear()
    return true
  } catch (error) {
    console.error('Error clearing session storage:', error)
    return false
  }
}

// Save temporary candidate data
export const saveTempCandidate = (candidate) => {
  const sessionData = {
    tempCandidate: candidate,
    lastActivity: new Date().toISOString()
  }
  return saveToSessionStorage('tempCandidateData', sessionData)
}

// Load temporary candidate data
export const loadTempCandidate = () => {
  const sessionData = loadFromSessionStorage('tempCandidateData')
  return sessionData ? sessionData.tempCandidate : null
}

// Save temporary answers
export const saveTempAnswers = (answers) => {
  const sessionData = {
    tempAnswers: answers,
    lastActivity: new Date().toISOString()
  }
  return saveToSessionStorage('tempAnswersData', sessionData)
}

// Load temporary answers
export const loadTempAnswers = () => {
  const sessionData = loadFromSessionStorage('tempAnswersData')
  return sessionData ? sessionData.tempAnswers : []
}

// Save temporary timers
export const saveTempTimers = (timers) => {
  const sessionData = {
    tempTimers: timers,
    lastActivity: new Date().toISOString()
  }
  return saveToSessionStorage('tempTimersData', sessionData)
}

// Load temporary timers
export const loadTempTimers = () => {
  const sessionData = loadFromSessionStorage('tempTimersData')
  return sessionData ? sessionData.tempTimers : {}
}

// Check if session data is still valid (not expired)
export const isSessionValid = (maxAgeMinutes = 30) => {
  const sessionData = loadFromSessionStorage('tempCandidateData')
  if (!sessionData || !sessionData.lastActivity) {
    return false
  }
  
  const lastActivity = new Date(sessionData.lastActivity)
  const now = new Date()
  const diffMinutes = (now - lastActivity) / (1000 * 60)
  
  return diffMinutes <= maxAgeMinutes
}