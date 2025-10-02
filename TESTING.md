# Testing Guide

This document explains how to test the AI-Powered Interview Assistant application to ensure all components are working correctly.

## Prerequisites

Before testing, ensure you have:
1. The application running (both frontend and backend)
2. A valid Google API key configured in your environment variables
3. Access to a web browser

## Test Plan

### 1. Environment Variable Testing

**Objective**: Verify that environment variables are properly loaded

**Steps**:
1. Check that the [.env](file:///D:/interview%20bot/.env) file exists in the root directory with a valid `VITE_GOOGLE_API_KEY`
2. Check that the backend [.env](file:///D:/interview%20bot/backend/.env) file exists with a valid `GOOGLE_API_KEY` (if using backend AI features)
3. Restart the development servers
4. Open the browser console and verify the API key is accessible:
   ```javascript
   console.log(import.meta.env.VITE_GOOGLE_API_KEY)
   ```

### 2. Resume Upload Testing

**Objective**: Verify that resume upload and parsing works correctly

**Steps**:
1. Navigate to the Interviewee Dashboard
2. Click on the "Upload Your Resume" section
3. Upload a PDF or DOCX file
4. Verify that:
   - The file is accepted
   - The processing spinner appears
   - Contact information is extracted and displayed
   - The form progresses to the next step

**Expected Results**:
- File upload should work for both PDF and DOCX formats
- Contact information should be extracted from the resume
- Any missing information should prompt the user to fill it in

### 3. Dynamic Question Generation Testing

**Objective**: Verify that AI-generated questions are personalized based on resume content

**Steps**:
1. Complete the resume upload process
2. Click "Start Interview"
3. Observe the questions being generated
4. Verify that:
   - Questions are relevant to the candidate's experience
   - There are 6 questions total (2 easy, 2 medium, 2 hard)
   - Each question has appropriate time limits

**Expected Results**:
- Questions should be tailored to the candidate's resume content
- Questions should be categorized by difficulty
- Time limits should match the difficulty level

### 4. Interview Flow Testing

**Objective**: Verify that the interview flow works correctly

**Steps**:
1. Start an interview
2. Answer the first question
3. Submit the answer
4. Verify progression to the next question
5. Test pausing and resuming the interview
6. Complete all questions
7. Verify:
   - Timer works correctly
   - Answers are saved
   - Progress indicator updates
   - Interview can be paused and resumed
   - Results are generated after completion

**Expected Results**:
- Timer should count down correctly
- Answers should be saved when submitted
- Progress should update after each question
- Pausing should preserve the current state
- Results should be displayed after the final question

### 5. AI Evaluation Testing

**Objective**: Verify that AI scoring and summary generation works

**Steps**:
1. Complete an interview with sample answers
2. Wait for AI processing
3. Verify that:
   - A score is generated (0-100)
   - A summary is provided
   - Results are saved

**Expected Results**:
- Score should be a number between 0-100
- Summary should provide meaningful feedback
- Results should be stored in the system

### 6. Dashboard Testing

**Objective**: Verify that the interviewer dashboard displays results correctly

**Steps**:
1. Navigate to the Interviewer Dashboard
2. Verify that:
   - Candidates are listed
   - Scores are displayed
   - Search and sort functions work
   - Clicking on a candidate shows details

**Expected Results**:
- All completed interviews should appear in the list
- Scores should match the AI-generated scores
- Search and sort should work as expected
- Candidate details should display correctly

### 7. Data Persistence Testing

**Objective**: Verify that interview progress is saved and restored

**Steps**:
1. Start an interview
2. Answer one or more questions
3. Refresh the page or close and reopen the browser
4. Verify that:
   - The "Welcome Back" modal appears
   - Progress is restored
   - Unfinished interview can be resumed

**Expected Results**:
- Interview progress should be saved automatically
- "Welcome Back" modal should appear for unfinished interviews
- All answered questions and timer states should be restored

### 8. Error Handling Testing

**Objective**: Verify that the application handles errors gracefully

**Steps**:
1. Test with an invalid API key
2. Test with a corrupted resume file
3. Test with network connectivity issues
4. Verify that:
   - Appropriate error messages are displayed
   - The application continues to function
   - Fallback mechanisms work

**Expected Results**:
- Clear error messages should be displayed
- The application should not crash
- Fallback content should be provided when AI services are unavailable

## Automated Testing

### Frontend Unit Tests

To run frontend unit tests:
```bash
cd frontend
npm test
```

### Backend Unit Tests

To run backend unit tests:
```bash
cd backend
go test ./...
```

## Manual Testing Checklist

- [ ] Environment variables configured correctly
- [ ] Resume upload works for PDF and DOCX
- [ ] Contact information extracted correctly
- [ ] Missing fields collected properly
- [ ] AI-generated questions are personalized
- [ ] Interview timer works correctly
- [ ] Answers saved properly
- [ ] Interview can be paused and resumed
- [ ] AI scoring generates appropriate scores
- [ ] AI summary provides meaningful feedback
- [ ] Interviewer dashboard displays results
- [ ] Search and sort functions work
- [ ] Data persists across page refreshes
- [ ] Welcome Back modal appears for unfinished interviews
- [ ] Error handling works appropriately

## Troubleshooting

### Common Issues

1. **API Key Not Working**:
   - Verify the key is correct and doesn't have extra spaces
   - Check that the Generative Language API is enabled in Google Cloud Console
   - Ensure the key has the necessary permissions

2. **Resume Parsing Issues**:
   - Verify the file is in PDF or DOCX format
   - Check that the file is not corrupted
   - Ensure the file size is under 5MB

3. **Timer Not Working**:
   - Check browser console for JavaScript errors
   - Verify that the interview is in "in-progress" state
   - Ensure no browser extensions are interfering

4. **Data Not Persisting**:
   - Check browser's localStorage for saved data
   - Verify Redux Persist is configured correctly
   - Ensure no browser privacy settings are clearing localStorage

### Debugging Tools

1. **Browser Developer Tools**:
   - Use the Console tab to check for errors
   - Use the Network tab to verify API calls
   - Use the Application tab to inspect localStorage

2. **Redux DevTools**:
   - Monitor state changes during the interview process
   - Verify that actions are dispatched correctly
   - Check that state is persisted properly

3. **Backend Logs**:
   - Check the terminal where the backend is running
   - Look for error messages or warnings
   - Verify that API endpoints are being called

## Performance Testing

1. **Load Testing**:
   - Test with multiple concurrent users
   - Verify that the application remains responsive
   - Check for memory leaks or performance degradation

2. **Stress Testing**:
   - Test with large resume files
   - Test with many simultaneous API calls
   - Verify error handling under stress conditions

## Security Testing

1. **API Key Security**:
   - Verify that API keys are not exposed in client-side code
   - Check that keys are properly restricted in Google Cloud Console
   - Ensure keys are not committed to version control

2. **Data Privacy**:
   - Verify that candidate data is handled securely
   - Check that sensitive information is not logged
   - Ensure proper data retention policies are in place