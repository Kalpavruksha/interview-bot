import React, { useState } from 'react';
import { 
  FileText, 
  User, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Download,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

const StyledDemo = () => {
  const [activeTab, setActiveTab] = useState('interview');
  
  // Sample data
  const candidates = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      score: 85,
      summary: 'Strong in React and Node.js. Good problem-solving skills.'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      score: 92,
      summary: 'Excellent communication skills. Strong in Python and Django.'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      score: 78,
      summary: 'Good technical knowledge. Needs improvement in soft skills.'
    }
  ];
  
  const questions = [
    {
      id: 1,
      title: 'What is React?',
      text: 'Explain the key features of React.js and why it is widely used for building UI.'
    },
    {
      id: 2,
      title: 'State vs Props',
      text: 'What is the difference between state and props in React?'
    }
  ];
  
  const tabs = [
    { id: 'interview', label: 'Interview', icon: User },
    { id: 'candidates', label: 'Candidates', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: Clock }
  ];
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Dashboard</h1>
        <p className="text-gray-600">Manage your interviews and candidates in one place</p>
      </div>
      
      {/* Tabs */}
      <div className="tab-list mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={activeTab === tab.id ? 'tab-button-active' : 'tab-button-inactive'}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          );
        })}
      </div>
      
      {/* Tab Content */}
      <div className="card p-6">
        {activeTab === 'interview' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Current Interview</h2>
              <div className="flex space-x-2">
                <button className="btn-primary btn-sm flex items-center">
                  <Play className="w-4 h-4 mr-1" />
                  Start
                </button>
                <button className="btn-secondary btn-sm flex items-center">
                  <Pause className="w-4 h-4 mr-1" />
                  Pause
                </button>
              </div>
            </div>
            
            {/* Timer */}
            <div className="timer-container mb-6">
              <div className="timer-header">
                <div className="timer-title">Time Remaining</div>
                <div className="text-sm text-blue-700">Question 1 of 5</div>
              </div>
              <div className="timer-display">14:52</div>
              <div className="timer-progress">
                <div 
                  className="timer-progress-bar" 
                  style={{ width: '65%' }}
                ></div>
              </div>
            </div>
            
            {/* Questions */}
            {questions.map((question) => (
              <div key={question.id} className="question-card secure-text">
                <div className="question-header">
                  <div className="question-icon">
                    <span>Q{question.id}</span>
                  </div>
                  <h3 className="question-title">{question.title}</h3>
                </div>
                <p className="question-text mb-4">{question.text}</p>
                <textarea 
                  className="answer-textarea" 
                  placeholder="Type your answer here..."
                ></textarea>
                <div className="flex justify-end mt-4 space-x-2">
                  <button className="btn-secondary btn-sm">
                    Skip
                  </button>
                  <button className="btn-primary btn-sm">
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'candidates' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Candidate List</h2>
              <button className="btn-primary btn-sm flex items-center">
                <Download className="w-4 h-4 mr-1" />
                Export
              </button>
            </div>
            
            <div className="space-y-3">
              {candidates.map((candidate) => (
                <div key={candidate.id} className="candidate-item">
                  <div className="candidate-header">
                    <div>
                      <div className="candidate-name">{candidate.name}</div>
                      <div className="candidate-email">{candidate.email}</div>
                    </div>
                    <div className="candidate-score">{candidate.score}</div>
                  </div>
                  <p className="candidate-summary">{candidate.summary}</p>
                  <div className="flex justify-end space-x-2 mt-3">
                    <button className="btn-ghost btn-sm">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="btn-ghost btn-sm">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="btn-ghost btn-sm text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="card p-5">
                <div className="text-3xl font-bold text-blue-600 mb-2">24</div>
                <div className="text-gray-600">Total Interviews</div>
              </div>
              <div className="card p-5">
                <div className="text-3xl font-bold text-green-600 mb-2">18</div>
                <div className="text-gray-600">Completed</div>
              </div>
              <div className="card p-5">
                <div className="text-3xl font-bold text-yellow-600 mb-2">6</div>
                <div className="text-gray-600">In Progress</div>
              </div>
            </div>
            
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Performance Overview</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">Technical Skills</span>
                    <span className="text-gray-900 font-medium">85%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-bar-fill bg-blue-600" 
                      style={{ width: '85%' }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">Communication</span>
                    <span className="text-gray-900 font-medium">92%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-bar-fill bg-green-600" 
                      style={{ width: '92%' }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">Problem Solving</span>
                    <span className="text-gray-900 font-medium">78%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-bar-fill bg-yellow-600" 
                      style={{ width: '78%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StyledDemo;