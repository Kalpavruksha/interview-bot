import React, { useState, useRef } from 'react'
import { Upload, FileText, CheckCircle } from 'lucide-react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Toast } from './ui/toast'
// Removed useUploadResume import
import { validateResumeFile } from '../utils/validation'
import { parseResume } from '../utils/resumeParser' // Added local resume parser

const ResumeUpload = ({ onProcessed }) => {
  const [file, setFile] = useState(null)
  const [toast, setToast] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false) // Added local state for processing
  const [uploadSuccess, setUploadSuccess] = useState(false) // Track upload success
  const fileInputRef = useRef(null)
  
  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0]
    
    if (!selectedFile) {
      return
    }
    
    console.log('Selected file:', selectedFile.name, selectedFile.type, selectedFile.size);
    
    // Validate file with Zod
    const validation = validateResumeFile(selectedFile)
    
    if (!validation.success) {
      showToast(Object.values(validation.errors)[0] || 'Invalid file', 'error')
      return
    }
    
    setFile(selectedFile)
    setUploadSuccess(false) // Reset success state when new file is selected
    // Auto-process when file is selected
    await handleProcessFile(selectedFile)
  }
  
  const showToast = (message, type = 'default', duration = 3000) => {
    setToast({ message, type, duration })
  }
  
  const handleProcessFile = async (fileToProcess) => {
    const fileToUse = fileToProcess || file
    
    if (!fileToUse) {
      showToast('Please select a file first', 'error')
      return
    }
    
    setIsProcessing(true) // Set processing state
    
    try {
      // Clear any previous state before processing new resume
      // Use local resume parser instead of backend API
      console.log('Processing file:', fileToUse.name, fileToUse.type, fileToUse.size);
      const parsedData = await parseResume(fileToUse)
      console.log('Parsed data:', parsedData);
      
      // Call the onProcessed callback
      onProcessed(parsedData)
      
      // Set success state
      setUploadSuccess(true)
      
      // Show success message for a longer duration
      showToast('Resume processed successfully! Proceeding to interview...', 'success', 5000)
    } catch (error) {
      console.error('Error processing resume:', error) // Debug log
      setUploadSuccess(false) // Reset success state on error
      showToast(`Error processing resume: ${error.message || 'Unknown error'}`, 'error')
    } finally {
      setIsProcessing(false) // Reset processing state
    }
  }
  
  const handleUploadClick = () => {
    // Reset the file input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    // Trigger file input click
    fileInputRef.current?.click()
  }
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Your Resume</h2>
        <p className="text-gray-600">
          Please upload your resume in PDF or DOCX format. We'll extract your contact information to get started.
        </p>
      </div>
      
      <Card className="p-8 border-2 border-dashed border-gray-300 rounded-2xl hover:border-blue-500 transition-colors bg-white">
        <div 
          className="text-center cursor-pointer"
          onClick={handleUploadClick}
        >
          {file && uploadSuccess ? (
            <div className="flex flex-col items-center">
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-lg font-medium text-gray-900 mb-1">Resume Processed Successfully!</p>
              <p className="text-gray-500 text-sm">
                Proceeding to interview setup...
              </p>
            </div>
          ) : file ? (
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-lg font-medium text-gray-900 mb-1">{file.name}</p>
              <p className="text-gray-500 text-sm">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Type: {file.type || 'Unknown'}
              </p>
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleProcessFile(file);
                }}
                disabled={isProcessing}
                className="mt-4"
              >
                {isProcessing ? 'Processing...' : 'Process Resume'}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-lg font-medium text-gray-900 mb-1">Click or drag file to this area to upload</p>
              <p className="text-gray-500">
                Support for a single PDF or DOCX file upload. File size limit: 5MB
              </p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </Card>
      
      {isProcessing && (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <span className="text-gray-700 font-medium">Extracting information from your resume...</span>
          </div>
          <p className="text-gray-500 text-sm mt-2">
            This may take a few seconds. We're using AI to parse your resume.
          </p>
        </div>
      )}
      
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          duration={toast.duration}
          onClose={() => setToast(null)} 
        />
      )}
      
      {/* Info section */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          How it works
        </h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• We extract your name, email, and phone number from your resume</li>
          <li>• AI generates personalized technical questions based on your experience</li>
          <li>• Your answers are scored and analyzed by our AI assistant</li>
          <li>• Results are available immediately after completion</li>
        </ul>
      </div>
    </div>
  )
}

export default ResumeUpload