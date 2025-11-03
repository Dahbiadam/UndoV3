import { Request, Response } from 'express';

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    code: 'ROUTE_NOT_FOUND',
    message: `The route ${req.method} ${req.url} does not exist`,
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      'GET /health',
      `GET /api/${process.env.API_VERSION || 'v1'}`,
      `POST /api/${process.env.API_VERSION || 'v1'}/auth/register`,
      `POST /api/${process.env.API_VERSION || 'v1'}/auth/login`,
      `POST /api/${process.env.API_VERSION || 'v1'}/auth/refresh`,
      // Add more endpoints as they're implemented
    ],
  });
};