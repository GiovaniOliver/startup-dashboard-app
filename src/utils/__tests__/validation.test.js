import {
  validateEmail,
  validatePhone,
  validatePassword,
  validatePasswordMatch,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateNumber,
  validateRange,
  validateCurrency,
  validateDate,
  validateFutureDate,
  validatePastDate,
  validateUrl,
  validateUsername,
  validateFile,
  validateRegex,
  validateForm
} from '../validation';

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    test('validates correct email', () => {
      const result = validateEmail('test@example.com');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('rejects invalid email', () => {
      const result = validateEmail('invalid-email');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    test('rejects empty email', () => {
      const result = validateEmail('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Email is required');
    });
  });

  describe('validatePhone', () => {
    test('validates correct phone number', () => {
      const result = validatePhone('+1-234-567-8900');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('validates phone with various formats', () => {
      expect(validatePhone('1234567890').isValid).toBe(true);
      expect(validatePhone('(123) 456-7890').isValid).toBe(true);
      expect(validatePhone('+1 123 456 7890').isValid).toBe(true);
    });

    test('rejects too short phone', () => {
      const result = validatePhone('123');
      expect(result.isValid).toBe(false);
    });

    test('rejects empty phone', () => {
      const result = validatePhone('');
      expect(result.isValid).toBe(false);
    });
  });

  describe('validatePassword', () => {
    test('validates strong password', () => {
      const result = validatePassword('StrongP@ss123');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('rejects password without uppercase', () => {
      const result = validatePassword('weakp@ss123');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('uppercase');
    });

    test('rejects password without lowercase', () => {
      const result = validatePassword('WEAKP@SS123');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('lowercase');
    });

    test('rejects password without number', () => {
      const result = validatePassword('WeakP@ssword');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('number');
    });

    test('rejects password without special char', () => {
      const result = validatePassword('WeakPass123');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('special character');
    });

    test('rejects short password', () => {
      const result = validatePassword('Weak@1');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('8 characters');
    });

    test('respects custom requirements', () => {
      const result = validatePassword('simple', {
        minLength: 6,
        requireUppercase: false,
        requireNumber: false,
        requireSpecialChar: false
      });
      expect(result.isValid).toBe(true);
    });
  });

  describe('validatePasswordMatch', () => {
    test('validates matching passwords', () => {
      const result = validatePasswordMatch('password123', 'password123');
      expect(result.isValid).toBe(true);
    });

    test('rejects non-matching passwords', () => {
      const result = validatePasswordMatch('password123', 'different123');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('do not match');
    });
  });

  describe('validateRequired', () => {
    test('validates non-empty value', () => {
      const result = validateRequired('some value');
      expect(result.isValid).toBe(true);
    });

    test('rejects empty string', () => {
      const result = validateRequired('');
      expect(result.isValid).toBe(false);
    });

    test('rejects null', () => {
      const result = validateRequired(null);
      expect(result.isValid).toBe(false);
    });

    test('rejects undefined', () => {
      const result = validateRequired(undefined);
      expect(result.isValid).toBe(false);
    });

    test('uses custom field name in error', () => {
      const result = validateRequired('', 'Username');
      expect(result.error).toContain('Username');
    });
  });

  describe('validateMinLength', () => {
    test('validates string meeting min length', () => {
      const result = validateMinLength('hello', 5);
      expect(result.isValid).toBe(true);
    });

    test('rejects string below min length', () => {
      const result = validateMinLength('hi', 5);
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateMaxLength', () => {
    test('validates string within max length', () => {
      const result = validateMaxLength('hello', 10);
      expect(result.isValid).toBe(true);
    });

    test('rejects string exceeding max length', () => {
      const result = validateMaxLength('hello world!', 10);
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateNumber', () => {
    test('validates number', () => {
      const result = validateNumber(42);
      expect(result.isValid).toBe(true);
    });

    test('validates numeric string', () => {
      const result = validateNumber('42');
      expect(result.isValid).toBe(true);
    });

    test('validates zero', () => {
      const result = validateNumber(0);
      expect(result.isValid).toBe(true);
    });

    test('rejects non-numeric value', () => {
      const result = validateNumber('abc');
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateRange', () => {
    test('validates number in range', () => {
      const result = validateRange(50, 0, 100);
      expect(result.isValid).toBe(true);
    });

    test('validates number at min boundary', () => {
      const result = validateRange(0, 0, 100);
      expect(result.isValid).toBe(true);
    });

    test('validates number at max boundary', () => {
      const result = validateRange(100, 0, 100);
      expect(result.isValid).toBe(true);
    });

    test('rejects number below range', () => {
      const result = validateRange(-1, 0, 100);
      expect(result.isValid).toBe(false);
    });

    test('rejects number above range', () => {
      const result = validateRange(101, 0, 100);
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateCurrency', () => {
    test('validates valid currency', () => {
      expect(validateCurrency('10.99').isValid).toBe(true);
      expect(validateCurrency('100').isValid).toBe(true);
      expect(validateCurrency('0.50').isValid).toBe(true);
    });

    test('rejects invalid currency', () => {
      expect(validateCurrency('10.999').isValid).toBe(false);
      expect(validateCurrency('abc').isValid).toBe(false);
    });
  });

  describe('validateDate', () => {
    test('validates valid date', () => {
      const result = validateDate('2024-01-15');
      expect(result.isValid).toBe(true);
    });

    test('rejects invalid date', () => {
      const result = validateDate('invalid-date');
      expect(result.isValid).toBe(false);
    });

    test('rejects empty date', () => {
      const result = validateDate('');
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateFutureDate', () => {
    test('validates future date', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const result = validateFutureDate(tomorrow.toISOString());
      expect(result.isValid).toBe(true);
    });

    test('rejects past date', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const result = validateFutureDate(yesterday.toISOString());
      expect(result.isValid).toBe(false);
    });
  });

  describe('validatePastDate', () => {
    test('validates past date', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const result = validatePastDate(yesterday.toISOString());
      expect(result.isValid).toBe(true);
    });

    test('rejects future date', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const result = validatePastDate(tomorrow.toISOString());
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateUrl', () => {
    test('validates valid URL', () => {
      expect(validateUrl('https://example.com').isValid).toBe(true);
      expect(validateUrl('http://example.com').isValid).toBe(true);
      expect(validateUrl('https://example.com/path').isValid).toBe(true);
    });

    test('rejects invalid URL', () => {
      expect(validateUrl('not-a-url').isValid).toBe(false);
      expect(validateUrl('').isValid).toBe(false);
    });
  });

  describe('validateUsername', () => {
    test('validates valid username', () => {
      expect(validateUsername('user123').isValid).toBe(true);
      expect(validateUsername('john_doe').isValid).toBe(true);
    });

    test('rejects too short username', () => {
      expect(validateUsername('ab').isValid).toBe(false);
    });

    test('rejects too long username', () => {
      expect(validateUsername('a'.repeat(21)).isValid).toBe(false);
    });

    test('rejects username with special chars', () => {
      expect(validateUsername('user@123').isValid).toBe(false);
    });
  });

  describe('validateFile', () => {
    test('validates file within size limit', () => {
      const file = { size: 1024, type: 'image/png' };
      const result = validateFile(file, { maxSize: 5 * 1024 * 1024 });
      expect(result.isValid).toBe(true);
    });

    test('rejects file exceeding size limit', () => {
      const file = { size: 10 * 1024 * 1024, type: 'image/png' };
      const result = validateFile(file, { maxSize: 5 * 1024 * 1024 });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('5.00MB');
    });

    test('validates file type', () => {
      const file = { size: 1024, type: 'image/png' };
      const result = validateFile(file, {
        allowedTypes: ['image/png', 'image/jpeg']
      });
      expect(result.isValid).toBe(true);
    });

    test('rejects invalid file type', () => {
      const file = { size: 1024, type: 'application/pdf' };
      const result = validateFile(file, {
        allowedTypes: ['image/png', 'image/jpeg']
      });
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateForm', () => {
    test('validates entire form', () => {
      const formData = {
        email: 'test@example.com',
        name: 'John Doe'
      };

      const rules = {
        email: [validateEmail],
        name: [(value) => validateRequired(value, 'Name')]
      };

      const result = validateForm(formData, rules);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    test('returns errors for invalid fields', () => {
      const formData = {
        email: 'invalid-email',
        name: ''
      };

      const rules = {
        email: [validateEmail],
        name: [(value) => validateRequired(value, 'Name')]
      };

      const result = validateForm(formData, rules);
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBeTruthy();
      expect(result.errors.name).toBeTruthy();
    });

    test('stops at first error for each field', () => {
      const validator1 = jest.fn(() => ({ isValid: false, error: 'Error 1' }));
      const validator2 = jest.fn(() => ({ isValid: false, error: 'Error 2' }));

      const formData = { field: 'value' };
      const rules = { field: [validator1, validator2] };

      validateForm(formData, rules);

      expect(validator1).toHaveBeenCalled();
      expect(validator2).not.toHaveBeenCalled();
    });
  });
});
