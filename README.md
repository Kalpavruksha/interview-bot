# CivicAI
# AI-Powered Civic Issue Classifier

A complete end-to-end system for classifying and managing civic complaints using AI and machine learning.

## System Architecture

### 1. Citizen Complaint Submission
- Mobile/web interface for citizens to report issues
- Text description, optional photo/video, location, and contact information
- Real-time submission to backend server

### 2. Backend Processing
- Node.js/Express server with MongoDB storage
- Text preprocessing and cleaning
- AI classification for issue categorization
- Urgency detection based on keywords and context
- Automatic department assignment

### 3. AI/NLP Pipeline
- Text preprocessing (cleaning, lowercasing, removing stop words)
- Issue categorization (Pothole, Garbage, Water, Electricity, Street Light, General)
- Urgency detection (High, Medium, Low)
- Confidence scoring for classifications

### 4. Authority Dashboard
- Comprehensive dashboard for government officials
- Filtering by category, urgency, status, and department
- Status updates and tracking
- Statistics and reporting

### 5. Notification System
- Automatic notifications to citizens on status changes
- Department assignment notifications
- Resolution confirmations

## Technology Stack

### Frontend
- React with Vite
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls

### Backend
- Node.js with Express
- MongoDB for data storage
- Multer for file uploads
- Axios for AI service communication

### AI Services
- Python FastAPI for NLP services
- Rule-based classification with keyword matching
- Confidence scoring algorithms

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Frontend Setup:**
```bash
cd frontend
npm install
```

2. **Backend Setup:**
```bash
cd backend
npm install
```

3. **AI Service Setup:**
```bash
pip install -r requirements.txt
```

### Running the Application

1. **Start MongoDB:**
```bash
mongod
```

2. **Start AI Service:**
```bash
uvicorn ai:app --port 8000
```

3. **Start Backend:**
```bash
cd backend
node server.js
```

4. **Start Frontend:**
```bash
cd frontend
npm run dev
```

## API Endpoints

### Backend (Port 5000)
- `POST /complaints` - Submit a new complaint
- `GET /complaints` - Get all complaints
- `PUT /complaints/:id` - Update complaint status
- `GET /complaints/category/:category` - Get complaints by category
- `GET /complaints/urgency/:urgency` - Get complaints by urgency
- `GET /complaints/department/:department` - Get complaints by department
- `GET /complaints/stats` - Get complaint statistics

### AI Service (Port 8000)
- `POST /classify` - Classify complaint text
- `GET /health` - Health check
- `GET /` - Service information

## Workflow

1. Citizen submits complaint through web/mobile interface
2. Backend stores complaint and forwards text to AI service
3. AI service preprocesses text and classifies issue
4. Urgency level is determined
5. Department is automatically assigned
6. Results stored in database
7. Authority dashboard displays categorized complaints
8. System notifies citizen and assigns to department
9. Citizen receives updates on progress
10. Issue is resolved and closed with feedback

## Features

- Real-time complaint submission
- AI-powered categorization and urgency detection
- Automatic department assignment
- Comprehensive dashboard with filtering
- Status tracking and updates
- Statistics and reporting
- Responsive design for mobile and desktop
- File upload support (images/videos)
- Location services integration
