
import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider } from './contexts/AppContext';
import App from './App';
import './index.css';
import './i18n/i18n'; // Initialize i18n

// Wait for DOM to be ready
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
