import React from 'react';
import ResumeUpload from './src/components/ResumeUpload';

const TestIsolatedUpload = () => {
  const handleProcessed = (data) => {
    console.log('Resume processed successfully!', data);
    alert('Resume processed successfully! Check console for details.');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Isolated Resume Upload Test</h1>
      <p>Use this page to test the resume upload functionality in isolation.</p>
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        <ResumeUpload onProcessed={handleProcessed} />
      </div>
    </div>
  );
};

export default TestIsolatedUpload;