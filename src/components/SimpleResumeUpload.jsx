import React, { useState, useRef } from 'react'

const SimpleResumeUpload = ({ onProcessed }) => {
  const [file, setFile] = useState(null)
  const fileInputRef = useRef(null)
  
  const handleFileChange = async (event) => {
    console.log('File change event triggered')
    const selectedFile = event.target.files[0]
    
    if (!selectedFile) {
      console.log('No file selected')
      return
    }
    
    console.log('File selected:', selectedFile.name)
    setFile(selectedFile)
    
    // Simulate processing
    setTimeout(() => {
      console.log('Processing complete')
      // Create mock parsed data
      const mockData = {
        name: selectedFile.name.split('.')[0],
        email: '',
        phone: '',
        text: `This is mock data for file: ${selectedFile.name}`
      }
      onProcessed(mockData)
    }, 1000)
  }
  
  const handleUploadClick = () => {
    console.log('Upload area clicked')
    fileInputRef.current?.click()
  }
  
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Simple Resume Upload Test</h2>
      <div 
        onClick={handleUploadClick}
        style={{ 
          border: '2px dashed #ccc', 
          padding: '40px', 
          borderRadius: '8px',
          cursor: 'pointer',
          backgroundColor: '#f9f9f9'
        }}
      >
        {file ? (
          <div>
            <p>Selected file: {file.name}</p>
            <p>Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        ) : (
          <div>
            <p>Click to select a file</p>
            <p style={{ fontSize: '14px', color: '#666' }}>
              Support for PDF and DOCX files
            </p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  )
}

export default SimpleResumeUpload