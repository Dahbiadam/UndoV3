import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { createUnauthorizedError } from './errorHandler';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    username: string;
  };
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw createUnauthorizedError('Access token required');
    }

    // Verify JWT token
    const decoded = jwt.verify(token, config.jwt.secret) as any;

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      username: decoded.username,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw createUnauthorizedError('Invalid access token');
    } else if (error instanceof jwt.TokenExpiredError) {
      throw createUnauthorizedError('Access token expired');
    } else {
      throw error;
    }
  }
};

// Optional authentication middleware
export const optionalAuthMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, config.jwt.secret) as any;
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        username: decoded.username,
      };
    }

    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};