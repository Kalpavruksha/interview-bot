# Project Structure

This document explains the structure of the AI-Powered Interview Assistant project.

## Overall Structure

```
interview-bot/
├── backend/
│   ├── main.go              # Main Go application file
│   ├── go.mod               # Go module definition
│   ├── go.sum               # Go module checksums
│   ├── .env                 # Environment variables (not in repo)
│   ├── MONGODB_INTEGRATION.md # MongoDB integration guide
│   └── README.md            # Backend-specific README
├── frontend/
│   ├── public/              # Static assets
│   ├── src/                 # React source code
│   │   ├── components/      # React components
│   │   ├── reducers/        # Redux reducers
│   │   ├── store/           # Redux store configuration
│   │   ├── App.jsx          # Main App component
│   │   └── main.jsx         # Entry point
│   ├── package.json         # Node.js dependencies
│   ├── vite.config.js       # Vite configuration
│   └── README.md            # Frontend-specific README
├── README.md                # Main project README
├── RUNNING.md               # Instructions for running the application
├── PROJECT_STRUCTURE.md     # This file
└── setup.bat                # Windows setup script
```

## Backend Structure

The backend is built with Go and uses the Gin framework for HTTP handling.

### Main Components

1. **main.go** - The primary application file containing:
   - Data models (Candidate, Answer, Question)
   - API endpoint handlers
   - Server initialization
   - CORS configuration

2. **go.mod/go.sum** - Go dependency management files

3. **.env** - Environment variables (not included in repository for security)

### API Endpoints

The backend provides RESTful API endpoints:

- `/api/upload-resume` (POST) - Handles resume upload and parsing
- `/api/questions` (GET) - Returns interview questions
- `/api/submit-answer` (POST) - Accepts candidate answers
- `/api/candidates` (GET) - Returns all candidates
- `/api/candidate/:id` (GET) - Returns a specific candidate

### Data Models

The backend uses three primary data models:

1. **Candidate** - Represents an interview candidate with their information and answers
2. **Answer** - Represents a candidate's answer to a specific question
3. **Question** - Represents an interview question with its properties

## Frontend Structure

The frontend is built with React and Vite, using Ant Design for UI components.

### Main Components

1. **App.jsx** - Main application component that sets up routing
2. **components/** - Directory containing React components:
   - IntervieweePage.jsx - Interviewee dashboard
   - InterviewerPage.jsx - Interviewer dashboard
   - InterviewChat.jsx - Chat interface for interviews
   - CandidateList.jsx - List of candidates
   - CandidateDetail.jsx - Detailed view of a candidate
   - ResumeUpload.jsx - Resume upload component
   - WelcomeBackModal.jsx - Modal for returning candidates
3. **reducers/** - Redux reducers for state management
4. **store/** - Redux store configuration

### State Management

The frontend uses Redux Toolkit with Redux Persist for state management:

1. **interviewReducer.js** - Main reducer handling interview state
2. **store.js** - Redux store configuration with persistence

### Routing

The application uses React Router for navigation between the two main pages:
- `/interviewee` - Interviewee dashboard
- `/interviewer` - Interviewer dashboard

## Data Flow

1. **Resume Upload**: Candidate uploads resume → Backend parses and extracts data → Frontend collects missing fields
2. **Interview Process**: Backend generates questions → Frontend displays timed questions → Candidate submits answers → Backend processes answers
3. **Data Persistence**: Redux Persist stores interview progress in localStorage → Data survives page refreshes
4. **Dashboard**: Backend provides candidate data → Frontend displays in sortable/searchable list

## MongoDB Integration

When MongoDB is available:
1. Candidate data is stored in the `candidates` collection
2. Questions are stored in the `questions` collection
3. Answers are embedded within candidate documents

When MongoDB is not available:
1. Data is stored in-memory
2. Data is lost when the application restarts

## Build Process

### Backend
- Go compiles to a single executable
- No build step required for development (go run)

### Frontend
- Vite handles bundling and development server
- Development: `npm run dev`
- Production: `npm run build`

## Configuration Files

1. **.env** (backend) - Environment variables
2. **vite.config.js** (frontend) - Vite configuration
3. **package.json** (frontend) - Dependencies and scripts
4. **go.mod** (backend) - Go dependencies

## Development Workflow

1. **Frontend Development**: Use Vite's hot module replacement for rapid development
2. **Backend Development**: Restart the Go server when changes are made
3. **API Testing**: Use tools like Postman or curl to test endpoints
4. **State Debugging**: Use Redux DevTools to inspect application state