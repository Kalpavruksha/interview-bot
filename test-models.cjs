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

async function testModel(modelName) {
  try {
    console.log(`Testing model: ${modelName}`);
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: "Say hello world"
          }]
        }]
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error(`Error with ${modelName}:`, data);
      return false;
    }
    
    console.log(`Success with ${modelName}:`, data.candidates[0].content.parts[0].text);
    return true;
  } catch (error) {
    console.error(`Error testing ${modelName}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('Testing available models...');
  
  // Test the models we want to use
  const modelsToTest = [
    'gemini-2.0-flash',
    'gemini-2.0-flash-exp'
  ];
  
  for (const model of modelsToTest) {
    await testModel(model);
  }
}

main();