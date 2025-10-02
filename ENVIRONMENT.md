# Environment Configuration

This document explains how to configure environment variables for the AI-Powered Interview Assistant.

## Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# MongoDB connection string (optional)
# If not provided, the application will use in-memory storage
MONGODB_URI=mongodb://localhost:27017

# Google API Key for AI features (optional but recommended)
# If not provided, the application will use a default key
GOOGLE_API_KEY=your_google_api_key_here

# Port for the backend server (optional, default is 8081)
PORT=8081
```

## Frontend Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Google API Key for AI features (required for AI functionality)
# This should be the same key as used in the backend
VITE_GOOGLE_API_KEY=your_google_api_key_here
```

## Security Best Practices

1. **Never commit .env files to version control** - Add `.env` to your `.gitignore` file
2. **Use different keys for development and production** - Create separate keys for each environment
3. **Restrict API key permissions** - Configure your Google API key to only allow access to the Gemini API
4. **Regularly rotate keys** - Change your API keys periodically for security

## Obtaining a Google API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Generative Language API
4. Go to "APIs & Services" > "Credentials"
5. Click "Create Credentials" > "API Key"
6. Copy the generated key and add it to your `.env` files

## Environment-Specific Configuration

### Development

For development, you can use the same API key in both frontend and backend `.env` files.

### Production

For production, you should:

1. Use a production-specific API key
2. Restrict the API key to only allow requests from your domain
3. Set up proper quotas and billing alerts
4. Use environment variables provided by your hosting platform instead of `.env` files

## Troubleshooting

### Common Issues

1. **API Key Not Working**: 
   - Verify the key is correct and doesn't have extra spaces
   - Check that the Generative Language API is enabled
   - Ensure the key has the necessary permissions

2. **Environment Variables Not Loading**:
   - Verify the `.env` files are in the correct directories
   - Restart the development servers after changing environment variables
   - Check for syntax errors in the `.env` files

3. **MongoDB Connection Issues**:
   - Verify the connection string is correct
   - Check that MongoDB is running and accessible
   - Ensure the user has the correct permissions

### Debugging Environment Variables

To verify that environment variables are being loaded correctly:

1. **Backend**: Add logging to see if variables are loaded:
   ```go
   log.Printf("MongoDB URI: %s", os.Getenv("MONGODB_URI"))
   log.Printf("Google API Key: %s", os.Getenv("GOOGLE_API_KEY"))
   ```

2. **Frontend**: Check in the browser console:
   ```javascript
   console.log('Google API Key:', import.meta.env.VITE_GOOGLE_API_KEY)
   ```

## Example Configuration

### Backend .env
```env
MONGODB_URI=mongodb://localhost:27017/interviewdb
GOOGLE_API_KEY=AIzaSyAbC123DefGhi456JKlMno789PqrStuVwX
PORT=8081
```

### Frontend .env
```env
VITE_GOOGLE_API_KEY=AIzaSyAbC123DefGhi456JKlMno789PqrStuVwX
```

## Additional Resources

- [Google Cloud API Keys Documentation](https://cloud.google.com/docs/authentication/api-keys)
- [MongoDB Connection String Documentation](https://docs.mongodb.com/manual/reference/connection-string/)
- [Vite Environment Variables Documentation](https://vitejs.dev/guide/env-and-mode.html)