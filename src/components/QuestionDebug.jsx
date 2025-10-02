import React, { useState } from 'react';
import { generateMCQInterviewQuestions } from '../utils/geminiAPI';

const QuestionDebug = () => {
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const testQuestionGeneration = async () => {
    setIsLoading(true);
    setError('');
    setGeneratedQuestions([]);
    
    try {
      const mockCandidate = {
        name: "Test Candidate",
        text: "Experienced React developer with 3 years of experience in building web applications using React, Node.js, and MongoDB. Strong skills in JavaScript, HTML, CSS, and modern frontend frameworks."
      };
      
      console.log('Generating questions for candidate:', mockCandidate);
      const questions = await generateMCQInterviewQuestions(mockCandidate);
      console.log('Generated questions:', questions);
      setGeneratedQuestions(questions);
    } catch (err) {
      console.error('Error generating questions:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Question Generation Debug</h1>
      
      <button
        onClick={testQuestionGeneration}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 mb-4"
      >
        {isLoading ? 'Generating...' : 'Generate Questions'}
      </button>
      
      {error && (
        <div className="mt-2 p-3 bg-red-100 text-red-800 rounded-md">
          <h3 className="font-bold">Error:</h3>
          <pre className="whitespace-pre-wrap text-xs">{error}</pre>
        </div>
      )}
      
      {generatedQuestions.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Generated Questions:</h2>
          <div className="space-y-4">
            {generatedQuestions.map((question, index) => (
              <div key={question.id} className="border rounded-lg p-4">
                <h3 className="font-bold">Question {index + 1} (ID: {question.id})</h3>
                <p className="mt-2"><strong>Question:</strong> {question.question}</p>
                <p className="mt-1"><strong>Difficulty:</strong> {question.difficulty}</p>
                <p className="mt-1"><strong>Type:</strong> {question.type}</p>
                <p className="mt-1"><strong>Time Limit:</strong> {question.timeLimit}s</p>
                <p className="mt-1"><strong>Correct Answer:</strong> {question.answer}</p>
                <div className="mt-2">
                  <strong>Options:</strong>
                  <ul className="list-disc pl-5 mt-1">
                    {question.options.map((option, i) => (
                      <li key={i}>{String.fromCharCode(65 + i)}. {option}</li>
                    ))}
                  </ul>
                </div>
                <p className="mt-2"><strong>Explanation:</strong> {question.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionDebug;