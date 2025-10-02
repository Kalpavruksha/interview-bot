import React, { useEffect, useState } from 'react';

const APIKeyTest = () => {
  const [apiKeyInfo, setApiKeyInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAPIKey = () => {
      try {
        const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
        const hasApiKey = !!apiKey;
        const apiKeyLength = apiKey ? apiKey.length : 0;
        const maskedKey = apiKey ? `${apiKey.substring(0, 5)}...${apiKey.substring(apiKeyLength - 5)}` : 'Not found';
        
        setApiKeyInfo({
          hasApiKey,
          apiKeyLength,
          maskedKey,
          envKeys: Object.keys(import.meta.env || {})
        });
      } catch (error) {
        console.error('Error checking API key:', error);
        setApiKeyInfo({
          error: error.message
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAPIKey();
  }, []);

  if (isLoading) {
    return <div>Loading API key information...</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">API Key Test</h2>
      {apiKeyInfo?.error ? (
        <div className="text-red-500">Error: {apiKeyInfo.error}</div>
      ) : (
        <div className="space-y-2">
          <div>
            <span className="font-semibold">API Key Found:</span> 
            <span className={apiKeyInfo.hasApiKey ? 'text-green-600' : 'text-red-600'}>
              {apiKeyInfo.hasApiKey ? ' Yes' : ' No'}
            </span>
          </div>
          {apiKeyInfo.hasApiKey && (
            <>
              <div>
                <span className="font-semibold">Key Length:</span> {apiKeyInfo.apiKeyLength}
              </div>
              <div>
                <span className="font-semibold">Masked Key:</span> {apiKeyInfo.maskedKey}
              </div>
            </>
          )}
          <div>
            <span className="font-semibold">Available Environment Variables:</span>
            <ul className="list-disc pl-5 mt-1">
              {apiKeyInfo.envKeys.map((key, index) => (
                <li key={index}>{key}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default APIKeyTest;