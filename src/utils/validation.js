/**
 * Form Validation Utilities
 */

/**
 * Email validation
 */
export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);

  return {
    isValid,
    error: isValid ? null : 'Please enter a valid email address'
  };
};

/**
 * Phone number validation (supports multiple formats)
 */
export const validatePhone = (phone) => {
  if (!phone) {
    return { isValid: false, error: 'Phone number is required' };
  }

  // Remove all non-numeric characters for validation
  const cleanPhone = phone.replace(/\D/g, '');

  // Check if it has 10-15 digits
  const isValid = cleanPhone.length >= 10 && cleanPhone.length <= 15;

  return {
    isValid,
    error: isValid ? null : 'Please enter a valid phone number (10-15 digits)'
  };
};

/**
 * Password validation
 */
export const validatePassword = (password, requirements = {}) => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumber = true,
    requireSpecialChar = true
  } = requirements;

  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }

  const errors = [];

  if (password.length < minLength) {
    errors.push(`at least ${minLength} characters`);
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('one uppercase letter');
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('one lowercase letter');
  }

  if (requireNumber && !/\d/.test(password)) {
    errors.push('one number');
  }

  if (requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('one special character');
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    error: isValid ? null : `Password must contain ${errors.join(', ')}`
  };
};

/**
 * Confirm password validation
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { isValid: false, error: 'Please confirm your password' };
  }

  const isValid = password === confirmPassword;

  return {
    isValid,
    error: isValid ? null : 'Passwords do not match'
  };
};

/**
 * Required field validation
 */
export const validateRequired = (value, fieldName = 'This field') => {
  const isValid = value !== null && value !== undefined && value.toString().trim() !== '';

  return {
    isValid,
    error: isValid ? null : `${fieldName} is required`
  };
};

/**
 * Minimum length validation
 */
export const validateMinLength = (value, minLength, fieldName = 'This field') => {
  if (!value) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  const isValid = value.toString().length >= minLength;

  return {
    isValid,
    error: isValid ? null : `${fieldName} must be at least ${minLength} characters`
  };
};

/**
 * Maximum length validation
 */
export const validateMaxLength = (value, maxLength, fieldName = 'This field') => {
  if (!value) {
    return { isValid: true, error: null };
  }

  const isValid = value.toString().length <= maxLength;

  return {
    isValid,
    error: isValid ? null : `${fieldName} must not exceed ${maxLength} characters`
  };
};

/**
 * Number validation
 */
export const validateNumber = (value, fieldName = 'This field') => {
  if (!value && value !== 0) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  const isValid = !isNaN(parseFloat(value)) && isFinite(value);

  return {
    isValid,
    error: isValid ? null : `${fieldName} must be a valid number`
  };
};

/**
 * Range validation (min and max)
 */
export const validateRange = (value, min, max, fieldName = 'This field') => {
  const numValue = parseFloat(value);

  if (isNaN(numValue)) {
    return { isValid: false, error: `${fieldName} must be a number` };
  }

  const isValid = numValue >= min && numValue <= max;

  return {
    isValid,
    error: isValid ? null : `${fieldName} must be between ${min} and ${max}`
  };
};

/**
 * Currency validation
 */
export const validateCurrency = (value, fieldName = 'Amount') => {
  if (!value && value !== 0) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  const currencyRegex = /^\d+(\.\d{1,2})?$/;
  const isValid = currencyRegex.test(value.toString());

  return {
    isValid,
    error: isValid ? null : `${fieldName} must be a valid currency amount (e.g., 10.99)`
  };
};

/**
 * Date validation
 */
export const validateDate = (dateString, fieldName = 'Date') => {
  if (!dateString) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  const date = new Date(dateString);
  const isValid = date instanceof Date && !isNaN(date);

  return {
    isValid,
    error: isValid ? null : `${fieldName} must be a valid date`
  };
};

/**
 * Future date validation
 */
export const validateFutureDate = (dateString, fieldName = 'Date') => {
  const dateValidation = validateDate(dateString, fieldName);

  if (!dateValidation.isValid) {
    return dateValidation;
  }

  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isValid = date >= today;

  return {
    isValid,
    error: isValid ? null : `${fieldName} must be today or a future date`
  };
};

/**
 * Past date validation
 */
export const validatePastDate = (dateString, fieldName = 'Date') => {
  const dateValidation = validateDate(dateString, fieldName);

  if (!dateValidation.isValid) {
    return dateValidation;
  }

  const date = new Date(dateString);
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const isValid = date <= today;

  return {
    isValid,
    error: isValid ? null : `${fieldName} must be today or a past date`
  };
};

/**
 * URL validation
 */
export const validateUrl = (url, fieldName = 'URL') => {
  if (!url) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  try {
    new URL(url);
    return { isValid: true, error: null };
  } catch (e) {
    return { isValid: false, error: `${fieldName} must be a valid URL` };
  }
};

/**
 * Username validation
 */
export const validateUsername = (username) => {
  if (!username) {
    return { isValid: false, error: 'Username is required' };
  }

  // 3-20 characters, alphanumeric and underscores only
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  const isValid = usernameRegex.test(username);

  return {
    isValid,
    error: isValid
      ? null
      : 'Username must be 3-20 characters and contain only letters, numbers, and underscores'
  };
};

/**
 * File validation
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = [],
    fieldName = 'File'
  } = options;

  if (!file) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
    return {
      isValid: false,
      error: `${fieldName} size must not exceed ${maxSizeMB}MB`
    };
  }

  // Check file type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `${fieldName} type must be one of: ${allowedTypes.join(', ')}`
    };
  }

  return { isValid: true, error: null };
};

/**
 * Custom regex validation
 */
export const validateRegex = (value, regex, errorMessage, fieldName = 'This field') => {
  if (!value) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  const isValid = regex.test(value);

  return {
    isValid,
    error: isValid ? null : errorMessage || `${fieldName} format is invalid`
  };
};

/**
 * Validate entire form
 */
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;

  Object.keys(validationRules).forEach((fieldName) => {
    const rules = validationRules[fieldName];
    const value = formData[fieldName];

    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      const result = rule(value);

      if (!result.isValid) {
        errors[fieldName] = result.error;
        isValid = false;
        break; // Stop at first error for this field
      }
    }
  });

  return { isValid, errors };
};

/**
 * Create validation rule
 */
export const createValidationRule = (validator, ...args) => {
  return (value) => validator(value, ...args);
};

export default {
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
  validateForm,
  createValidationRule
};
