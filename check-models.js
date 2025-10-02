const fs = require('fs');
const path = require('path');

// Get API key from .env file
const envPath = path.resolve(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.error('No .env file found. Please create one with your GOOGLE_API_KEY.');
  process.exit(1);
}

require('dotenv').config();
const apiKey = process.env.VITE_GOOGLE_API_KEY || process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.error('No API key found in .env file. Please add VITE_GOOGLE_API_KEY or GOOGLE_API_KEY.');
  process.exit(1);
}

async function listModels() {
  try {
    console.log('Fetching available models...');
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error fetching models:', data);
      return;
    }
    
    console.log('Available models:');
    data.models.forEach(model => {
      console.log(`- ${model.name}: ${model.displayName || 'No display name'}`);
      if (model.description) {
        console.log(`  Description: ${model.description}`);
      }
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listModels();