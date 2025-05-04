
/**
 * Security utilities for the INFIWORLD application
 * Handles input sanitization, XSS prevention, and other security measures
 */

/**
 * Sanitize a string input to prevent XSS attacks
 * @param input The string to sanitize
 * @returns Sanitized string
 */
export const sanitizeString = (input: string): string => {
  if (!input) return '';
  
  // Convert to string if not already
  const str = String(input);
  
  // Basic HTML entity encoding
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

/**
 * Sanitize an object by recursively sanitizing all string properties
 * @param obj The object to sanitize
 * @returns A new object with all strings sanitized
 */
export const sanitizeObject = <T>(obj: T): T => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const result = { ...obj } as any;
  
  for (const key in result) {
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      const value = result[key];
      
      if (typeof value === 'string') {
        result[key] = sanitizeString(value);
      } else if (typeof value === 'object' && value !== null) {
        result[key] = sanitizeObject(value);
      }
    }
  }
  
  return result as T;
};

/**
 * Sanitize and validate email input
 * @param email The email to sanitize and validate
 * @returns Sanitized email or empty string if invalid
 */
export const sanitizeEmail = (email: string): string => {
  if (!email) return '';
  
  // Trim and lowercase
  const sanitized = email.trim().toLowerCase();
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(sanitized) ? sanitized : '';
};

/**
 * Create a nonce for CSRF protection
 * @returns A random nonce string
 */
export const generateNonce = (): string => {
  const array = new Uint32Array(4);
  window.crypto.getRandomValues(array);
  return Array.from(array)
    .map(value => value.toString(16))
    .join('-');
};

/**
 * Store a CSRF token in session storage
 */
export const storeCsrfToken = (): string => {
  const token = generateNonce();
  sessionStorage.setItem('csrf_token', token);
  return token;
};

/**
 * Validate a CSRF token against the stored token
 * @param token The token to validate
 * @returns Whether the token is valid
 */
export const validateCsrfToken = (token: string): boolean => {
  const storedToken = sessionStorage.getItem('csrf_token');
  return storedToken === token;
};
