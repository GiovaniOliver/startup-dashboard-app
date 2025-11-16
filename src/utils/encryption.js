/**
 * Encryption Utilities
 * Provides encryption/decryption for sensitive data storage
 *
 * NOTE: For production, consider using a more robust solution
 * like storing encryption keys in a secure key management service
 */

import CryptoJS from 'crypto-js';

/**
 * Get encryption key
 * In production, this should be derived from a secure source
 */
const getEncryptionKey = () => {
  // WARNING: This is a placeholder. In production:
  // 1. Generate a strong random key
  // 2. Store it securely (not in code)
  // 3. Consider using user-specific keys
  // 4. Implement key rotation

  if (process.env.REACT_APP_ENCRYPTION_KEY) {
    return process.env.REACT_APP_ENCRYPTION_KEY;
  }

  // Fallback - should be replaced with proper key management
  console.warn('Using fallback encryption key. Set REACT_APP_ENCRYPTION_KEY in production');
  return 'CHANGE-THIS-IN-PRODUCTION-USE-STRONG-KEY';
};

/**
 * Encrypt data before storing
 * @param {*} data - Data to encrypt (will be stringified)
 * @returns {string} - Encrypted string
 */
export const encryptData = (data) => {
  try {
    const key = getEncryptionKey();
    const jsonString = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonString, key).toString();
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypt data after retrieving
 * @param {string} encryptedData - Encrypted string
 * @returns {*} - Original data
 */
export const decryptData = (encryptedData) => {
  try {
    if (!encryptedData) {
      return null;
    }

    const key = getEncryptionKey();
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedString) {
      throw new Error('Decryption produced empty result');
    }

    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
};

/**
 * Encrypt string (for simple values)
 * @param {string} str - String to encrypt
 * @returns {string} - Encrypted string
 */
export const encryptString = (str) => {
  try {
    const key = getEncryptionKey();
    return CryptoJS.AES.encrypt(str, key).toString();
  } catch (error) {
    console.error('String encryption failed:', error);
    throw new Error('Failed to encrypt string');
  }
};

/**
 * Decrypt string (for simple values)
 * @param {string} encryptedStr - Encrypted string
 * @returns {string} - Original string
 */
export const decryptString = (encryptedStr) => {
  try {
    if (!encryptedStr) {
      return null;
    }

    const key = getEncryptionKey();
    const bytes = CryptoJS.AES.decrypt(encryptedStr, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('String decryption failed:', error);
    return null;
  }
};

/**
 * Hash data (one-way, for verification)
 * @param {string} data - Data to hash
 * @returns {string} - Hashed string
 */
export const hashData = (data) => {
  return CryptoJS.SHA256(data).toString();
};

/**
 * Generate random token
 * @param {number} length - Length of token
 * @returns {string} - Random token
 */
export const generateToken = (length = 32) => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Secure storage wrapper
 * Encrypts data before storing in localStorage
 */
export const secureStorage = {
  /**
   * Set item with encryption
   * @param {string} key - Storage key
   * @param {*} value - Value to store
   */
  setItem: (key, value) => {
    try {
      const encrypted = encryptData(value);
      localStorage.setItem(key, encrypted);
      return true;
    } catch (error) {
      console.error('Secure storage set failed:', error);
      return false;
    }
  },

  /**
   * Get item with decryption
   * @param {string} key - Storage key
   * @returns {*} - Decrypted value
   */
  getItem: (key) => {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) {
        return null;
      }
      return decryptData(encrypted);
    } catch (error) {
      console.error('Secure storage get failed:', error);
      return null;
    }
  },

  /**
   * Remove item
   * @param {string} key - Storage key
   */
  removeItem: (key) => {
    localStorage.removeItem(key);
  },

  /**
   * Clear all items
   */
  clear: () => {
    localStorage.clear();
  }
};

/**
 * Check if data is encrypted
 * @param {string} data - Data to check
 * @returns {boolean} - True if appears to be encrypted
 */
export const isEncrypted = (data) => {
  if (!data || typeof data !== 'string') {
    return false;
  }

  // AES encrypted data typically contains these characters
  // This is a simple heuristic, not foolproof
  return /^U2FsdGVkX1/.test(data) || data.length > 100;
};

/**
 * Migrate unencrypted data to encrypted
 * @param {string} key - Storage key
 */
export const migrateToEncrypted = (key) => {
  try {
    const data = localStorage.getItem(key);

    if (!data) {
      return false;
    }

    // If already encrypted, skip
    if (isEncrypted(data)) {
      return false;
    }

    // Try to parse and re-encrypt
    try {
      const parsed = JSON.parse(data);
      secureStorage.setItem(key, parsed);
      console.log(`Migrated ${key} to encrypted storage`);
      return true;
    } catch (e) {
      // Data is not JSON, encrypt as string
      const encrypted = encryptString(data);
      localStorage.setItem(key, encrypted);
      console.log(`Migrated ${key} to encrypted storage (string)`);
      return true;
    }
  } catch (error) {
    console.error('Migration failed:', error);
    return false;
  }
};

export default {
  encryptData,
  decryptData,
  encryptString,
  decryptString,
  hashData,
  generateToken,
  secureStorage,
  isEncrypted,
  migrateToEncrypted
};
