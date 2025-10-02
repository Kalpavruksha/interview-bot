import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card'
import { UserIcon, DownloadIcon, BarChartIcon } from 'lucide-react'
import { Button } from './ui/button'
import { toast } from 'react-hot-toast'
import CandidateList from './CandidateList'
import CandidateDetail from './CandidateDetail'
import { exportToCSV, exportToJSON } from '../utils/exportUtils'

const InterviewerPage = () => {
  const dispatch = useDispatch()
  const { allCandidates, currentCandidate } = useSelector(state => state.interview)
  
  const handleExportCSV = () => {
    try {
      if (allCandidates.length === 0) {
        toast.error('No candidates to export')
        return
      }
      exportToCSV(allCandidates, 'interview_candidates.csv')
      toast.success('Candidates exported to CSV successfully!')
    } catch (error) {
      console.error('Error exporting to CSV:', error)
      toast.error('Failed to export candidates to CSV')
    }
  }
  
  const handleExportJSON = () => {
    try {
      if (allCandidates.length === 0) {
        toast.error('No candidates to export')
        return
      }
      exportToJSON(allCandidates, 'interview_candidates.json')
      toast.success('Candidates exported to JSON successfully!')
    } catch (error) {
      console.error('Error exporting to JSON:', error)
      toast.error('Failed to export candidates to JSON')
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Interviewer Dashboard</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Review candidate interviews, analyze performance, and export results. 
          All data is processed with AI-powered insights.
        </p>
      </div>
      
      <Card className="shadow-lg border-0 rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 text-white">
          <CardHeader className="p-0">
            <CardTitle className="text-2xl text-white flex items-center">
              <BarChartIcon className="mr-2" />
              Candidate Performance Overview
            </CardTitle>
            <CardDescription className="text-green-100">
              {allCandidates.length > 0 
                ? `Tracking ${allCandidates.length} candidate${allCandidates.length !== 1 ? 's' : ''}` 
                : 'No candidates interviewed yet'}
            </CardDescription>
          </CardHeader>
        </div>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Candidate Management</h2>
              <p className="text-gray-600">Review and analyze interview results</p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleExportCSV}
                variant="outline"
                size="sm"
                disabled={allCandidates.length === 0}
                className="flex items-center"
              >
                <DownloadIcon className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button 
                onClick={handleExportJSON}
                variant="outline"
                size="sm"
                disabled={allCandidates.length === 0}
                className="flex items-center"
              >
                <DownloadIcon className="w-4 h-4 mr-2" />
                Export JSON
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="p-6 h-full border-0 shadow-md rounded-xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Candidates</h2>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {allCandidates.length} candidate{allCandidates.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <CandidateList candidates={allCandidates} />
              </Card>
            </div>
            <div className="lg:col-span-2">
              {currentCandidate && currentCandidate.id ? (
                <CandidateDetail />
              ) : allCandidates && allCandidates.length > 0 ? (
                <Card className="p-12 text-center border-0 shadow-md rounded-xl">
                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-blue-100 p-4 rounded-full mb-4">
                      <UserIcon className="h-12 w-12 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Select a Candidate</h3>
                    <p className="text-gray-600 max-w-md">
                      Choose a candidate from the list to view their interview details, 
                      performance metrics, and AI-generated feedback.
                    </p>
                  </div>
                </Card>
              ) : (
                <Card className="p-12 text-center border-0 shadow-md rounded-xl">
                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-gray-100 p-4 rounded-full mb-4">
                      <UserIcon className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No Candidates Yet</h3>
                    <p className="text-gray-600 max-w-md">
                      Candidates will appear here after they complete their interviews. 
                      Encourage candidates to upload their resumes and take the AI-powered interview.
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Stats cards */}
      {allCandidates.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="p-6 text-center border-0 shadow-md rounded-xl">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {allCandidates.length}
            </div>
            <div className="text-gray-600">Total Candidates</div>
          </Card>
          <Card className="p-6 text-center border-0 shadow-md rounded-xl">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {Math.round(allCandidates.reduce((acc, candidate) => acc + (candidate.score || 0), 0) / allCandidates.length) || 0}
            </div>
            <div className="text-gray-600">Average Score</div>
          </Card>
          <Card className="p-6 text-center border-0 shadow-md rounded-xl">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {allCandidates.filter(c => c.completedAt).length}
            </div>
            <div className="text-gray-600">Completed Interviews</div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default InterviewerPage