import React from 'react'
import { User, Calendar, Award, Flag } from 'lucide-react'

const CandidateListItem = ({ candidate, onClick }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Not completed'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }
  
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    if (score >= 40) return 'text-orange-600 bg-orange-100'
    return 'text-red-600 bg-red-100'
  }
  
  return (
    <div 
      className={`p-4 border rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer bg-white hover:bg-blue-50 border-gray-200 ${candidate.flagged ? 'border-red-300' : ''}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-3">
          <div className="bg-gray-100 rounded-full p-2 flex-shrink-0 relative">
            <User className="w-5 h-5 text-gray-600" />
            {candidate.flagged && (
              <Flag className="w-4 h-4 text-red-500 absolute -top-1 -right-1" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 flex items-center">
              {candidate.name}
              {candidate.flagged && (
                <Flag className="w-4 h-4 text-red-500 ml-2" />
              )}
            </h3>
            <p className="text-sm text-gray-600 truncate max-w-xs">{candidate.email}</p>
            <div className="flex items-center mt-1 text-xs text-gray-500">
              <Calendar className="w-3 h-3 mr-1" />
              <span>{formatDate(candidate.completedAt)}</span>
            </div>
          </div>
        </div>
        
        {candidate.score !== undefined && (
          <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(candidate.score)}`}>
            <Award className="w-4 h-4 mr-1" />
            {candidate.score}
          </div>
        )}
      </div>
      
      {candidate.summary && (
        <p className="text-sm text-gray-600 mt-3 line-clamp-2">
          {candidate.summary.substring(0, 100)}...
        </p>
      )}
    </div>
  )
}

export default CandidateListItem