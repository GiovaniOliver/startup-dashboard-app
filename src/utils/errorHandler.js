/**
 * Error Handler Utility
 * Centralized error handling and logging for the application
 * @module utils/errorHandler
 */

/**
 * Base application error class
 * @class AppError
 * @extends Error
 * @property {number} statusCode - HTTP status code
 * @property {boolean} isOperational - Whether the error is operational (expected) or programming error
 * @property {string} timestamp - ISO timestamp when error occurred
 *
 * @example
 * throw new AppError('Something went wrong', 500);
 */
export class AppError extends Error {
  /**
   * Create an application error
   * @param {string} message - Error message
   * @param {number} [statusCode=500] - HTTP status code
   * @param {boolean} [isOperational=true] - Whether error is operational
   */
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation error class for form and input validation failures
 * @class ValidationError
 * @extends AppError
 * @property {Object} errors - Field-specific error messages
 *
 * @example
 * throw new ValidationError('Validation failed', { email: 'Invalid email format' });
 */
export class ValidationError extends AppError {
  /**
   * Create a validation error
   * @param {string} message - Error message
   * @param {Object} [errors={}] - Field-specific error details
   */
  constructor(message, errors = {}) {
    super(message, 422);
    this.errors = errors;
    this.name = 'ValidationError';
  }
}

/**
 * Authentication error for login/auth failures
 * @class AuthenticationError
 * @extends AppError
 *
 * @example
 * throw new AuthenticationError('Invalid credentials');
 */
export class AuthenticationError extends AppError {
  /**
   * Create an authentication error
   * @param {string} [message='Authentication failed'] - Error message
   */
  constructor(message = 'Authentication failed') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

/**
 * Authorization error for permission/access denied
 * @class AuthorizationError
 * @extends AppError
 *
 * @example
 * throw new AuthorizationError('Admin access required');
 */
export class AuthorizationError extends AppError {
  /**
   * Create an authorization error
   * @param {string} [message='You are not authorized to perform this action'] - Error message
   */
  constructor(message = 'You are not authorized to perform this action') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

/**
 * Not found error for missing resources
 * @class NotFoundError
 * @extends AppError
 *
 * @example
 * throw new NotFoundError('User');  // "User not found"
 */
export class NotFoundError extends AppError {
  /**
   * Create a not found error
   * @param {string} [resource='Resource'] - Name of the resource that wasn't found
   */
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
    this.name = 'NotFoundError';
  }
}

/**
 * Network error for connection/request failures
 * @class NetworkError
 * @extends AppError
 *
 * @example
 * throw new NetworkError('Unable to reach server');
 */
export class NetworkError extends AppError {
  /**
   * Create a network error
   * @param {string} [message='Network request failed'] - Error message
   */
  constructor(message = 'Network request failed') {
    super(message, 0);
    this.name = 'NetworkError';
  }
}

/**
 * Log error with context and store for debugging
 * Logs to console in development, sends to error tracking service in production,
 * and stores last 10 errors in localStorage
 *
 * @function logError
 * @param {Error} error - The error to log
 * @param {Object} [context={}] - Additional context about the error
 * @returns {Object} The error log object
 *
 * @example
 * try {
 *   riskyOperation();
 * } catch (error) {
 *   logError(error, { userId: 123, action: 'save' });
 * }
 */
export const logError = (error, context = {}) => {
  const errorLog = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    context,
    userAgent: navigator.userAgent,
    url: window.location.href
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', errorLog);
  }

  // In production, send to error tracking service (e.g., Sentry, LogRocket)
  if (process.env.NODE_ENV === 'production') {
    // sendToErrorTrackingService(errorLog);
  }

  // Store in localStorage for debugging (keep last 10 errors)
  try {
    const errors = JSON.parse(localStorage.getItem('errorLog') || '[]');
    errors.unshift(errorLog);
    localStorage.setItem('errorLog', JSON.stringify(errors.slice(0, 10)));
  } catch (e) {
    // Fail silently if localStorage is not available
  }

  return errorLog;
};

/**
 * Convert API/HTTP errors to appropriate AppError subclasses
 * Maps HTTP status codes to specific error types
 *
 * @function handleApiError
 * @param {Error} error - The error from API call (typically Axios error)
 * @returns {AppError} Appropriate error type based on status code
 *
 * @example
 * try {
 *   await axios.get('/api/users');
 * } catch (error) {
 *   const appError = handleApiError(error);
 *   throw appError;
 * }
 */
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;

    switch (status) {
      case 400:
        return new ValidationError(data.message || 'Bad request', data.errors);
      case 401:
        return new AuthenticationError(data.message);
      case 403:
        return new AuthorizationError(data.message);
      case 404:
        return new NotFoundError(data.resource);
      case 422:
        return new ValidationError(data.message, data.errors);
      case 500:
      case 502:
      case 503:
        return new AppError('Server error. Please try again later.', status);
      default:
        return new AppError(data.message || 'An error occurred', status);
    }
  } else if (error.request) {
    // Request was made but no response received
    return new NetworkError('No response from server. Please check your connection.');
  } else {
    // Something else happened
    return new AppError(error.message || 'An unexpected error occurred');
  }
};

/**
 * Wrap async functions to automatically handle and log errors
 * Eliminates need for repetitive try-catch blocks
 *
 * @function asyncHandler
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Wrapped function with error handling
 *
 * @example
 * const fetchUser = asyncHandler(async (userId) => {
 *   const response = await api.getUser(userId);
 *   return response.data;
 * });
 *
 * // Errors are automatically caught and logged
 * const user = await fetchUser(123);
 */
export const asyncHandler = (fn) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      const handledError = error instanceof AppError ? error : handleApiError(error);
      logError(handledError, { function: fn.name, args });
      throw handledError;
    }
  };
};

/**
 * Convert technical error to user-friendly message
 * Provides helpful, non-technical messages for different error types
 *
 * @function getUserFriendlyMessage
 * @param {Error} error - The error to convert
 * @returns {string} User-friendly error message
 *
 * @example
 * catch (error) {
 *   const message = getUserFriendlyMessage(error);
 *   toast.error(message);  // "Please check your input and try again."
 * }
 */
export const getUserFriendlyMessage = (error) => {
  if (error instanceof ValidationError) {
    return 'Please check your input and try again.';
  } else if (error instanceof AuthenticationError) {
    return 'Please log in to continue.';
  } else if (error instanceof AuthorizationError) {
    return 'You do not have permission to perform this action.';
  } else if (error instanceof NotFoundError) {
    return 'The requested item could not be found.';
  } else if (error instanceof NetworkError) {
    return 'Unable to connect. Please check your internet connection.';
  } else {
    return 'Something went wrong. Please try again.';
  }
};

/**
 * Safely parse JSON string with fallback value
 * Returns default value instead of throwing on parse errors
 *
 * @function safeJsonParse
 * @param {string} jsonString - JSON string to parse
 * @param {*} [defaultValue=null] - Value to return if parsing fails
 * @returns {*} Parsed object or default value
 *
 * @example
 * const data = safeJsonParse(localStorage.getItem('user'), {});
 * // Returns {} if invalid JSON instead of throwing error
 */
export const safeJsonParse = (jsonString, defaultValue = null) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    logError(new AppError('JSON parse error'), { jsonString });
    return defaultValue;
  }
};

/**
 * Add timeout to any Promise to prevent hanging operations
 * Rejects with timeout error if operation takes too long
 *
 * @function withTimeout
 * @param {Promise} promise - Promise to add timeout to
 * @param {number} [timeoutMs=30000] - Timeout in milliseconds
 * @returns {Promise} Promise that resolves or rejects with timeout
 *
 * @example
 * const data = await withTimeout(
 *   fetch('/api/large-data'),
 *   5000  // 5 second timeout
 * );
 */
export const withTimeout = (promise, timeoutMs = 30000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new AppError('Operation timed out', 408)), timeoutMs)
    )
  ]);
};

/**
 * Retry failed operations with exponential backoff
 * Useful for transient network errors or rate limiting
 *
 * @function retryOperation
 * @param {Function} operation - Async function to retry
 * @param {number} [maxRetries=3] - Maximum number of retry attempts
 * @param {number} [delayMs=1000] - Initial delay between retries in milliseconds
 * @param {number} [backoff=2] - Backoff multiplier for each retry
 * @returns {Promise} Result of the operation
 * @throws {Error} Last error if all retries fail
 *
 * @example
 * const data = await retryOperation(
 *   () => fetch('/api/data').then(r => r.json()),
 *   3,     // Try 3 times
 *   1000,  // Start with 1 second delay
 *   2      // Double delay each time (1s, 2s, 4s)
 * );
 */
export const retryOperation = async (
  operation,
  maxRetries = 3,
  delayMs = 1000,
  backoff = 2
) => {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(backoff, i)));
      }
    }
  }

  throw lastError;
};

/**
 * Set up global error handlers for unhandled errors
 * Call this once during application initialization
 * Catches unhandled promise rejections and global errors
 *
 * @function setupGlobalErrorHandlers
 *
 * @example
 * // In index.js or App.js
 * setupGlobalErrorHandlers();
 */
export const setupGlobalErrorHandlers = () => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logError(new AppError('Unhandled promise rejection'), {
      reason: event.reason
    });
    event.preventDefault();
  });

  // Handle global errors
  window.addEventListener('error', (event) => {
    logError(new AppError(event.message), {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });
};

export default {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  NetworkError,
  logError,
  handleApiError,
  asyncHandler,
  getUserFriendlyMessage,
  safeJsonParse,
  withTimeout,
  retryOperation,
  setupGlobalErrorHandlers
};
