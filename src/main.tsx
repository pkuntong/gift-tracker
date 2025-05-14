import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Import CSS using import statement (Vite will handle this properly)
import './index.css';
import { validateEnv } from './utils/env';

// Validate environment variables before rendering the app
try {
  validateEnv();
  
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  // Display an error message if environment variables are missing
  console.error('Application failed to start:', error);
  
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="font-family: system-ui, -apple-system, sans-serif; padding: 2rem; max-width: 500px; margin: 0 auto;">
        <h1 style="color: #e53e3e;">Environment Error</h1>
        <p>The application could not start due to missing environment variables.</p>
        <pre style="background: #f7fafc; padding: 1rem; border-radius: 0.25rem; overflow-x: auto;">${error instanceof Error ? error.message : String(error)}</pre>
        <p>Please check your .env file and make sure all required variables are defined.</p>
      </div>
    `;
  }
} 