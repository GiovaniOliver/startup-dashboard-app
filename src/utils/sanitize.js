/**
 * Input Sanitization Utilities
 * Prevent XSS and other injection attacks
 */

/**
 * Escape HTML to prevent XSS attacks
 */
export const escapeHtml = (unsafe) => {
  if (typeof unsafe !== 'string') {
    return unsafe;
  }

  const htmlEscapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };

  return unsafe.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char]);
};

/**
 * Unescape HTML
 */
export const unescapeHtml = (safe) => {
  if (typeof safe !== 'string') {
    return safe;
  }

  const htmlUnescapeMap = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'",
    '&#x2F;': '/'
  };

  return safe.replace(/&(amp|lt|gt|quot|#x27|#x2F);/g, (entity) => htmlUnescapeMap[entity]);
};

/**
 * Strip HTML tags
 */
export const stripHtml = (html) => {
  if (typeof html !== 'string') {
    return html;
  }

  return html.replace(/<[^>]*>/g, '');
};

/**
 * Sanitize string by removing dangerous characters
 */
export const sanitizeString = (str, options = {}) => {
  if (typeof str !== 'string') {
    return str;
  }

  const {
    allowLineBreaks = false,
    allowSpaces = true,
    trim = true
  } = options;

  let sanitized = str;

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');

  // Remove control characters except line breaks and spaces
  if (!allowLineBreaks) {
    sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');
  } else {
    sanitized = sanitized.replace(/[\x00-\x09\x0B-\x0C\x0E-\x1F\x7F]/g, '');
  }

  if (!allowSpaces) {
    sanitized = sanitized.replace(/\s/g, '');
  }

  if (trim) {
    sanitized = sanitized.trim();
  }

  return sanitized;
};

/**
 * Sanitize email
 */
export const sanitizeEmail = (email) => {
  if (typeof email !== 'string') {
    return email;
  }

  return email
    .toLowerCase()
    .trim()
    .replace(/[^\w.@+-]/g, '');
};

/**
 * Sanitize phone number
 */
export const sanitizePhone = (phone) => {
  if (typeof phone !== 'string') {
    return phone;
  }

  // Keep only digits, +, -, (, ), and spaces
  return phone.replace(/[^\d+\-() ]/g, '').trim();
};

/**
 * Sanitize URL
 */
export const sanitizeUrl = (url) => {
  if (typeof url !== 'string') {
    return url;
  }

  const trimmed = url.trim();

  // Block javascript: and data: URLs to prevent XSS
  if (/^(javascript|data|vbscript):/i.test(trimmed)) {
    return '';
  }

  return trimmed;
};

/**
 * Sanitize filename
 */
export const sanitizeFilename = (filename) => {
  if (typeof filename !== 'string') {
    return filename;
  }

  // Remove path separators and null bytes
  return filename
    .replace(/[\/\\:\*\?"<>\|\.]/g, '')
    .replace(/\0/g, '')
    .trim();
};

/**
 * Sanitize number input
 */
export const sanitizeNumber = (value, options = {}) => {
  const {
    allowDecimals = true,
    allowNegative = true
  } = options;

  if (typeof value === 'number') {
    return value;
  }

  if (typeof value !== 'string') {
    return NaN;
  }

  let sanitized = value.trim();

  // Build regex based on options
  let pattern = allowNegative ? '^-?' : '^';
  pattern += '\\d+';
  if (allowDecimals) {
    pattern += '(\\.\\d+)?';
  }
  pattern += '$';

  const regex = new RegExp(pattern);

  if (regex.test(sanitized)) {
    return allowDecimals ? parseFloat(sanitized) : parseInt(sanitized, 10);
  }

  return NaN;
};

/**
 * Sanitize currency input
 */
export const sanitizeCurrency = (value) => {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value !== 'string') {
    return NaN;
  }

  // Remove currency symbols and whitespace
  const sanitized = value.replace(/[$,\s]/g, '');

  const number = parseFloat(sanitized);

  if (isNaN(number)) {
    return NaN;
  }

  // Round to 2 decimal places
  return Math.round(number * 100) / 100;
};

/**
 * Sanitize object by applying sanitization to all string values
 */
export const sanitizeObject = (obj, sanitizer = sanitizeString) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => {
      if (typeof item === 'string') {
        return sanitizer(item);
      } else if (typeof item === 'object' && item !== null) {
        return sanitizeObject(item, sanitizer);
      }
      return item;
    });
  }

  const sanitized = {};

  Object.keys(obj).forEach(key => {
    const value = obj[key];

    if (typeof value === 'string') {
      sanitized[key] = sanitizer(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value, sanitizer);
    } else {
      sanitized[key] = value;
    }
  });

  return sanitized;
};

/**
 * Sanitize search query
 */
export const sanitizeSearchQuery = (query) => {
  if (typeof query !== 'string') {
    return '';
  }

  return query
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML
    .replace(/[^\w\s-]/g, '') // Keep only alphanumeric, spaces, and hyphens
    .slice(0, 100); // Limit length
};

/**
 * Sanitize SQL-like input (basic protection)
 */
export const sanitizeSqlInput = (input) => {
  if (typeof input !== 'string') {
    return input;
  }

  // Remove common SQL injection patterns
  const dangerous = [
    '--',
    ';--',
    '\\*',
    '@@',
    '@',
    'char',
    'nchar',
    'varchar',
    'nvarchar',
    'alter',
    'begin',
    'cast',
    'create',
    'cursor',
    'declare',
    'delete',
    'drop',
    'exec',
    'execute',
    'fetch',
    'insert',
    'kill',
    'select',
    'sys',
    'sysobjects',
    'syscolumns',
    'table',
    'update'
  ];

  let sanitized = input;

  dangerous.forEach(pattern => {
    const regex = new RegExp(pattern, 'gi');
    sanitized = sanitized.replace(regex, '');
  });

  return sanitized.trim();
};

/**
 * Sanitize JSON input
 */
export const sanitizeJson = (jsonString) => {
  if (typeof jsonString !== 'string') {
    return null;
  }

  try {
    // First parse to validate
    const parsed = JSON.parse(jsonString);

    // Then sanitize the object
    return sanitizeObject(parsed);
  } catch (e) {
    console.error('Invalid JSON:', e);
    return null;
  }
};

/**
 * Remove script tags and event handlers
 */
export const removeScripts = (html) => {
  if (typeof html !== 'string') {
    return html;
  }

  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/\son\w+\s*=\s*[^\s>]*/gi, '');
};

/**
 * Sanitize for safe storage in localStorage
 */
export const sanitizeForStorage = (data) => {
  if (typeof data === 'string') {
    return sanitizeString(data);
  }

  if (typeof data === 'object') {
    return sanitizeObject(data);
  }

  return data;
};

/**
 * Deep clone and sanitize
 */
export const cloneAndSanitize = (obj) => {
  return sanitizeObject(JSON.parse(JSON.stringify(obj)));
};

export default {
  escapeHtml,
  unescapeHtml,
  stripHtml,
  sanitizeString,
  sanitizeEmail,
  sanitizePhone,
  sanitizeUrl,
  sanitizeFilename,
  sanitizeNumber,
  sanitizeCurrency,
  sanitizeObject,
  sanitizeSearchQuery,
  sanitizeSqlInput,
  sanitizeJson,
  removeScripts,
  sanitizeForStorage,
  cloneAndSanitize
};
