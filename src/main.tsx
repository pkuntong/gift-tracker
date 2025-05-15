import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Import CSS file with proper extension
import './style.css';
// Removed environment validation import

// Render the app without environment validation
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);