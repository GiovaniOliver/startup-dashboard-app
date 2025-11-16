/**
 * Logger Utility
 * Provides environment-aware logging
 * Prevents sensitive data exposure in production
 */

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Sanitize log data to remove sensitive information
 * @param {*} data - Data to sanitize
 * @returns {*} - Sanitized data
 */
const sanitizeLogData = (data) => {
  if (!isProduction) {
    return data; // Don't sanitize in development
  }

  if (typeof data !== 'object' || data === null) {
    return data;
  }

  const sensitiveKeys = [
    'password',
    'token',
    'secret',
    'apiKey',
    'api_key',
    'privateKey',
    'private_key',
    'accessToken',
    'access_token',
    'refreshToken',
    'refresh_token',
    'creditCard',
    'credit_card',
    'ssn',
    'social_security'
  ];

  const sanitized = Array.isArray(data) ? [...data] : { ...data };

  Object.keys(sanitized).forEach(key => {
    const lowerKey = key.toLowerCase();

    if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeLogData(sanitized[key]);
    }
  });

  return sanitized;
};

/**
 * Format log message with timestamp and context
 * @param {string} level - Log level
 * @param {Array} args - Arguments to log
 * @returns {Array} - Formatted arguments
 */
const formatLog = (level, args) => {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  return [prefix, ...args.map(sanitizeLogData)];
};

/**
 * Logger object with environment-aware methods
 */
export const logger = {
  /**
   * Log informational message
   * Only logs in development
   */
  log: (...args) => {
    if (isDevelopment) {
      console.log(...formatLog('log', args));
    }
  },

  /**
   * Log informational message
   * Only logs in development
   */
  info: (...args) => {
    if (isDevelopment) {
      console.info(...formatLog('info', args));
    }
  },

  /**
   * Log debug message
   * Only logs in development
   */
  debug: (...args) => {
    if (isDevelopment) {
      console.debug(...formatLog('debug', args));
    }
  },

  /**
   * Log warning message
   * Logs in all environments
   */
  warn: (...args) => {
    console.warn(...formatLog('warn', args));
  },

  /**
   * Log error message
   * Always logs (with sanitization in production)
   */
  error: (...args) => {
    console.error(...formatLog('error', args));
  },

  /**
   * Group log messages
   * Only in development
   */
  group: (label) => {
    if (isDevelopment) {
      console.group(label);
    }
  },

  /**
   * End group
   * Only in development
   */
  groupEnd: () => {
    if (isDevelopment) {
      console.groupEnd();
    }
  },

  /**
   * Log table
   * Only in development
   */
  table: (data) => {
    if (isDevelopment) {
      console.table(data);
    }
  },

  /**
   * Time operation
   * Only in development
   */
  time: (label) => {
    if (isDevelopment) {
      console.time(label);
    }
  },

  /**
   * End time
   * Only in development
   */
  timeEnd: (label) => {
    if (isDevelopment) {
      console.timeEnd(label);
    }
  },

  /**
   * Assert condition
   * Logs in all environments
   */
  assert: (condition, ...args) => {
    if (!condition) {
      console.assert(condition, ...formatLog('assert', args));
    }
  },

  /**
   * Trace
   * Only in development
   */
  trace: (...args) => {
    if (isDevelopment) {
      console.trace(...formatLog('trace', args));
    }
  }
};

/**
 * Performance logger
 */
export const perfLogger = {
  /**
   * Start performance measurement
   * @param {string} label - Label for measurement
   */
  start: (label) => {
    if (isDevelopment) {
      performance.mark(`${label}-start`);
    }
  },

  /**
   * End performance measurement
   * @param {string} label - Label for measurement
   */
  end: (label) => {
    if (isDevelopment) {
      performance.mark(`${label}-end`);
      performance.measure(label, `${label}-start`, `${label}-end`);

      const measure = performance.getEntriesByName(label)[0];
      logger.log(`Performance [${label}]: ${measure.duration.toFixed(2)}ms`);

      // Cleanup
      performance.clearMarks(`${label}-start`);
      performance.clearMarks(`${label}-end`);
      performance.clearMeasures(label);
    }
  }
};

/**
 * API logger - for logging API calls
 */
export const apiLogger = {
  /**
   * Log API request
   * @param {string} method - HTTP method
   * @param {string} url - Request URL
   * @param {*} data - Request data
   */
  request: (method, url, data = null) => {
    if (isDevelopment) {
      logger.group(`API Request: ${method} ${url}`);
      logger.log('URL:', url);
      logger.log('Method:', method);
      if (data) {
        logger.log('Data:', data);
      }
      logger.groupEnd();
    }
  },

  /**
   * Log API response
   * @param {string} method - HTTP method
   * @param {string} url - Request URL
   * @param {number} status - Response status
   * @param {*} data - Response data
   */
  response: (method, url, status, data = null) => {
    if (isDevelopment) {
      logger.group(`API Response: ${method} ${url} - ${status}`);
      logger.log('URL:', url);
      logger.log('Status:', status);
      if (data) {
        logger.log('Data:', data);
      }
      logger.groupEnd();
    }
  },

  /**
   * Log API error
   * @param {string} method - HTTP method
   * @param {string} url - Request URL
   * @param {Error} error - Error object
   */
  error: (method, url, error) => {
    logger.group(`API Error: ${method} ${url}`);
    logger.error('URL:', url);
    logger.error('Error:', error.message);
    if (error.response) {
      logger.error('Status:', error.response.status);
      logger.error('Data:', error.response.data);
    }
    logger.groupEnd();
  }
};

/**
 * Disable all console output
 * Use this in production if you want to completely disable console
 */
export const disableConsole = () => {
  if (isProduction) {
    console.log = () => {};
    console.info = () => {};
    console.debug = () => {};
    console.warn = () => {};
    // Keep console.error for critical issues
  }
};

/**
 * Create a custom logger with prefix
 * @param {string} prefix - Prefix for all log messages
 * @returns {Object} - Logger with prefix
 */
export const createLogger = (prefix) => {
  return {
    log: (...args) => logger.log(`[${prefix}]`, ...args),
    info: (...args) => logger.info(`[${prefix}]`, ...args),
    debug: (...args) => logger.debug(`[${prefix}]`, ...args),
    warn: (...args) => logger.warn(`[${prefix}]`, ...args),
    error: (...args) => logger.error(`[${prefix}]`, ...args),
  };
};

export default logger;
