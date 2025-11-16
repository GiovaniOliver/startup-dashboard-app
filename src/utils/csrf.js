/**
 * CSRF Protection Utilities
 * Provides CSRF token generation and validation for state-changing operations
 */

import { generateToken } from './encryption';

const CSRF_TOKEN_KEY = 'csrf_token';
const CSRF_TOKEN_HEADER = 'X-CSRF-Token';

/**
 * Generate a new CSRF token
 * @returns {string} - New CSRF token
 */
export const generateCsrfToken = () => {
  return generateToken(32);
};

/**
 * Get or create CSRF token
 * Token is stored in sessionStorage and rotated on login/logout
 * @returns {string} - Current CSRF token
 */
export const getCsrfToken = () => {
  let token = sessionStorage.getItem(CSRF_TOKEN_KEY);

  if (!token) {
    token = generateCsrfToken();
    sessionStorage.setItem(CSRF_TOKEN_KEY, token);
  }

  return token;
};

/**
 * Set CSRF token
 * Use this when receiving a token from the server
 * @param {string} token - CSRF token to set
 */
export const setCsrfToken = (token) => {
  if (!token || typeof token !== 'string') {
    console.error('Invalid CSRF token');
    return false;
  }

  sessionStorage.setItem(CSRF_TOKEN_KEY, token);
  return true;
};

/**
 * Rotate CSRF token
 * Should be called on login, logout, or periodically
 * @returns {string} - New CSRF token
 */
export const rotateCsrfToken = () => {
  const newToken = generateCsrfToken();
  sessionStorage.setItem(CSRF_TOKEN_KEY, newToken);
  return newToken;
};

/**
 * Clear CSRF token
 * Should be called on logout
 */
export const clearCsrfToken = () => {
  sessionStorage.removeItem(CSRF_TOKEN_KEY);
};

/**
 * Get CSRF header object
 * Use this to add CSRF token to fetch headers
 * @returns {Object} - Headers object with CSRF token
 */
export const getCsrfHeaders = () => {
  return {
    [CSRF_TOKEN_HEADER]: getCsrfToken()
  };
};

/**
 * Validate CSRF token
 * For client-side pre-validation (server should also validate)
 * @param {string} token - Token to validate
 * @returns {boolean} - True if token matches current token
 */
export const validateCsrfToken = (token) => {
  const currentToken = getCsrfToken();
  return token === currentToken;
};

/**
 * Add CSRF token to form data
 * @param {FormData} formData - FormData object
 * @returns {FormData} - FormData with CSRF token added
 */
export const addCsrfToFormData = (formData) => {
  formData.append('csrf_token', getCsrfToken());
  return formData;
};

/**
 * Add CSRF token to URL params
 * @param {URLSearchParams} params - URL search params
 * @returns {URLSearchParams} - Params with CSRF token added
 */
export const addCsrfToParams = (params) => {
  params.append('csrf_token', getCsrfToken());
  return params;
};

/**
 * Create fetch options with CSRF token
 * @param {Object} options - Fetch options
 * @returns {Object} - Fetch options with CSRF headers
 */
export const withCsrfToken = (options = {}) => {
  return {
    ...options,
    headers: {
      ...options.headers,
      ...getCsrfHeaders()
    }
  };
};

/**
 * Initialize CSRF protection
 * Call this on app initialization
 */
export const initCsrfProtection = () => {
  // Generate initial token if not present
  getCsrfToken();

  // Set up token rotation on visibility change
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      // Optionally rotate token when user returns to tab
      // rotateCsrfToken();
    }
  });
};

export default {
  generateCsrfToken,
  getCsrfToken,
  setCsrfToken,
  rotateCsrfToken,
  clearCsrfToken,
  getCsrfHeaders,
  validateCsrfToken,
  addCsrfToFormData,
  addCsrfToParams,
  withCsrfToken,
  initCsrfProtection,
  CSRF_TOKEN_HEADER
};
