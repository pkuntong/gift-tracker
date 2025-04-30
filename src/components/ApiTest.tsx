import React, { useState } from 'react';
import { authService, updateApiBaseUrl } from '../services/api';

export const ApiTest: React.FC = () => {
  const [email, setEmail] = useState('');
  const [customApiUrl, setCustomApiUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const testConnection = async () => {
    setStatus('loading');
    setMessage('Testing API connection...');
    setErrorDetails(null);
    
    try {
      // Test the API by attempting to sign up with a test email
      await authService.signup({ email });
      setStatus('success');
      setMessage('API connection successful! Check your email for verification.');
    } catch (error: any) {
      setStatus('error');
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setMessage(`Error ${error.response.status}: ${error.response.data?.message || 'Unknown error'}`);
        setErrorDetails(JSON.stringify(error.response.data, null, 2));
      } else if (error.request) {
        // The request was made but no response was received
        setMessage('No response received from the API server.');
        setErrorDetails(
          'This could mean:\n' +
          '1. The API server is not running\n' +
          '2. The API URL is incorrect\n' +
          '3. There might be a CORS issue\n\n' +
          'Current API URL: ' + (customApiUrl || import.meta.env.VITE_API_URL || 'Not set')
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        setMessage(`Error: ${error.message}`);
      }
    }
  };

  const updateApiUrl = () => {
    if (customApiUrl) {
      // Update the API URL using the function from the API service
      updateApiBaseUrl(customApiUrl);
      setMessage('API URL updated. Try testing the connection again.');
      setStatus('idle');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">API Connection Test</h2>
      
      <div className="mb-4">
        <label htmlFor="apiUrl" className="block text-sm font-medium text-gray-700 mb-1">
          API URL (optional)
        </label>
        <div className="flex">
          <input
            type="text"
            id="apiUrl"
            value={customApiUrl}
            onChange={(e) => setCustomApiUrl(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="http://localhost:8000"
          />
          <button
            onClick={updateApiUrl}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            Update
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Test Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Enter test email"
        />
      </div>

      <button
        onClick={testConnection}
        disabled={status === 'loading' || !email}
        className={`w-full py-2 px-4 rounded-md text-white font-medium ${
          status === 'loading'
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-primary-600 hover:bg-primary-700'
        }`}
      >
        {status === 'loading' ? 'Testing...' : 'Test API Connection'}
      </button>

      {message && (
        <div
          className={`mt-4 p-3 rounded-md ${
            status === 'success'
              ? 'bg-green-100 text-green-800'
              : status === 'error'
              ? 'bg-red-100 text-red-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {message}
        </div>
      )}

      {errorDetails && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Error Details:</h3>
          <pre className="text-xs text-gray-600 whitespace-pre-wrap">{errorDetails}</pre>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p>Current API URL: {customApiUrl || import.meta.env.VITE_API_URL || 'Not set'}</p>
        <p className="mt-1">
          Status: <span className="font-medium">{status}</span>
        </p>
      </div>
    </div>
  );
}; 