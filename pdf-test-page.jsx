import React from 'react';
import ResumeUpload from './src/components/ResumeUpload';

const PdfTestPage = () => {
  const handleProcessed = (data) => {
    console.log('Resume processed:', data);
    alert('Resume processed successfully! Check console for details.');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>PDF Upload Test Page</h1>
      <p>Use this page to test PDF file upload functionality.</p>
      <ResumeUpload onProcessed={handleProcessed} />
    </div>
  );
};

export default PdfTestPage;