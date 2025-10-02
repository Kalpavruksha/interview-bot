import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Input, Select, Empty } from 'antd'
import CandidateListItem from './CandidateListItem'
import { Search, Filter } from 'lucide-react'

const { Search: AntSearch } = Input
const { Option } = Select

const CandidateList = ({ candidates }) => {
  const dispatch = useDispatch()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState('score') // score, name, date
  
  // Filter candidates based on search term
  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  // Sort candidates based on selected option
  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    if (sortOption === 'score') {
      return (b.score || 0) - (a.score || 0)
    } else if (sortOption === 'name') {
      return a.name.localeCompare(b.name)
    } else if (sortOption === 'date') {
      return new Date(b.completedAt || 0) - new Date(a.completedAt || 0)
    }
    return 0
  })
  
  const handleSelectCandidate = (candidate) => {
    dispatch({ type: 'SET_CURRENT_CANDIDATE', payload: candidate })
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
            className="pl-10"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Select
            value={sortOption}
            onChange={(value) => setSortOption(value)}
            className="pl-10 w-full sm:w-40"
          >
            <Option value="score">Sort by Score</Option>
            <Option value="name">Sort by Name</Option>
            <Option value="date">Sort by Date</Option>
          </Select>
        </div>
      </div>
      
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
        {sortedCandidates.length > 0 ? (
          sortedCandidates.map(candidate => (
            <CandidateListItem
              key={candidate.id}
              candidate={candidate}
              onClick={() => handleSelectCandidate(candidate)}
            />
          ))
        ) : (
          <Empty 
            description="No candidates found" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            className="py-8"
          />
        )}
      </div>
    </div>
  )
}

export default CandidateList