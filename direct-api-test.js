// Direct API test for Gemini
async function testGeminiAPI() {
  try {
    console.log('Testing Gemini API...');
    
    // Since we can't access Vite env vars in Node.js, we'll use a placeholder
    // In a real test, you would set the API key in your environment
    const API_KEY = process.env.GEMINI_API_KEY || 'YOUR_API_KEY_HERE';
    
    if (API_KEY === 'YOUR_API_KEY_HERE') {
      console.log('Please set GEMINI_API_KEY environment variable to test the API');
      console.log('Format: GEMINI_API_KEY=your_actual_api_key node direct-api-test.js');
      return;
    }
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Say "Hello, World!" in JSON format'
          }]
        }]
      })
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
    
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      console.log('Success! API is working correctly.');
      console.log('Response:', data.candidates[0].content.parts[0].text);
    } else {
      console.log('API call succeeded but response format is unexpected');
    }
  } catch (error) {
    console.error('Error testing Gemini API:', error);
  }
}

testGeminiAPI();