# Environment Setup Guide

## Overview

This document explains how to properly set up environment variables for the AI Interview Assistant application, with a focus on securely managing the Gemini API key.

## Gemini API Key Setup

### 1. Getting Your API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Setting Up Environment Variables

#### For Development

1. Open the `.env` file in the project root
2. Uncomment the `VITE_GOOGLE_API_KEY` line
3. Replace `your_actual_api_key_here` with your actual API key

```bash
# Example:
VITE_GOOGLE_API_KEY=AIzaSyCexampleKey1234567890abcdef
```

#### For Production

Set the environment variable in your deployment platform:

**Vercel/Netlify:**
```bash
VITE_GOOGLE_API_KEY=your_actual_api_key_here
```

**Docker:**
```dockerfile
ENV VITE_GOOGLE_API_KEY=your_actual_api_key_here
```

**Linux/macOS:**
```bash
export VITE_GOOGLE_API_KEY=your_actual_api_key_here
```

**Windows:**
```cmd
set VITE_GOOGLE_API_KEY=your_actual_api_key_here
```

## Security Best Practices

### ✅ Do:
- Use environment variables for API keys
- Keep .env files in .gitignore
- Rotate API keys periodically
- Use different keys for development and production
- Monitor API usage regularly

### ❌ Don't:
- Hardcode API keys in source code
- Commit API keys to version control
- Share API keys publicly
- Use the same key for all environments

## Fallback Behavior

When no API key is provided, the application gracefully degrades:

1. **Question Generation**: Uses predefined fallback questions
2. **Answer Scoring**: Returns default score of 50
3. **Candidate Summary**: Returns generic summary text

This ensures the application remains functional during development and testing.

## Environment Variables Reference

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `VITE_GOOGLE_API_KEY` | No | Gemini API key for AI features | None (uses fallback) |

## Testing Environment Setup

To verify your environment setup:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open the browser console and look for:
   - No warnings about missing API keys
   - Successful AI function calls in the network tab

3. Test AI features:
   - Upload a resume
   - Start an interview
   - Submit answers
   - Check for AI-generated scores and summaries

## Troubleshooting

### API Key Not Working
- Verify the key is correctly copied
- Check for extra spaces or characters
- Ensure the key is active in Google AI Studio
- Confirm you're using a Gemini API key (not other Google API key)

### Environment Variables Not Loading
- Restart the development server
- Check file naming (`.env`, not `env` or `environment`)
- Verify the variable is prefixed with `VITE_`
- Ensure no syntax errors in the .env file

### Fallback Responses Always Used
- Check browser console for environment variable warnings
- Verify the .env file is in the project root
- Confirm the variable name matches exactly: `VITE_GOOGLE_API_KEY`

## Backend Environment Variables

If you're also running the Go backend, create a `.env` file in the `backend` directory:

```bash
# backend/.env
GEMINI_API_KEY=your_actual_api_key_here
MONGODB_URI=your_mongodb_connection_string
PORT=8081
```

## Additional Resources

- [Google AI Studio Documentation](https://ai.google.dev/)
- [Vite Environment Variables Guide](https://vitejs.dev/guide/env-and-mode.html)
- [dotenv Documentation](https://github.com/motdotla/dotenv)