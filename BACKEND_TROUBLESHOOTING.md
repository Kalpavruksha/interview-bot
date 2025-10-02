# Backend Troubleshooting Guide

This document provides solutions for common issues encountered when setting up and running the Go backend for the AI-Powered Interview Assistant.

## Common Go Dependency Issues

### Error: "missing go.sum entry for module"

**Problem**: 
```
main.go:9:2: missing go.sum entry for module providing package github.com/gin-gonic/gin
```

**Solution**:
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Run go mod tidy to download and organize dependencies:
   ```bash
   go mod tidy
   ```

3. If that doesn't work, manually add the dependencies:
   ```bash
   go get github.com/gin-gonic/gin
   go get github.com/joho/godotenv
   go get go.mongodb.org/mongo-driver/mongo
   go mod tidy
   ```

### Error: "go mod download: missing go.sum entry"

**Problem**: 
Missing checksum entries for modules in go.sum

**Solution**:
1. Clean the module cache:
   ```bash
   go clean -modcache
   ```

2. Re-download dependencies:
   ```bash
   go mod download
   ```

3. Update go.sum:
   ```bash
   go mod tidy
   ```

## Module Initialization Issues

### Error: "go: cannot find main module"

**Problem**: 
The go.mod file is missing or corrupted

**Solution**:
1. Initialize a new module:
   ```bash
   go mod init interview-bot-backend
   ```

2. Add required dependencies:
   ```bash
   go get github.com/gin-gonic/gin
   go get github.com/joho/godotenv
   go get go.mongodb.org/mongo-driver/mongo
   ```

3. Update go.sum:
   ```bash
   go mod tidy
   ```

## Go Installation Issues

### Error: "'go' is not recognized as an internal or external command"

**Problem**: 
Go is not installed or not in the system PATH

**Solution**:
1. Download and install Go from [https://golang.org/dl/](https://golang.org/dl/)
2. Ensure Go is added to your system PATH
3. Verify installation:
   ```bash
   go version
   ```

### Error: "go version go1.xx.x invalid version"

**Problem**: 
Go version is too old

**Solution**:
1. Update Go to version 1.21 or higher
2. Verify version:
   ```bash
   go version
   ```

## Build and Run Issues

### Error: "build command-line-arguments: cannot find module for path"

**Problem**: 
Dependencies not properly resolved

**Solution**:
1. Ensure you're in the backend directory
2. Run:
   ```bash
   go mod tidy
   ```

### Error: "package command-line-arguments is not a main package"

**Problem**: 
Trying to run a non-main package

**Solution**:
1. Ensure main.go has `package main` at the top
2. Ensure there's a `func main()` function

## MongoDB Connection Issues

### Error: "no reachable servers"

**Problem**: 
MongoDB is not running or connection string is incorrect

**Solution**:
1. Verify MongoDB is running:
   ```bash
   # For local MongoDB
   mongod
   ```

2. Check your connection string in `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017
   ```

3. For MongoDB Atlas, ensure your IP is whitelisted

### Error: "auth failed"

**Problem**: 
Incorrect MongoDB credentials

**Solution**:
1. Verify your MongoDB connection string:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net
   ```

2. Ensure your MongoDB user has proper permissions

## Environment Variable Issues

### Error: "environment variable not set"

**Problem**: 
Required environment variables are missing

**Solution**:
1. Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017
   GOOGLE_API_KEY=your_google_api_key_here
   PORT=8081
   ```

2. Load the environment variables in your main.go:
   ```go
   err := godotenv.Load()
   ```

## Network and Port Issues

### Error: "address already in use"

**Problem**: 
The port is already being used by another application

**Solution**:
1. Change the port in `.env`:
   ```env
   PORT=8082
   ```

2. Or kill the process using the port:
   ```bash
   # On Windows
   netstat -ano | findstr :8081
   taskkill /PID <PID> /F
   
   # On macOS/Linux
   lsof -i :8081
   kill -9 <PID>
   ```

## CORS Issues

### Error: "No 'Access-Control-Allow-Origin' header"

**Problem**: 
CORS headers not properly configured

**Solution**:
1. Verify CORS middleware in main.go:
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

## Testing Issues

### Error: "no Go files in directory"

**Problem**: 
Trying to run tests in a directory without test files

**Solution**:
1. Ensure test files exist with `_test.go` suffix
2. Run tests from the correct directory:
   ```bash
   go test ./...
   ```

## Performance Issues

### Slow Startup

**Problem**: 
Application takes too long to start

**Solution**:
1. Check MongoDB connection - ensure it's responsive
2. Verify internet connectivity for external APIs
3. Check for blocking operations in init functions

## Debugging Tips

### Enable Go Debugging

1. Add debug logging:
   ```go
   import "log"
   
   log.Println("Debug message")
   ```

2. Run with verbose output:
   ```bash
   go run -v main.go
   ```

### Check Go Environment

1. View Go environment:
   ```bash
   go env
   ```

2. Check GOPATH:
   ```bash
   go env GOPATH
   ```

### Verify Module Dependencies

1. List modules:
   ```bash
   go list -m all
   ```

2. Check why a module is needed:
   ```bash
   go mod why github.com/gin-gonic/gin
   ```

## Windows-Specific Issues

### Error: "The system cannot find the path specified"

**Problem**: 
Path issues in Windows command prompt

**Solution**:
1. Use forward slashes or escaped backslashes:
   ```bash
   cd "D:\interview bot\backend"
   ```

2. Or use the /d flag:
   ```bash
   cd /d "D:\interview bot\backend"
   ```

## macOS/Linux-Specific Issues

### Error: "Permission denied"

**Problem**: 
Insufficient permissions to execute files

**Solution**:
1. Make scripts executable:
   ```bash
   chmod +x setup.sh
   ```

2. Run with sudo if necessary:
   ```bash
   sudo go run main.go
   ```

## Docker Issues (if using Docker)

### Error: "Cannot connect to the Docker daemon"

**Problem**: 
Docker is not running

**Solution**:
1. Start Docker Desktop
2. Verify Docker is running:
   ```bash
   docker version
   ```

## Additional Resources

1. [Go Modules Reference](https://github.com/golang/go/wiki/Modules)
2. [Gin Framework Documentation](https://gin-gonic.com/docs/)
3. [MongoDB Go Driver Documentation](https://pkg.go.dev/go.mongodb.org/mongo-driver)
4. [Go Troubleshooting Guide](https://golang.org/doc/faq)