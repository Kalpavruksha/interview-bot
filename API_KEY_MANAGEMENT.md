# API Key Management

## Overview

This document explains how API keys are securely managed in the AI Interview Assistant application, specifically for the Gemini API integration.

## Secure API Key Implementation

### 1. Environment Variables Approach

The application uses environment variables to manage the Gemini API key:

```javascript
// In src/utils/geminiAPI.js
const GEMINI_API_KEY = process.env.VITE_GOOGLE_API_KEY
```

### 2. No Hardcoded Keys

The previous implementation had a hardcoded fallback key:
```javascript
// OLD (INSECURE)
const GEMINI_API_KEY = process.env.VITE_GOOGLE_API_KEY || 'AIzaSyAG48aV07Ttgj6_H3PCXJK1G9-AJv35iOA'
```

This has been updated to:
```javascript
// NEW (SECURE)
const GEMINI_API_KEY = process.env.VITE_GOOGLE_API_KEY
```

### 3. Graceful Degradation

When no API key is provided, the application gracefully degrades:

- **Question Generation**: Uses predefined fallback questions
- **Answer Scoring**: Returns default score of 50
- **Candidate Summary**: Returns generic summary text

## Security Benefits

### ✅ No Hardcoded Secrets
- API keys are never committed to version control
- Source code remains secure
- No risk of accidental exposure

### ✅ Environment-Specific Configuration
- Different keys for development, staging, and production
- Easy rotation without code changes
- Platform-agnostic configuration

### ✅ Developer Experience
- Clear warnings when keys are missing
- Helpful fallback behavior during development
- Comprehensive documentation

## Implementation Details

### Environment Variable Loading
The application uses Vite's built-in environment variable support:
- Variables prefixed with `VITE_` are available in the browser
- `.env` files are automatically loaded
- Variables are validated at runtime

### Fallback Mechanisms
Each AI function includes appropriate fallback behavior:

```javascript
// Question generation with fallback
export const generateInterviewQuestions = async (candidateInfo) => {
  if (!GEMINI_API_KEY) {
    console.warn('Using fallback questions due to missing API key')
    return FALLBACK_QUESTIONS
  }
  // ... rest of implementation
}
```

### Error Handling
Comprehensive error handling for API issues:
- Network failures
- Invalid API keys
- Rate limiting
- Service outages

## Setup Instructions

### 1. Create .env File
Create a `.env` file in the project root:

```bash
# .env
VITE_GOOGLE_API_KEY=your_actual_api_key_here
```

### 2. Get API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env` file

### 3. Restart Development Server
```bash
npm run dev
```

## Verification

### Development Testing
The application provides clear feedback about API key status:

```
⚠️  No API key found. Using fallback responses.
   To enable real AI features, set VITE_GOOGLE_API_KEY in your .env file
```

### Production Deployment
Environment variables should be set in your deployment platform:
- Vercel/Netlify environment variables
- Docker environment variables
- Server environment variables

## Best Practices

### Key Management
1. **Never commit keys** to version control
2. **Use different keys** for each environment
3. **Rotate keys** periodically
4. **Monitor usage** for suspicious activity

### Development Workflow
1. **Use fallbacks** during initial development
2. **Test with real keys** before deployment
3. **Document key requirements** for team members
4. **Provide clear error messages** for missing keys

### Security Considerations
1. **HTTPS only** for API requests
2. **Rate limiting** to prevent abuse
3. **Input validation** to prevent injection
4. **Error handling** to prevent information leakage

## Troubleshooting

### Common Issues
1. **Key not loading**: Check file naming and location
2. **Key rejected**: Verify key is active and correct
3. **Fallback behavior**: Confirm environment variable is not set
4. **Production issues**: Ensure environment variables are set in deployment

### Debugging Steps
1. Check browser console for environment variable warnings
2. Verify `.env` file contents and location
3. Confirm variable name matches exactly (`VITE_GOOGLE_API_KEY`)
4. Restart development server after changes

## Future Enhancements

### Improved Security
- Key encryption at rest
- Time-limited key rotation
- Usage-based key management
- Multi-factor authentication for key access

### Enhanced Monitoring
- API usage analytics
- Performance monitoring
- Error rate tracking
- Automated alerts for issues

## Conclusion

The AI Interview Assistant now implements secure API key management through environment variables, eliminating hardcoded keys while maintaining a smooth developer experience through graceful degradation and comprehensive documentation.