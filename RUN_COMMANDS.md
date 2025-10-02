# Complete Application Run Commands

This document provides the step-by-step commands to run the complete AI-Powered Interview Assistant application.

## Prerequisites

Before running the application, ensure you have:

1. **Go** (version 1.21 or higher) installed
2. **Node.js** (version 16 or higher) installed
3. **npm** (comes with Node.js) installed
4. Environment variables properly configured (see [ENVIRONMENT.md](ENVIRONMENT.md))

## Directory Structure

```
interview-bot/
├── backend/           # Go backend server
│   └── main.go        # Main backend application
├── src/               # React frontend source code
├── package.json       # Frontend dependencies and scripts
└── vite.config.js     # Vite configuration
```

## Running the Complete Application

### Option 1: Manual Start (Recommended for Development)

#### Step 1: Start the Backend Server

Open a new terminal/command prompt and navigate to the backend directory:

```bash
cd backend
go run main.go
```

The backend server will start on `http://localhost:8081` (or the port specified in your .env file).

#### Step 2: Start the Frontend Development Server

Open another terminal/command prompt in the root directory:

```bash
npm run dev
```

The frontend development server will start on `http://localhost:3000` (as configured in vite.config.js).

#### Step 3: Access the Application

Open your browser and navigate to `http://localhost:3000` to access the application.

### Option 2: Using Concurrently (Recommended for Development)

If you want to run both servers with a single command, you can install and use `concurrently`:

#### Step 1: Install Concurrently (Global Installation)

```bash
npm install -g concurrently
```

#### Step 2: Run Both Servers

From the root directory, run:

```bash
concurrently "cd backend && go run main.go" "npm run dev"
```

This will start both the backend and frontend servers simultaneously.

### Option 3: Production Build and Run

#### Step 1: Build the Frontend

```bash
npm run build
```

This will create a `dist/` directory with the production-ready frontend files.

#### Step 2: Run the Backend Server

```bash
cd backend
go build -o interview-bot-backend main.go
./interview-bot-backend
```

On Windows, use:
```bash
cd backend
go build -o interview-bot-backend.exe main.go
interview-bot-backend.exe
```

#### Step 3: Serve the Frontend

For production, you'll need to serve the built frontend files. The backend is already configured to serve static files from the `dist/` directory.

### Option 4: Using Process Manager (Recommended for Production)

For production deployments, consider using a process manager like PM2:

#### Step 1: Install PM2

```bash
npm install -g pm2
```

#### Step 2: Create an Ecosystem File

Create a file named `ecosystem.config.js` in the root directory:

```javascript
module.exports = {
  apps: [
    {
      name: 'interview-bot-backend',
      cwd: './backend',
      script: 'go',
      args: 'run main.go',
      env: {
        NODE_ENV: 'production',
      }
    },
    {
      name: 'interview-bot-frontend',
      script: 'npm',
      args: 'run dev', // For development
      // args: 'run preview', // For production (after build)
      env: {
        NODE_ENV: 'production',
      }
    }
  ]
};
```

#### Step 3: Start Applications

```bash
pm2 start ecosystem.config.js
```

## Environment Variables

Before running the application, make sure to set up your environment variables:

### Backend (.env in backend directory)
```env
MONGODB_URI=mongodb://localhost:27017
GOOGLE_API_KEY=your_google_api_key_here
PORT=8081
```

### Frontend (.env in root directory)
```env
VITE_GOOGLE_API_KEY=your_google_api_key_here
```

## Verification

After starting both servers:

1. **Backend**: Visit `http://localhost:8081/api/candidates` to verify the backend is running
2. **Frontend**: Visit `http://localhost:3000` to access the application
3. **API Connection**: The frontend should be able to communicate with the backend

## Troubleshooting

### Common Issues

1. **Port Conflicts**:
   - If port 8081 is in use, change the PORT in backend/.env
   - If port 3000 is in use, modify the port in vite.config.js

2. **Dependency Issues**:
   - Run `go mod tidy` in the backend directory
   - Run `npm install` in the root directory

3. **Environment Variables Not Loading**:
   - Verify .env files are in the correct directories
   - Restart the servers after changing environment variables

4. **CORS Errors**:
   - The backend already includes CORS headers
   - If issues persist, check the CORS configuration in main.go

### Logs

- **Backend**: Logs will appear in the terminal where you started the backend
- **Frontend**: Logs will appear in the terminal where you started the frontend and in the browser console

## Stopping the Application

To stop the application:

1. **Manual Start**: Press `Ctrl+C` in each terminal
2. **Concurrently**: Press `Ctrl+C` in the terminal running concurrently
3. **PM2**: Run `pm2 stop all` or `pm2 stop ecosystem.config.js`

## Additional Commands

### Backend Testing
```bash
cd backend
go test ./...
```

### Frontend Testing
```bash
npm test
```

### Frontend Build
```bash
npm run build
```

### Frontend Preview (after build)
```bash
npm run preview
```

## Next Steps

1. Configure MongoDB for persistent storage
2. Set up your Google API key for AI features
3. Customize the application for your specific interview needs
4. Deploy to your preferred hosting platform