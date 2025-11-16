/**
 * Error Handler Utility
 * Centralized error handling and logging
 */

export class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message, errors = {}) {
    super(message, 422);
    this.errors = errors;
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'You are not authorized to perform this action') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
    this.name = 'NotFoundError';
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Network request failed') {
    super(message, 0);
    this.name = 'NetworkError';
  }
}

/**
 * Error logger
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
 * Handle API errors
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
 * Async error wrapper for try-catch
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
 * Get user-friendly error message
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
 * Safe JSON parse with error handling
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
 * Safe async operation with timeout
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
 * Retry failed operations
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
 * Global error handler
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
