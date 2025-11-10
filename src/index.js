import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { initGoogleAnalytics } from './analytics';

// Initialize Google Analytics (GA4) if an ID is provided
const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID || '';
if (typeof window !== 'undefined') {
  initGoogleAnalytics(GA_MEASUREMENT_ID);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 