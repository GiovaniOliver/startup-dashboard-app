/**
 * Analytics Utility
 * Centralized analytics tracking for the application
 */

class Analytics {
  constructor() {
    this.initialized = false;
    this.trackingId = process.env.REACT_APP_GA_TRACKING_ID;
  }

  // Initialize analytics (Google Analytics 4 example)
  init() {
    if (this.initialized) return;

    if (this.trackingId && typeof window !== 'undefined') {
      // Load Google Analytics script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.trackingId}`;
      document.head.appendChild(script);

      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', this.trackingId, {
        send_page_view: false, // We'll manually track page views
      });

      this.initialized = true;
      console.log('Analytics initialized');
    } else if (process.env.NODE_ENV === 'development') {
      console.log('Analytics: Running in development mode (tracking disabled)');
    }
  }

  // Track page views
  trackPageView(path, title) {
    if (!this.initialized || process.env.NODE_ENV !== 'production') {
      console.log('Analytics: Page view -', path, title);
      return;
    }

    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: title,
      });
    }
  }

  // Track custom events
  trackEvent(category, action, label, value) {
    if (!this.initialized || process.env.NODE_ENV !== 'production') {
      console.log('Analytics: Event -', { category, action, label, value });
      return;
    }

    if (window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  }

  // Track user interactions
  trackClick(elementName, location) {
    this.trackEvent('User Interaction', 'click', `${elementName} - ${location}`);
  }

  // Track form submissions
  trackFormSubmit(formName) {
    this.trackEvent('Form', 'submit', formName);
  }

  // Track search queries
  trackSearch(searchTerm) {
    this.trackEvent('Search', 'query', searchTerm);
  }

  // Track errors
  trackError(errorMessage, errorInfo) {
    this.trackEvent('Error', 'exception', errorMessage);

    if (process.env.NODE_ENV === 'production') {
      // In production, you might want to send to error tracking service
      // Example: Sentry, LogRocket, etc.
      console.error('Error tracked:', errorMessage, errorInfo);
    }
  }

  // Track user timing (performance)
  trackTiming(category, variable, time, label) {
    if (!this.initialized || process.env.NODE_ENV !== 'production') {
      console.log('Analytics: Timing -', { category, variable, time, label });
      return;
    }

    if (window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: variable,
        value: time,
        event_category: category,
        event_label: label,
      });
    }
  }

  // Set user properties
  setUserProperties(properties) {
    if (!this.initialized || process.env.NODE_ENV !== 'production') {
      console.log('Analytics: User properties -', properties);
      return;
    }

    if (window.gtag) {
      window.gtag('set', 'user_properties', properties);
    }
  }

  // Track user login
  trackLogin(method) {
    this.trackEvent('Authentication', 'login', method);
  }

  // Track user signup
  trackSignup(method) {
    this.trackEvent('Authentication', 'signup', method);
  }

  // Track conversions
  trackConversion(conversionName, value) {
    this.trackEvent('Conversion', conversionName, null, value);
  }
}

// Create singleton instance
const analytics = new Analytics();

export default analytics;

// React hook for analytics
export const useAnalytics = () => {
  return {
    trackPageView: (path, title) => analytics.trackPageView(path, title),
    trackEvent: (category, action, label, value) =>
      analytics.trackEvent(category, action, label, value),
    trackClick: (elementName, location) => analytics.trackClick(elementName, location),
    trackFormSubmit: (formName) => analytics.trackFormSubmit(formName),
    trackSearch: (searchTerm) => analytics.trackSearch(searchTerm),
    trackError: (errorMessage, errorInfo) => analytics.trackError(errorMessage, errorInfo),
  };
};
