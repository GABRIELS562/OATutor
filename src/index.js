import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { initProductionMode } from './util/productionUtils';

// Initialize production utilities (console management, error tracking, health checks)
initProductionMode();

// Note: LocalizationProvider is now in App.js with proper userId
// Do NOT wrap App here to avoid duplicate providers
ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// Enable PWA for offline support - critical for SA students with intermittent connectivity
// This allows the app to work offline and load faster on subsequent visits
serviceWorker.register({
  onUpdate: (registration) => {
    // New version available - notify user
    if (process.env.NODE_ENV !== 'production') {
      console.log('New version available! Close all tabs to update.');
    }
    if (window.confirm('New version available! Reload to update?')) {
      registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  },
  onSuccess: () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Angelo Tutoring is now available offline!');
    }
  },
});
