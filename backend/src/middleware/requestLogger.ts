import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();

  // Store original res.end function
  const originalEnd = res.end;

  // Override res.end to log response
  res.end = function(chunk?: any, encoding?: any) {
    // Restore original end function
    res.end = originalEnd;

    // Call original end function
    res.end(chunk, encoding);

    // Calculate request duration
    const duration = Date.now() - startTime;

    // Log request details
    const logData = {
      method: req.method,
      url: req.originalUrl || req.url,
      statusCode: res.statusCode,
      duration,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
      contentLength: res.get('Content-Length'),
      userId: (req as any).user?.userId,
      requestId: req.headers['x-request-id'] || generateRequestId(),
    };

    // Log based on status code
    if (res.statusCode >= 500) {
      logger.error('HTTP Request Error', logData);
    } else if (res.statusCode >= 400) {
      logger.warn('HTTP Request Warning', logData);
    } else {
      logger.info('HTTP Request', logData);
    }

    // Performance logging for slow requests
    if (duration > 1000) {
      logger.warn('Slow Request Detected', {
        ...logData,
        performance: {
          duration,
          threshold: 1000,
        },
      });
    }
  };

  next();
};

// Generate unique request ID
function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}