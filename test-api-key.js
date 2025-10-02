// Simple test to verify API key is working
console.log('Testing API key availability...');

// Check if we're in a browser environment
if (typeof window !== 'undefined') {
  // Browser environment
  const apiKey = import.meta.env?.VITE_GOOGLE_API_KEY;
  console.log('API Key (browser):', apiKey ? `${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 5)}` : 'Not found');
  console.log('All env vars (browser):', Object.keys(import.meta.env || {}));
} else {
  // Node.js environment - check if we have access to process.env
  console.log('API Key (Node.js):', process.env.VITE_GOOGLE_API_KEY ? `${process.env.VITE_GOOGLE_API_KEY.substring(0, 5)}...${process.env.VITE_GOOGLE_API_KEY.substring(process.env.VITE_GOOGLE_API_KEY.length - 5)}` : 'Not found');
}

console.log('Test complete');