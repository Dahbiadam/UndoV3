import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { createValidationError } from './errorHandler';

export const validationMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Skip validation for health checks and certain routes
  const skipValidation = [
    '/health',
    '/',
  ];

  if (skipValidation.includes(req.path)) {
    return next();
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.type === 'field' ? error.path : 'unknown',
      message: error.msg,
      value: error.type === 'field' ? error.value : undefined,
      type: error.type,
    }));

    throw createValidationError('Validation failed', formattedErrors);
  }

  next();
};

// Helper to create validation middleware for specific routes
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    next();
  };
};

// Common validation rules
export const commonValidations = {
  email: {
    isEmail: {
      errorMessage: 'Please provide a valid email address',
    },
    normalizeEmail: true,
  },
  password: {
    isLength: {
      options: { min: 12, max: 128 },
      errorMessage: 'Password must be between 12 and 128 characters',
    },
    matches: {
      options: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      errorMessage: 'Password must contain at least one lowercase letter, one uppercase letter, and one number',
    },
  },
  username: {
    isLength: {
      options: { min: 3, max: 20 },
      errorMessage: 'Username must be between 3 and 20 characters',
    },
    matches: {
      options: /^[a-zA-Z0-9_-]+$/,
      errorMessage: 'Username can only contain letters, numbers, underscores, and hyphens',
    },
  },
  objectId: {
    matches: {
      options: /^[0-9a-fA-F]{24}$/,
      errorMessage: 'Invalid ID format',
    },
  },
  rating: {
    isInt: {
      options: { min: 1, max: 10 },
      errorMessage: 'Rating must be an integer between 1 and 10',
    },
  },
  intensity: {
    isInt: {
      options: { min: 0, max: 10 },
      errorMessage: 'Intensity must be an integer between 0 and 10',
    },
  },
  duration: {
    isInt: {
      options: { min: 0, max: 1440 }, // Max 24 hours in minutes
      errorMessage: 'Duration must be between 0 and 1440 minutes',
    },
  },
  page: {
    isInt: {
      options: { min: 1 },
      errorMessage: 'Page must be a positive integer',
    },
    toInt: true,
  },
  limit: {
    isInt: {
      options: { min: 1, max: 100 },
      errorMessage: 'Limit must be between 1 and 100',
    },
    toInt: true,
  },
  sortBy: {
    isIn: {
      options: [['createdAt', 'updatedAt', 'name', 'streak', 'mood']],
      errorMessage: 'Invalid sort field',
    },
  },
  sortOrder: {
    isIn: {
      options: [['asc', 'desc']],
      errorMessage: 'Sort order must be asc or desc',
    },
  },
};

// Sanitization middleware
export const sanitizeInput = (req: Request, res: Response, next: NextFunction): void => {
  const sanitizeString = (str: string): string => {
    if (typeof str !== 'string') return str;

    // Remove potentially dangerous characters
    return str
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  };

  const sanitizeObject = (obj: any): any => {
    if (typeof obj !== 'object' || obj === null) return obj;

    const sanitized: any = Array.isArray(obj) ? [] : {};

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = sanitizeString(value);
      } else if (typeof value === 'object') {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  };

  // Sanitize request body, query, and params
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  if (req.params) {
    req.params = sanitizeObject(req.params);
  }

  next();
};

// Content type validation
export const validateContentType = (allowedTypes: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentType = req.get('Content-Type');

    if (!contentType || !allowedTypes.some(type => contentType.includes(type))) {
      return res.status(415).json({
        success: false,
        error: `Unsupported media type. Expected: ${allowedTypes.join(', ')}`,
        code: 'UNSUPPORTED_MEDIA_TYPE',
      });
    }

    next();
  };
};

// File upload validation
export const validateFileUpload = (req: Request, res: Response, next: NextFunction) => {
  if (req.file) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (req.file.size > maxSize) {
      return res.status(413).json({
        success: false,
        error: 'File size exceeds 5MB limit',
        code: 'FILE_TOO_LARGE',
      });
    }

    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(415).json({
        success: false,
        error: 'Only JPEG, PNG, and WebP images are allowed',
        code: 'INVALID_FILE_TYPE',
      });
    }
  }

  next();
};