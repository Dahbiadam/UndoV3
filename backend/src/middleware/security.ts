import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { config } from '../config';

export const securityMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  // Remove server information
  res.removeHeader('Server');

  // Content Security Policy (basic version)
  if (req.url.startsWith('/api/')) {
    res.setHeader('Content-Security-Policy', "default-src 'self'");
  }

  // Rate limiting by IP (basic check)
  const clientIp = req.ip || req.connection.remoteAddress;
  if (!clientIp) {
    logger.warn('Request without IP address', {
      userAgent: req.get('User-Agent'),
      url: req.url,
    });
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /eval\s*\(/i,
    /setTimeout\s*\(/i,
    /setInterval\s*\(/i,
  ];

  const requestBody = JSON.stringify(req.body);
  const queryString = JSON.stringify(req.query);

  const checkSuspiciousContent = (content: string, location: string) => {
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(content)) {
        logger.warn('Suspicious content detected', {
          ip: clientIp,
          url: req.url,
          method: req.method,
          location,
          pattern: pattern.source,
          userAgent: req.get('User-Agent'),
        });

        // Block suspicious requests in production
        if (config.env === 'production') {
          res.status(400).json({
            success: false,
            error: 'Invalid request content',
            code: 'SUSPICIOUS_CONTENT',
          });
          return true;
        }
      }
    }
    return false;
  };

  // Check request body and query string for suspicious content
  if (checkSuspiciousContent(requestBody, 'body') || checkSuspiciousContent(queryString, 'query')) {
    return;
  }

  // Validate request size
  const contentLength = req.get('Content-Length');
  if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) { // 10MB limit
    logger.warn('Request too large', {
      ip: clientIp,
      url: req.url,
      contentLength,
    });

    res.status(413).json({
      success: false,
      error: 'Request too large',
      code: 'REQUEST_TOO_LARGE',
    });
    return;
  }

  // Validate User-Agent
  const userAgent = req.get('User-Agent');
  if (!userAgent || userAgent.length > 500) {
    logger.warn('Invalid or missing User-Agent', {
      ip: clientIp,
      url: req.url,
      userAgent,
    });
  }

  // Add request ID for tracking
  req.headers['x-request-id'] = req.headers['x-request-id'] || generateRequestId();

  next();
};

function generateRequestId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}