# Running the AI-Powered Interview Assistant

This document explains how to set up and run the AI-Powered Interview Assistant application.

## Prerequisites

Before running the application, ensure you have the following installed:

1. **Go** (version 1.21 or higher)
2. **Node.js** (version 16 or higher)
3. **npm** (comes with Node.js)
4. **MongoDB** (optional, for persistent storage)

## Project Structure

```
interview-bot/
├── backend/
│   ├── main.go
│   ├── go.mod
│   ├── go.sum
│   └── .env
└── frontend/
    ├── src/
    ├── package.json
    └── vite.config.js
```

## Backend Setup

### 1. Install Go Dependencies

Navigate to the backend directory and install the required Go modules:

```bash
cd backend
go mod tidy
```

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```env
# Optional: MongoDB connection string for persistent storage
MONGODB_URI=mongodb://localhost:27017

# Optional: Port for the backend server (default is 8081)
PORT=8081
```

If you don't have MongoDB installed, the application will automatically fall back to in-memory storage.

### 3. Run the Backend Server

```bash
cd backend
go run main.go
```

The backend server will start on `http://localhost:8081` (or the port specified in your .env file).

## Frontend Setup

### 1. Install Node Dependencies

Navigate to the frontend directory and install the required packages:

```bash
cd frontend
npm install
```

### 2. Run the Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend development server will start on `http://localhost:5173`.

## Running Both Servers Concurrently

For development, you'll want to run both the backend and frontend servers simultaneously.

### Option 1: Separate Terminals

Open two terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
go run main.go
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

### Option 2: Using a Process Manager

Install and use a process manager like `concurrently`:

```bash
npm install -g concurrently
```

Then run both servers with one command:

```bash
concurrently "cd backend && go run main.go" "cd frontend && npm run dev"
```

## Building for Production

### Backend

To build the backend for production:

```bash
cd backend
go build -o interview-bot-backend main.go
```

This will create an executable file that you can run:

```bash
./interview-bot-backend
```

### Frontend

To build the frontend for production:

```bash
cd frontend
npm run build
```

This will create a `dist/` directory with the production-ready frontend files.

## API Endpoints

The backend provides the following API endpoints:

- `POST /api/upload-resume` - Upload and parse a resume file
- `GET /api/questions` - Retrieve interview questions
- `POST /api/submit-answer` - Submit an interview answer
- `GET /api/candidates` - Get a list of all candidates
- `GET /api/candidate/:id` - Get details for a specific candidate

## Troubleshooting

### Common Issues

1. **Port Conflicts**: If port 8081 or 5173 is already in use, change the PORT in the .env file or vite.config.js

2. **CORS Errors**: The backend includes CORS headers, but if you encounter issues, verify the CORS configuration in main.go

3. **Dependency Issues**: Run `go mod tidy` in the backend and `npm install` in the frontend to ensure all dependencies are installed

4. **MongoDB Connection**: If MongoDB is not connecting, verify your connection string in the .env file

### Logs

The backend server logs information to the console, including:
- Server startup messages
- MongoDB connection status
- API request information
- Error messages

### Development vs Production

- **Development**: Use `npm run dev` for the frontend to enable hot reloading
- **Production**: Use `npm run build` for the frontend and serve the built files

## Next Steps

1. Implement resume parsing functionality in the uploadResume endpoint
2. Integrate with an AI service for question generation and answer evaluation
3. Add user authentication and authorization
4. Implement real-time features with WebSockets
5. Add more comprehensive error handling and validation