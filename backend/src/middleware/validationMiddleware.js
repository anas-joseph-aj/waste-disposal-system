/**
 * Request Validation Middleware
 * Validates incoming requests to ensure data integrity
 */

export function validateRequestBody(schema) {
  return (req, res, next) => {
    const body = req.body || {};
    const errors = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value = body[field];

      if (rules.required && (!value || String(value).trim() === '')) {
        errors.push(`${field} is required`);
        continue;
      }

      if (!value) continue; // Skip further validation if field is empty and not required

      if (rules.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(value))) {
          errors.push(`${field} must be a valid email`);
        }
      }

      if (rules.type === 'number') {
        if (isNaN(Number(value))) {
          errors.push(`${field} must be a number`);
        } else {
          if (rules.min !== undefined && Number(value) < rules.min) {
            errors.push(`${field} must be at least ${rules.min}`);
          }
          if (rules.max !== undefined && Number(value) > rules.max) {
            errors.push(`${field} must be at most ${rules.max}`);
          }
        }
      }

      if (rules.type === 'string') {
        if (typeof value !== 'string' && !(value instanceof String)) {
          errors.push(`${field} must be a string`);
        } else {
          if (rules.minLength && String(value).length < rules.minLength) {
            errors.push(`${field} must be at least ${rules.minLength} characters`);
          }
          if (rules.maxLength && String(value).length > rules.maxLength) {
            errors.push(`${field} must be at most ${rules.maxLength} characters`);
          }
        }
      }

      if (rules.type === 'array') {
        if (!Array.isArray(value)) {
          errors.push(`${field} must be an array`);
        } else {
          if (rules.minItems && value.length < rules.minItems) {
            errors.push(`${field} must have at least ${rules.minItems} items`);
          }
          if (rules.maxItems && value.length > rules.maxItems) {
            errors.push(`${field} must have at most ${rules.maxItems} items`);
          }
        }
      }

      if (rules.enum && !rules.enum.includes(value)) {
        errors.push(`${field} must be one of: ${rules.enum.join(', ')}`);
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: 'Validation failed',
        errors
      });
    }

    next();
  };
}

// Sanitize string inputs to prevent XSS
export function sanitizeString(str) {
  if (typeof str !== 'string') return str;

  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return str.replace(/[&<>"']/g, (char) => map[char]);
}

// Validate phone number format
export function isValidPhone(phone) {
  return /^\d{10}$/.test(String(phone || '').replace(/\D/g, ''));
}

// Validate email format
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ''));
}

// Validate password strength
export function isStrongPassword(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  return (
    password.length >= minLength &&
    (hasUpperCase || hasNumbers) &&
    (hasLowerCase || hasNumbers) &&
    (hasNumbers || hasSpecialChar)
  );
}

export default {
  validateRequestBody,
  sanitizeString,
  isValidPhone,
  isValidEmail,
  isStrongPassword
};
