# AI Interview Assistant Setup Instructions

## Prerequisites
1. Node.js (version 16 or higher)
2. Google Gemini API Key

## Getting Started

### 1. Obtain Google Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key for use in the next step

### 2. Configure Environment Variables
Create a `.env` file in the root directory of the project with your API key:

```env
# Google Gemini API Key
# Get your API key from https://aistudio.google.com/app/apikey
# Steps:
# 1. Go to https://aistudio.google.com/app/apikey
# 2. Sign in with your Google account
# 3. Click "Create API key"
# 4. Copy the generated key and paste it below (replace YOUR_GOOGLE_API_KEY_HERE)
VITE_GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY_HERE
```

Replace `YOUR_GOOGLE_API_KEY_HERE` with your actual Google API key.

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the Application
```bash
npm run dev
```

The application will start on http://localhost:3000 (or another port if 3000 is in use).

## Model Selection

The application uses a hybrid approach with different Gemini models for different tasks:

- **gemini-1.5-flash**: Used for fast question generation (MCQs, pseudocode, randomization)
- **gemini-1.5-pro**: Used for deeper analysis (answer scoring and candidate summary)

This approach provides:
- Fast response times for real-time interaction
- Professional evaluation and nuanced scoring for final assessment

## Prompt Structure

The application uses improved prompt structures for better AI responses:

### 1. Question Generation (gemini-1.5-flash)
Generates 6 diverse questions (2 easy, 2 medium, 2 hard) with:
- Clear, concise questions
- Pseudocode-style options for hard questions
- Detailed explanations
- Time limits based on difficulty

### 2. Answer Scoring (gemini-1.5-pro)
Evaluates answers based on:
- Technical Accuracy (40%)
- Completeness (30%)
- Clarity (20%)
- Depth (10%)

### 3. Candidate Summary (gemini-1.5-pro)
Provides comprehensive evaluation including:
- Overall score
- Performance summary
- Key strengths
- Areas for improvement
- Hiring recommendation

## Troubleshooting

### API Key Issues
If you're seeing fallback responses or mock data:
1. Verify your API key is correct in the `.env` file
2. Ensure the key starts with `AIza`
3. Check that the key has access to the Gemini API
4. Restart the development server after updating the `.env` file

### Persistence Issues
The application uses Redux Persist with localStorage for data persistence:
- Interview progress is automatically saved
- Refreshing the page or closing the browser will preserve your progress
- The "Welcome Back" modal will appear for unfinished interviews

## Features

### Core Functionality
- Resume upload and parsing
- AI-powered technical interview questions
- Real-time answer scoring
- Comprehensive candidate evaluation
- Data persistence across sessions

### Anti-Cheating Measures
- Copy-paste prevention
- Tab switch detection (flags candidates who switch tabs more than 3 times)
- Time anomaly detection
- Text selection prevention

### Data Management
- Automatic saving of interview progress
- Cross-tab synchronization
- "Welcome Back" modal for unfinished sessions
- Export functionality for candidate reports

## Testing

### Run AI Model Tests
```bash
npm run test-models
```

This will test both models and show which one is being used for each function with the improved prompt structure.