// Utility functions for exporting candidate data

// Convert candidates to CSV format
export const exportToCSV = (candidates, filename = 'candidates.csv') => {
  if (!candidates || candidates.length === 0) {
    throw new Error('No candidates to export')
  }

  // Create CSV header
  const headers = [
    'ID',
    'Name',
    'Email',
    'Phone',
    'Score',
    'Completed At',
    'Questions Answered',
    'Average Time per Question'
  ]

  // Create CSV rows
  const rows = candidates.map(candidate => {
    const completedAt = candidate.completedAt ? new Date(candidate.completedAt).toLocaleString() : 'N/A'
    const questionsAnswered = candidate.answers ? candidate.answers.length : 0
    
    // Calculate average time per question
    let avgTime = 'N/A'
    if (candidate.timers && Object.keys(candidate.timers).length > 0) {
      const totalTimes = Object.values(candidate.timers).reduce((sum, time) => sum + time, 0)
      avgTime = Math.round(totalTimes / Object.keys(candidate.timers).length)
    }

    return [
      candidate.id || '',
      candidate.name || '',
      candidate.email || '',
      candidate.phone || '',
      candidate.score || '',
      completedAt,
      questionsAnswered,
      avgTime
    ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
  })

  // Combine headers and rows
  const csvContent = [headers.join(','), ...rows].join('\n')

  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Convert candidates to JSON format
export const exportToJSON = (candidates, filename = 'candidates.json') => {
  if (!candidates || candidates.length === 0) {
    throw new Error('No candidates to export')
  }

  // Create JSON content
  const jsonContent = JSON.stringify(candidates, null, 2)

  // Create download link
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Export detailed candidate report
export const exportCandidateReport = (candidate, filename = `candidate_${candidate.id}_report.json`) => {
  if (!candidate) {
    throw new Error('No candidate to export')
  }

  // Create detailed report
  const report = {
    candidateInfo: {
      id: candidate.id,
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      completedAt: candidate.completedAt ? new Date(candidate.completedAt).toLocaleString() : null
    },
    interviewResults: {
      score: candidate.score,
      summary: candidate.summary
    },
    questionsAndAnswers: candidate.answers?.map(answer => ({
      question: answer.question,
      answer: answer.text,
      score: answer.score,
      timeTaken: candidate.timers ? candidate.timers[`q${answer.questionId}`] : null
    })) || [],
    statistics: {
      totalQuestions: candidate.answers?.length || 0,
      averageScore: candidate.score,
      totalTime: candidate.timers ? 
        Object.values(candidate.timers).reduce((sum, time) => sum + time, 0) : 0
    }
  }

  // Create JSON content
  const jsonContent = JSON.stringify(report, null, 2)

  // Create download link
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}