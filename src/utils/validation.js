import { z } from 'zod'

// Candidate information validation schema
export const candidateSchema = z.object({
  id: z.string().optional(),
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  
  phone: z.string()
    .min(1, 'Phone number is required')
    .regex(
      /^(\+?\d{1,2}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
      'Please enter a valid phone number'
    ),
  
  // Flagged status fields
  flagged: z.boolean().optional(),
  flaggedReason: z.string().optional()
})

// Resume file validation schema
export const resumeFileSchema = z.object({
  name: z.string(),
  size: z.number(),
  type: z.string() // Changed from enum to string to be more flexible
}).refine(
  (file) => file.size <= 5 * 1024 * 1024, // 5MB limit
  {
    message: 'File size must be less than 5MB',
    path: ['size']
  }
).refine(
  (file) => {
    // Check MIME type
    if ([
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ].includes(file.type)) {
      return true;
    }
    
    // Check file extension as fallback
    const extension = file.name.toLowerCase().split('.').pop();
    return ['pdf', 'docx'].includes(extension);
  },
  {
    message: 'File must be a PDF or DOCX document',
    path: ['type']
  }
)

// MCQ Answer validation schema
export const answerSchema = z.object({
  id: z.number().optional(),
  questionId: z.number().positive('Question ID is required'),
  question: z.string().min(1, 'Question text is required'),
  selectedOption: z.string().min(1, 'Selected option is required'),
  timestamp: z.string().optional(),
  score: z.number().optional(),
  correct: z.boolean().optional(),
  explanation: z.string().optional()
})

// Interview state validation schema
export const interviewStateSchema = z.object({
  currentCandidate: z.object({
    id: z.string().nullable(),
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    interviewStep: z.number(),
    timers: z.record(z.string(), z.number()),
    answers: z.array(answerSchema),
    flagged: z.boolean().optional(),
    flaggedReason: z.string().optional()
  }),
  allCandidates: z.array(candidateSchema),
  currentQuestion: z.any().nullable(),
  currentQuestionIndex: z.number(),
  interviewStatus: z.enum(['not-started', 'in-progress', 'paused', 'completed']),
  showWelcomeBack: z.boolean(),
  questions: z.array(z.object({
    id: z.number(),
    type: z.enum(['mcq', 'mcq-pseudocode']),
    question: z.string(),
    options: z.array(z.string()),
    answer: z.string(),
    explanation: z.string(),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    timeLimit: z.number()
  }))
})

// Timer validation schema
export const timerSchema = z.object({
  questionId: z.string(),
  timeLeft: z.number().min(0),
  updatedAt: z.string()
})

// Export options validation schema
export const exportOptionsSchema = z.object({
  format: z.enum(['csv', 'json']),
  includeDetails: z.boolean(),
  filename: z.string().min(1).max(255)
})

// Session storage validation schema
export const sessionDataSchema = z.object({
  tempCandidate: candidateSchema.optional(),
  tempAnswers: z.array(answerSchema),
  tempTimers: z.record(z.string(), z.number()),
  lastActivity: z.string()
})

// Validate candidate information
export const validateCandidate = (data) => {
  try {
    const validatedData = candidateSchema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.reduce((acc, err) => {
        acc[err.path[0]] = err.message
        return acc
      }, {})
      return { success: false, errors }
    }
    return { success: false, errors: { general: 'Validation failed' } }
  }
}

// Validate resume file
export const validateResumeFile = (file) => {
  try {
    const fileData = {
      name: file.name,
      size: file.size,
      type: file.type
    }
    const validatedData = resumeFileSchema.parse(fileData)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.reduce((acc, err) => {
        acc[err.path[0]] = err.message
        return acc
      }, {})
      return { success: false, errors }
    }
    return { success: false, errors: { general: 'File validation failed' } }
  }
}

// Validate answer
export const validateAnswer = (data) => {
  try {
    const validatedData = answerSchema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.reduce((acc, err) => {
        acc[err.path[0]] = err.message
        return acc
      }, {})
      return { success: false, errors }
    }
    return { success: false, errors: { general: 'Answer validation failed' } }
  }
}

// Validate interview state
export const validateInterviewState = (state) => {
  try {
    const validatedData = interviewStateSchema.parse(state)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.reduce((acc, err) => {
        // Create a path string for nested objects
        const path = err.path.join('.')
        acc[path] = err.message
        return acc
      }, {})
      return { success: false, errors }
    }
    return { success: false, errors: { general: 'Interview state validation failed' } }
  }
}

// Validate timer data
export const validateTimer = (data) => {
  try {
    const validatedData = timerSchema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.reduce((acc, err) => {
        acc[err.path[0]] = err.message
        return acc
      }, {})
      return { success: false, errors }
    }
    return { success: false, errors: { general: 'Timer validation failed' } }
  }
}

// Validate export options
export const validateExportOptions = (data) => {
  try {
    const validatedData = exportOptionsSchema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.reduce((acc, err) => {
        acc[err.path[0]] = err.message
        return acc
      }, {})
      return { success: false, errors }
    }
    return { success: false, errors: { general: 'Export options validation failed' } }
  }
}

// Validate session data
export const validateSessionData = (data) => {
  try {
    const validatedData = sessionDataSchema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.reduce((acc, err) => {
        // Create a path string for nested objects
        const path = err.path.join('.')
        acc[path] = err.message
        return acc
      }, {})
      return { success: false, errors }
    }
    return { success: false, errors: { general: 'Session data validation failed' } }
  }
}