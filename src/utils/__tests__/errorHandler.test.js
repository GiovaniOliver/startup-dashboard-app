import {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  NetworkError,
  logError,
  handleApiError,
  getUserFriendlyMessage,
  safeJsonParse,
  withTimeout,
  retryOperation
} from '../errorHandler';

describe('Error Classes', () => {
  describe('AppError', () => {
    test('creates error with default values', () => {
      const error = new AppError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(500);
      expect(error.isOperational).toBe(true);
      expect(error.timestamp).toBeDefined();
    });

    test('creates error with custom status code', () => {
      const error = new AppError('Test error', 404);
      expect(error.statusCode).toBe(404);
    });
  });

  describe('ValidationError', () => {
    test('creates validation error', () => {
      const errors = { email: 'Invalid email' };
      const error = new ValidationError('Validation failed', errors);
      expect(error.message).toBe('Validation failed');
      expect(error.statusCode).toBe(422);
      expect(error.errors).toEqual(errors);
      expect(error.name).toBe('ValidationError');
    });
  });

  describe('AuthenticationError', () => {
    test('creates authentication error with default message', () => {
      const error = new AuthenticationError();
      expect(error.message).toBe('Authentication failed');
      expect(error.statusCode).toBe(401);
    });

    test('creates authentication error with custom message', () => {
      const error = new AuthenticationError('Invalid credentials');
      expect(error.message).toBe('Invalid credentials');
    });
  });

  describe('AuthorizationError', () => {
    test('creates authorization error', () => {
      const error = new AuthorizationError();
      expect(error.statusCode).toBe(403);
      expect(error.message).toContain('not authorized');
    });
  });

  describe('NotFoundError', () => {
    test('creates not found error with default resource', () => {
      const error = new NotFoundError();
      expect(error.statusCode).toBe(404);
      expect(error.message).toContain('Resource not found');
    });

    test('creates not found error with custom resource', () => {
      const error = new NotFoundError('User');
      expect(error.message).toBe('User not found');
    });
  });

  describe('NetworkError', () => {
    test('creates network error', () => {
      const error = new NetworkError();
      expect(error.statusCode).toBe(0);
      expect(error.message).toContain('Network');
    });
  });
});

describe('logError', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    localStorage.clear();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  test('logs error to console in development', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const error = new Error('Test error');
    logError(error);

    expect(consoleErrorSpy).toHaveBeenCalled();

    process.env.NODE_ENV = originalEnv;
  });

  test('stores error in localStorage', () => {
    const error = new Error('Test error');
    logError(error, { context: 'test' });

    const stored = JSON.parse(localStorage.getItem('errorLog'));
    expect(stored).toHaveLength(1);
    expect(stored[0].message).toBe('Test error');
    expect(stored[0].context).toEqual({ context: 'test' });
  });

  test('limits stored errors to 10', () => {
    for (let i = 0; i < 15; i++) {
      logError(new Error(`Error ${i}`));
    }

    const stored = JSON.parse(localStorage.getItem('errorLog'));
    expect(stored).toHaveLength(10);
  });

  test('includes timestamp and URL', () => {
    const error = new Error('Test error');
    const log = logError(error);

    expect(log.timestamp).toBeDefined();
    expect(log.url).toBe(window.location.href);
  });
});

describe('handleApiError', () => {
  test('handles 400 error', () => {
    const apiError = {
      response: {
        status: 400,
        data: { message: 'Bad request' }
      }
    };

    const error = handleApiError(apiError);
    expect(error).toBeInstanceOf(ValidationError);
  });

  test('handles 401 error', () => {
    const apiError = {
      response: {
        status: 401,
        data: { message: 'Unauthorized' }
      }
    };

    const error = handleApiError(apiError);
    expect(error).toBeInstanceOf(AuthenticationError);
  });

  test('handles 403 error', () => {
    const apiError = {
      response: {
        status: 403,
        data: { message: 'Forbidden' }
      }
    };

    const error = handleApiError(apiError);
    expect(error).toBeInstanceOf(AuthorizationError);
  });

  test('handles 404 error', () => {
    const apiError = {
      response: {
        status: 404,
        data: { resource: 'User' }
      }
    };

    const error = handleApiError(apiError);
    expect(error).toBeInstanceOf(NotFoundError);
  });

  test('handles network error', () => {
    const apiError = {
      request: {},
      message: 'Network error'
    };

    const error = handleApiError(apiError);
    expect(error).toBeInstanceOf(NetworkError);
  });

  test('handles unknown error', () => {
    const apiError = {
      message: 'Unknown error'
    };

    const error = handleApiError(apiError);
    expect(error).toBeInstanceOf(AppError);
  });
});

describe('getUserFriendlyMessage', () => {
  test('returns message for ValidationError', () => {
    const error = new ValidationError('Validation failed');
    const message = getUserFriendlyMessage(error);
    expect(message).toContain('check your input');
  });

  test('returns message for AuthenticationError', () => {
    const error = new AuthenticationError();
    const message = getUserFriendlyMessage(error);
    expect(message).toContain('log in');
  });

  test('returns message for AuthorizationError', () => {
    const error = new AuthorizationError();
    const message = getUserFriendlyMessage(error);
    expect(message).toContain('permission');
  });

  test('returns message for NotFoundError', () => {
    const error = new NotFoundError();
    const message = getUserFriendlyMessage(error);
    expect(message).toContain('not found');
  });

  test('returns message for NetworkError', () => {
    const error = new NetworkError();
    const message = getUserFriendlyMessage(error);
    expect(message).toContain('connection');
  });

  test('returns generic message for other errors', () => {
    const error = new Error('Generic error');
    const message = getUserFriendlyMessage(error);
    expect(message).toContain('Something went wrong');
  });
});

describe('safeJsonParse', () => {
  test('parses valid JSON', () => {
    const result = safeJsonParse('{"name": "John"}');
    expect(result).toEqual({ name: 'John' });
  });

  test('returns default value for invalid JSON', () => {
    const result = safeJsonParse('invalid json', { default: true });
    expect(result).toEqual({ default: true });
  });

  test('returns null by default for invalid JSON', () => {
    const result = safeJsonParse('invalid json');
    expect(result).toBeNull();
  });
});

describe('withTimeout', () => {
  jest.useFakeTimers();

  test('resolves promise before timeout', async () => {
    const promise = Promise.resolve('success');
    const result = await withTimeout(promise, 1000);
    expect(result).toBe('success');
  });

  test('rejects on timeout', async () => {
    const promise = new Promise(() => {}); // Never resolves
    const timeoutPromise = withTimeout(promise, 100);

    jest.advanceTimersByTime(100);

    await expect(timeoutPromise).rejects.toThrow('timed out');
  });

  afterEach(() => {
    jest.clearAllTimers();
  });
});

describe('retryOperation', () => {
  test('succeeds on first attempt', async () => {
    const operation = jest.fn().mockResolvedValue('success');
    const result = await retryOperation(operation, 3);

    expect(result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(1);
  });

  test('retries on failure', async () => {
    const operation = jest.fn()
      .mockRejectedValueOnce(new Error('Fail 1'))
      .mockRejectedValueOnce(new Error('Fail 2'))
      .mockResolvedValue('success');

    const result = await retryOperation(operation, 3, 10);

    expect(result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(3);
  });

  test('throws after max retries', async () => {
    const operation = jest.fn().mockRejectedValue(new Error('Always fails'));

    await expect(retryOperation(operation, 3, 10)).rejects.toThrow('Always fails');
    expect(operation).toHaveBeenCalledTimes(3);
  });
});
