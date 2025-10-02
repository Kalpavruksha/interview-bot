@echo off
echo Setting up AI-Powered Interview Assistant...

echo.
echo IMPORTANT: Before running this setup, please:
echo 1. Create a .env file in the backend directory with your MongoDB URI
echo 2. Create a .env file in the root directory with your Google API Key
echo.

echo Installing Go dependencies...
cd backend
go mod tidy

echo Installing Node.js dependencies...
cd ../frontend
npm install

echo Setup complete!
echo.
echo To run the application:
echo 1. Start the backend: cd backend ^&^& go run main.go
echo 2. Start the frontend: cd frontend ^&^& npm run dev
echo.
echo Make sure your environment variables are set before starting the servers!