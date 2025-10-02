# Frontend-Backend Connection Troubleshooting Guide

This document provides solutions for common issues encountered when connecting the React frontend to the Go backend in the AI-Powered Interview Assistant.

## Common Connection Issues

### Issue: "Failed to load resource: net::ERR_CONNECTION_REFUSED"

**Problem**: 
The frontend cannot connect to the backend API.

**Solutions**:
1. **Verify Backend is Running**:
   ```bash
   # Check if backend is running
   curl http://localhost:8081/api/candidates
   
   # If not running, start it:
   cd backend
   go run main.go
   ```

2. **Check Backend Port**:
   - Ensure the backend is running on port 8081 (or the port specified in your environment)
   - Check the terminal output for the actual port being used

3. **Verify API URLs in Frontend**:
   - Check [src/utils/api.js](file:///D:/interview%20bot/src/utils/api.js) to ensure the `API_BASE_URL` is correct:
     ```javascript
     const API_BASE_URL = 'http://localhost:8081/api'
     ```

4. **Check CORS Configuration**:
   - Ensure the backend has proper CORS headers (already configured in main.go):
     ```go
     c.Header("Access-Control-Allow-Origin", "*")
     ```

### Issue: "No 'Access-Control-Allow-Origin' header present"

**Problem**: 
CORS policy blocking requests from frontend to backend.

**Solutions**:
1. **Verify CORS Middleware**:
   - Check that the CORS middleware is properly configured in main.go:
     ```go
     router.Use(func(c *gin.Context) {
         c.Header("Access-Control-Allow-Origin", "*")
         c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
         c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization")
         if c.Request.Method == "OPTIONS" {
             c.AbortWithStatus(204)
             return
         }
         c.Next()
     })
     ```

2. **Restart Both Servers**:
   - Stop both frontend and backend servers
   - Start backend first, then frontend

### Issue: "TypeError: Failed to fetch" or "Network Error"

**Problem**: 
Generic network error when trying to connect to backend.

**Solutions**:
1. **Check Network Connectivity**:
   ```bash
   # Test if backend is accessible
   curl http://localhost:8081/api/candidates
   ```

2. **Verify Firewall Settings**:
   - Ensure your firewall is not blocking connections to localhost:8081

3. **Check for Port Conflicts**:
   ```bash
   # Check if port 8081 is in use
   netstat -ano | findstr :8081
   
   # If in use, kill the process or change the port
   taskkill /PID <process_id> /F
   ```

4. **Update Port if Necessary**:
   - Change the port in backend/main.go:
     ```go
     port := os.Getenv("PORT")
     if port == "" {
         port = "8082" // Change to a different port
     }
     ```
   - Update the frontend API URL in src/utils/api.js:
     ```javascript
     const API_BASE_URL = 'http://localhost:8082/api'
     ```

## Resume Upload Issues

### Issue: "No resume file uploaded"

**Problem**: 
Backend receiving requests without file data.

**Solutions**:
1. **Verify File Upload Implementation**:
   - Check that the frontend is sending the file correctly:
     ```javascript
     const formData = new FormData()
     formData.append('resume', file)
     ```

2. **Check Backend File Handling**:
   - Ensure the backend endpoint expects a file with the correct field name:
     ```go
     file, err := c.FormFile("resume")
     ```

3. **Test with curl**:
   ```bash
   curl -X POST -F "resume=@path/to/resume.pdf" http://localhost:8081/api/upload-resume
   ```

## Candidate Dashboard Issues

### Issue: "No candidates found" or empty dashboard

**Problem**: 
Frontend not receiving candidate data from backend.

**Solutions**:
1. **Verify API Endpoint**:
   ```bash
   # Test the candidates endpoint
   curl http://localhost:8081/api/candidates
   ```

2. **Check Frontend API Integration**:
   - Ensure InterviewerPage.jsx is calling the backend API:
     ```javascript
     useEffect(() => {
       const loadCandidates = async () => {
         try {
           const fetchedCandidates = await getCandidates()
           dispatch({ type: 'SET_ALL_CANDIDATES', payload: fetchedCandidates })
         } catch (error) {
           // Handle error appropriately
         }
       }
       loadCandidates()
     }, [dispatch])
     ```

3. **Verify Redux Store Updates**:
   - Check that the candidates are being stored in the Redux store correctly

## Debugging Tools

### Browser Developer Tools

1. **Network Tab**:
   - Check for failed API requests
   - Verify request/response headers
   - Check request payloads

2. **Console Tab**:
   - Look for JavaScript errors
   - Check for CORS-related errors

### Backend Logs

1. **Gin Framework Logs**:
   - Check for incoming requests
   - Look for error messages
   - Verify routes are being hit

### Testing API Endpoints

1. **Using curl**:
   ```bash
   # Test GET endpoint
   curl http://localhost:8081/api/candidates
   
   # Test POST endpoint
   curl -X POST -F "resume=@path/to/file.pdf" http://localhost:8081/api/upload-resume
   ```

2. **Using Postman**:
   - Import the API endpoints
   - Test each endpoint individually
   - Check request/response formats

## Environment Variables

### Backend Environment Variables

1. **PORT**:
   ```env
   PORT=8081
   ```

2. **MONGODB_URI** (if using MongoDB):
   ```env
   MONGODB_URI=mongodb://localhost:27017
   ```

### Frontend Environment Variables

1. **API Base URL**:
   - Currently hardcoded in src/utils/api.js
   - Consider using environment variables for different environments

## Common Fixes

### 1. Restart Everything

```bash
# Stop all servers
# Kill any processes running on ports 8081 and 3000

# Start backend
cd backend
go run main.go

# Start frontend (in new terminal)
npm run dev
```

### 2. Clear Browser Cache

- Hard refresh the browser (Ctrl+F5)
- Clear localStorage and sessionStorage
- Disable cache in developer tools

### 3. Reinstall Dependencies

```bash
# Backend
cd backend
go mod tidy

# Frontend
rm -rf node_modules
npm install
```

### 4. Check File Paths

- Ensure all file paths are correct
- Verify the frontend can access the backend static files
- Check that the build output directory is correct

## Windows-Specific Issues

### Issue: "The system cannot find the path specified"

**Solution**:
- Use forward slashes or properly escaped backslashes in paths
- Use the /d flag with cd command:
  ```bash
  cd /d "D:\interview bot\backend"
  ```

### Issue: "Terminate batch job (Y/N)?"

**Solution**:
- This is normal when stopping processes with Ctrl+C
- Press 'Y' to confirm termination

## macOS/Linux-Specific Issues

### Issue: "Permission denied"

**Solution**:
- Make scripts executable:
  ```bash
  chmod +x script.sh
  ```
- Run with sudo if necessary (not recommended for development)

## Docker Issues (if using Docker)

### Issue: "Cannot connect to the Docker daemon"

**Solution**:
- Start Docker Desktop
- Verify Docker is running:
  ```bash
  docker version
  ```

## Performance Issues

### Slow API Responses

1. **Check Backend Processing**:
   - Look for blocking operations
   - Optimize database queries
   - Add caching where appropriate

2. **Check Network Latency**:
   - Ensure both frontend and backend are running locally
   - Check for network issues

## Additional Resources

1. [Gin Framework Documentation](https://gin-gonic.com/docs/)
2. [React Documentation](https://reactjs.org/docs/getting-started.html)
3. [Fetch API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
4. [CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)