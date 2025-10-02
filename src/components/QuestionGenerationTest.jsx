import React, { useState } from 'react';
import { generateMCQInterviewQuestions } from '../utils/geminiAPI';

const QuestionGenerationTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const testQuestionGeneration = async () => {
    setIsLoading(true);
    setError(null);
    setTestResult(null);

    try {
      console.log('Starting question generation test...');
      
      // Mock candidate info for testing
      const mockCandidateInfo = {
        name: "Test Candidate",
        email: "test@example.com",
        text: "Experienced React and Node.js developer with 3 years of experience. Skilled in JavaScript, TypeScript, and modern web development practices."
      };

      console.log('Calling generateMCQInterviewQuestions with mock candidate info...');
      const questions = await generateMCQInterviewQuestions(mockCandidateInfo);
      
      console.log('Questions generated successfully:', questions);
      
      setTestResult({
        success: true,
        questions: questions,
        questionCount: questions.length,
        message: "Questions generated successfully!"
      });
    } catch (err) {
      console.error('Error in question generation test:', err);
      setError({
        message: err.message,
        stack: err.stack
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Question Generation Test</h2>
      
      <div className="mb-6">
        <button
          onClick={testQuestionGeneration}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Test Question Generation'}
        </button>
      </div>

      {isLoading && (
        <div className="mb-4 p-4 bg-blue-50 rounded-md">
          <p>Generating questions... Please wait.</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 rounded-md">
          <h3 className="text-lg font-semibold text-red-800">Error:</h3>
          <p className="text-red-700">{error.message}</p>
          <pre className="mt-2 text-xs text-red-600 overflow-auto">
            {error.stack}
          </pre>
        </div>
      )}

      {testResult && (
        <div className="mb-4 p-4 bg-green-50 rounded-md">
          <h3 className="text-lg font-semibold text-green-800">Success!</h3>
          <p className="text-green-700">{testResult.message}</p>
          <p className="text-green-700">Generated {testResult.questionCount} questions.</p>
          
          <div className="mt-4">
            <h4 className="font-semibold">Generated Questions:</h4>
            <div className="mt-2 space-y-4">
              {testResult.questions.map((question, index) => (
                <div key={index} className="p-3 border rounded-md">
                  <div className="flex justify-between items-start">
                    <h5 className="font-medium">Q{index + 1}: {question.question}</h5>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                      {question.difficulty}
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className="text-sm p-2 bg-gray-50 rounded">
                        <span className="font-medium">{String.fromCharCode(65 + optIndex)}:</span> {option}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Correct Answer:</span> {question.answer}
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    <span className="font-medium">Explanation:</span> {question.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-50 rounded-md">
        <h3 className="font-semibold text-yellow-800">Debug Information:</h3>
        <p className="text-sm text-yellow-700">
          Check the browser console for detailed logs during the test.
        </p>
      </div>
    </div>
  );
};

export default QuestionGenerationTest;