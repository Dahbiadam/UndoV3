import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { config } from '../config';

export interface CustomError extends Error {
  statusCode?: number;
  code?: string;
  isOperational?: boolean;
  details?: any;
}

export const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let { statusCode = 500, message, code = 'INTERNAL_ERROR' } = error;

  // Log error details
  if (config.env === 'development') {
    logger.error('Error Details:', {
      message: error.message,
      stack: error.stack,
      statusCode,
      code,
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: (req as any).user?.id,
    });
  } else {
    // In production, log less detailed information
    logger.error('Application Error:', {
      message: error.message,
      statusCode,
      code,
      method: req.method,
      url: req.url,
      userId: (req as any).user?.id,
    });
  }

  // Handle specific error types
  if (error.name === 'ValidationError') {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = 'Validation failed';
  } else if (error.name === 'CastError') {
    statusCode = 400;
    code = 'INVALID_ID';
    message = 'Invalid ID format';
  } else if (error.name === 'MongoError' || error.name === 'MongoServerError') {
    if ((error as any).code === 11000) {
      statusCode = 409;
      code = 'DUPLICATE_ENTRY';
      message = 'Resource already exists';
    } else {
      statusCode = 500;
      code = 'DATABASE_ERROR';
      message = 'Database operation failed';
    }
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    code = 'INVALID_TOKEN';
    message = 'Invalid authentication token';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    code = 'TOKEN_EXPIRED';
    message = 'Authentication token has expired';
  } else if (error.name === 'MulterError') {
    statusCode = 400;
    code = 'FILE_UPLOAD_ERROR';
    message = 'File upload error';
  } else if ((error as any).type === 'entity.parse.failed') {
    statusCode = 400;
    code = 'INVALID_JSON';
    message = 'Invalid JSON in request body';
  }

  // Prepare error response
  const errorResponse: any = {
    success: false,
    error: message,
    code,
    timestamp: new Date().toISOString(),
  };

  // Include stack trace in development
  if (config.env === 'development') {
    errorResponse.stack = error.stack;
    errorResponse.details = error.details;
  }

  // Include specific validation errors
  if (error.name === 'ValidationError' && (error as any).details) {
    errorResponse.errors = (error as any).details;
  }

  // Add rate limit information if applicable
  if (statusCode === 429) {
    errorResponse.retryAfter = Math.ceil(config.rateLimit.windowMs / 1000);
  }

  res.status(statusCode).json(errorResponse);
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Create custom error class
export class AppError extends Error implements CustomError {
  public statusCode: number;
  public code: string;
  public isOperational: boolean;
  public details?: any;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'APP_ERROR',
    isOperational: boolean = true,
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Common error creators
export const createValidationError = (message: string, details?: any): AppError => {
  return new AppError(message, 400, 'VALIDATION_ERROR', true, details);
};

export const createNotFoundError = (resource: string = 'Resource'): AppError => {
  return new AppError(`${resource} not found`, 404, 'NOT_FOUND');
};

export const createUnauthorizedError = (message: string = 'Unauthorized'): AppError => {
  return new AppError(message, 401, 'UNAUTHORIZED');
};

export const createForbiddenError = (message: string = 'Forbidden'): AppError => {
  return new AppError(message, 403, 'FORBIDDEN');
};

export const createConflictError = (message: string = 'Resource already exists'): AppError => {
  return new AppError(message, 409, 'CONFLICT');
};

export const createRateLimitError = (message: string = 'Too many requests'): AppError => {
  return new AppError(message, 429, 'RATE_LIMIT_EXCEEDED');
};

export const createDatabaseError = (message: string = 'Database operation failed'): AppError => {
  return new AppError(message, 500, 'DATABASE_ERROR');
};

export const createExternalServiceError = (service: string, message: string = 'External service error'): AppError => {
  return new AppError(`${service}: ${message}`, 502, 'EXTERNAL_SERVICE_ERROR');
};