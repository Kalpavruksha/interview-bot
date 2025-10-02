import React, { useState } from 'react';
import { callGeminiAPI, generateMCQInterviewQuestions, scoreCandidateAnswer, generateMCQCandidateSummary } from '../utils/geminiAPI';

const AITest = () => {
  const [responses, setResponses] = useState({});
  const [isLoading, setIsLoading] = useState({});
  const [errors, setErrors] = useState({});

  const testBasicAI = async () => {
    setIsLoading(prev => ({ ...prev, basic: true }));
    setErrors(prev => ({ ...prev, basic: '' }));
    setResponses(prev => ({ ...prev, basic: '' }));
    
    try {
      const prompt = "Say 'Hello, World!' in JSON format";
      const result = await callGeminiAPI(prompt);
      setResponses(prev => ({ ...prev, basic: result }));
    } catch (err) {
      setErrors(prev => ({ ...prev, basic: `${err.message}\n\nStack: ${err.stack}` }));
      console.error('Basic AI Test Error:', err);
    } finally {
      setIsLoading(prev => ({ ...prev, basic: false }));
    }
  };

  const testQuestionGeneration = async () => {
    setIsLoading(prev => ({ ...prev, questions: true }));
    setErrors(prev => ({ ...prev, questions: '' }));
    setResponses(prev => ({ ...prev, questions: '' }));
    
    try {
      const mockCandidate = {
        name: "Test Candidate",
        text: "Experienced React developer with 3 years of experience"
      };
      const result = await generateMCQInterviewQuestions(mockCandidate);
      setResponses(prev => ({ ...prev, questions: JSON.stringify(result, null, 2) }));
    } catch (err) {
      setErrors(prev => ({ ...prev, questions: `${err.message}\n\nStack: ${err.stack}` }));
      console.error('Question Generation Test Error:', err);
    } finally {
      setIsLoading(prev => ({ ...prev, questions: false }));
    }
  };

  const testAnswerScoring = async () => {
    setIsLoading(prev => ({ ...prev, scoring: true }));
    setErrors(prev => ({ ...prev, scoring: '' }));
    setResponses(prev => ({ ...prev, scoring: '' }));
    
    try {
      const mockQuestion = {
        question: "What is React?",
        options: ["A database", "A JavaScript library", "A CSS framework", "A backend language"],
        answer: "B",
        difficulty: "easy"
      };
      const result = await scoreCandidateAnswer(mockQuestion, "B");
      setResponses(prev => ({ ...prev, scoring: JSON.stringify(result, null, 2) }));
    } catch (err) {
      setErrors(prev => ({ ...prev, scoring: `${err.message}\n\nStack: ${err.stack}` }));
      console.error('Answer Scoring Test Error:', err);
    } finally {
      setIsLoading(prev => ({ ...prev, scoring: false }));
    }
  };

  const testSummaryGeneration = async () => {
    setIsLoading(prev => ({ ...prev, summary: true }));
    setErrors(prev => ({ ...prev, summary: '' }));
    setResponses(prev => ({ ...prev, summary: '' }));
    
    try {
      const mockQuestions = [
        {
          id: 1,
          question: "What is React?",
          difficulty: "easy"
        }
      ];
      const mockAnswers = [
        {
          questionId: 1,
          selectedOption: "B",
          score: 85
        }
      ];
      const result = await generateMCQCandidateSummary(mockQuestions, mockAnswers);
      setResponses(prev => ({ ...prev, summary: JSON.stringify(result, null, 2) }));
    } catch (err) {
      setErrors(prev => ({ ...prev, summary: `${err.message}\n\nStack: ${err.stack}` }));
      console.error('Summary Generation Test Error:', err);
    } finally {
      setIsLoading(prev => ({ ...prev, summary: false }));
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">AI Functionality Tests</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Basic AI Call</h2>
          <button
            onClick={testBasicAI}
            disabled={isLoading.basic}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 mb-4"
          >
            {isLoading.basic ? 'Testing...' : 'Test Basic AI'}
          </button>
          
          {errors.basic && (
            <div className="mt-2 p-3 bg-red-100 text-red-800 rounded-md">
              <h3 className="font-bold">Error:</h3>
              <pre className="whitespace-pre-wrap text-xs">{errors.basic}</pre>
            </div>
          )}
          
          {responses.basic && (
            <div className="mt-2 p-3 bg-green-100 text-green-800 rounded-md">
              <h3 className="font-bold">Response:</h3>
              <pre className="whitespace-pre-wrap text-xs">{responses.basic}</pre>
            </div>
          )}
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Question Generation</h2>
          <button
            onClick={testQuestionGeneration}
            disabled={isLoading.questions}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 mb-4"
          >
            {isLoading.questions ? 'Testing...' : 'Test Question Generation'}
          </button>
          
          {errors.questions && (
            <div className="mt-2 p-3 bg-red-100 text-red-800 rounded-md">
              <h3 className="font-bold">Error:</h3>
              <pre className="whitespace-pre-wrap text-xs">{errors.questions}</pre>
            </div>
          )}
          
          {responses.questions && (
            <div className="mt-2 p-3 bg-green-100 text-green-800 rounded-md">
              <h3 className="font-bold">Response:</h3>
              <pre className="whitespace-pre-wrap text-xs max-h-40 overflow-auto">{responses.questions}</pre>
            </div>
          )}
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Answer Scoring</h2>
          <button
            onClick={testAnswerScoring}
            disabled={isLoading.scoring}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 mb-4"
          >
            {isLoading.scoring ? 'Testing...' : 'Test Answer Scoring'}
          </button>
          
          {errors.scoring && (
            <div className="mt-2 p-3 bg-red-100 text-red-800 rounded-md">
              <h3 className="font-bold">Error:</h3>
              <pre className="whitespace-pre-wrap text-xs">{errors.scoring}</pre>
            </div>
          )}
          
          {responses.scoring && (
            <div className="mt-2 p-3 bg-green-100 text-green-800 rounded-md">
              <h3 className="font-bold">Response:</h3>
              <pre className="whitespace-pre-wrap text-xs">{responses.scoring}</pre>
            </div>
          )}
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Summary Generation</h2>
          <button
            onClick={testSummaryGeneration}
            disabled={isLoading.summary}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 mb-4"
          >
            {isLoading.summary ? 'Testing...' : 'Test Summary Generation'}
          </button>
          
          {errors.summary && (
            <div className="mt-2 p-3 bg-red-100 text-red-800 rounded-md">
              <h3 className="font-bold">Error:</h3>
              <pre className="whitespace-pre-wrap text-xs">{errors.summary}</pre>
            </div>
          )}
          
          {responses.summary && (
            <div className="mt-2 p-3 bg-green-100 text-green-800 rounded-md">
              <h3 className="font-bold">Response:</h3>
              <pre className="whitespace-pre-wrap text-xs">{responses.summary}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AITest;