// Simple script to verify API key is working
console.log('Checking API key...');

// Check if we're in a browser environment
if (typeof window !== 'undefined') {
  const apiKey = import.meta.env?.VITE_GOOGLE_API_KEY;
  console.log('API Key:', apiKey ? `${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 5)}` : 'Not found');
  console.log('All env vars:', Object.keys(import.meta.env || {}));
} else {
  console.log('This script should be run in a browser environment');
}