import { Request, Response, NextFunction } from 'express';
import { config } from '../config';
import { createRateLimitError } from './errorHandler';

// Simple in-memory rate limiting (for development)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const rateLimitMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Skip rate limiting in development if disabled
  if (config.env === 'development') {
    return next();
  }

  const clientId = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = config.rateLimit.windowMs;
  const maxRequests = config.rateLimit.maxRequests;

  // Get or create client record
  let clientRecord = requestCounts.get(clientId);

  if (!clientRecord || now > clientRecord.resetTime) {
    // New window or expired window
    clientRecord = {
      count: 1,
      resetTime: now + windowMs,
    };
    requestCounts.set(clientId, clientRecord);
    return next();
  }

  // Check if limit exceeded
  if (clientRecord.count >= maxRequests) {
    const resetIn = Math.ceil((clientRecord.resetTime - now) / 1000);
    res.set('Retry-After', resetIn.toString());
    throw createRateLimitError(`Too many requests. Try again in ${resetIn} seconds.`);
  }

  // Increment count
  clientRecord.count++;
  next();
};

// Cleanup old records periodically
setInterval(() => {
  const now = Date.now();
  for (const [clientId, record] of requestCounts.entries()) {
    if (now > record.resetTime) {
      requestCounts.delete(clientId);
    }
  }
}, 60000); // Clean up every minute