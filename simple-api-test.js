// Simple Node.js script to test API key access
console.log('Environment variables:');
console.log('VITE_GOOGLE_API_KEY:', process.env.VITE_GOOGLE_API_KEY ? `${process.env.VITE_GOOGLE_API_KEY.substring(0, 10)}...` : 'Not found');
console.log('API key length:', process.env.VITE_GOOGLE_API_KEY ? process.env.VITE_GOOGLE_API_KEY.length : 0);