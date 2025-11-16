import './index.css';

import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { DarkModeContextProvider } from './Context/darkModeContext';
import { AuthContextProvider } from './Context/AuthContext';
import { AppContextProvider } from './Context/AppContext';
import { DataContextProvider } from './Context/DataContext';
import ErrorBoundary from './Components/ErrorBoundary/ErrorBoundary';
import analytics from './utils/analytics';
import { reportWebVitals } from './utils/performanceMonitor';

// Initialize analytics in production
if (process.env.NODE_ENV === 'production') {
  analytics.init();
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthContextProvider>
        <DarkModeContextProvider>
          <AppContextProvider>
            <DataContextProvider>
              <App />
            </DataContextProvider>
          </AppContextProvider>
        </DarkModeContextProvider>
      </AuthContextProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

// Report web vitals for performance monitoring
reportWebVitals((metric) => {
  // Send to analytics endpoint
  if (process.env.NODE_ENV === 'production') {
    analytics.trackTiming(
      'Web Vitals',
      metric.name,
      Math.round(metric.value),
      metric.id
    );
  } else {
    console.log(metric);
  }
});


