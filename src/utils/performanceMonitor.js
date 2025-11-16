/**
 * Performance Monitoring Utility
 * Tracks Core Web Vitals and custom performance metrics
 */

// Track Core Web Vitals
export const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

// Custom performance metrics
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.marks = {};
  }

  // Mark the start of a performance measurement
  markStart(label) {
    this.marks[label] = performance.now();
  }

  // Mark the end and calculate duration
  markEnd(label) {
    if (!this.marks[label]) {
      console.warn(`No start mark found for: ${label}`);
      return;
    }

    const duration = performance.now() - this.marks[label];
    this.metrics[label] = duration;

    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance [${label}]: ${duration.toFixed(2)}ms`);
    }

    delete this.marks[label];
    return duration;
  }

  // Get all metrics
  getMetrics() {
    return { ...this.metrics };
  }

  // Clear all metrics
  clearMetrics() {
    this.metrics = {};
    this.marks = {};
  }

  // Track component render time
  trackComponentRender(componentName, renderFn) {
    this.markStart(`${componentName}_render`);
    const result = renderFn();
    this.markEnd(`${componentName}_render`);
    return result;
  }

  // Track API call performance
  async trackAPICall(apiName, apiCall) {
    this.markStart(`api_${apiName}`);
    try {
      const result = await apiCall();
      this.markEnd(`api_${apiName}`);
      return result;
    } catch (error) {
      this.markEnd(`api_${apiName}`);
      throw error;
    }
  }

  // Track user interactions
  trackInteraction(interactionName) {
    const timestamp = Date.now();
    if (process.env.NODE_ENV === 'development') {
      console.log(`Interaction [${interactionName}] at ${timestamp}`);
    }

    // Send to analytics service (placeholder)
    this.sendToAnalytics({
      type: 'interaction',
      name: interactionName,
      timestamp,
    });
  }

  // Send metrics to analytics service (placeholder)
  sendToAnalytics(data) {
    // In production, this would send to your analytics service
    // Example: Google Analytics, Mixpanel, Amplitude, etc.
    if (process.env.NODE_ENV === 'production' && window.gtag) {
      window.gtag('event', data.type, {
        event_category: 'Performance',
        event_label: data.name,
        value: data.duration || data.timestamp,
      });
    }
  }

  // Monitor memory usage (if available)
  logMemoryUsage() {
    if (performance.memory) {
      const memoryUsage = {
        usedJSHeapSize: (performance.memory.usedJSHeapSize / 1048576).toFixed(2),
        totalJSHeapSize: (performance.memory.totalJSHeapSize / 1048576).toFixed(2),
        jsHeapSizeLimit: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2),
      };
      console.log('Memory Usage (MB):', memoryUsage);
      return memoryUsage;
    }
    return null;
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

export default performanceMonitor;

// React hook for performance monitoring
export const usePerformanceMonitor = () => {
  return {
    markStart: (label) => performanceMonitor.markStart(label),
    markEnd: (label) => performanceMonitor.markEnd(label),
    trackInteraction: (name) => performanceMonitor.trackInteraction(name),
    getMetrics: () => performanceMonitor.getMetrics(),
  };
};
