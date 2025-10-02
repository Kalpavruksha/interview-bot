// Script to list available Gemini models
async function listModels() {
  const API_KEY = import.meta.env?.VITE_GOOGLE_API_KEY || process.env.VITE_GOOGLE_API_KEY;
  
  if (!API_KEY) {
    console.log('No API key found');
    return;
  }
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error listing models:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('Available models:');
    data.models.forEach(model => {
      console.log(`- ${model.name}: ${model.displayName || model.name}`);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

listModels();