import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { database } from '../config/database';
import { openRouterService } from '../services/openRouterService';

const router = Router();

/**
 * GET /api/v1/health
 * Comprehensive health check
 */
router.get('/', asyncHandler(async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    services: {
      database: 'unknown',
      ai: 'unknown',
    },
  };

  try {
    // Check database connection
    health.services.database = await database.healthCheck() ? 'healthy' : 'unhealthy';
  } catch (error) {
    health.services.database = 'unhealthy';
  }

  try {
    // Check AI service
    health.services.ai = await openRouterService.checkStatus() ? 'healthy' : 'unhealthy';
  } catch (error) {
    health.services.ai = 'unhealthy';
  }

  // Determine overall health
  const allServicesHealthy = Object.values(health.services).every(status => status === 'healthy');
  health.status = allServicesHealthy ? 'healthy' : 'degraded';

  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json({
    success: allServicesHealthy,
    data: health,
  });
}));

/**
 * GET /api/v1/health/database
 * Database health check
 */
router.get('/database', asyncHandler(async (req, res) => {
  const isHealthy = await database.healthCheck();

  res.status(isHealthy ? 200 : 503).json({
    success: isHealthy,
    data: {
      status: isHealthy ? 'healthy' : 'unhealthy',
      connectionState: database.getConnectionState(),
      timestamp: new Date(),
    },
  });
}));

/**
 * GET /api/v1/health/ai
 * AI service health check
 */
router.get('/ai', asyncHandler(async (req, res) => {
  const isHealthy = await openRouterService.checkStatus();

  res.status(isHealthy ? 200 : 503).json({
    success: isHealthy,
    data: {
      status: isHealthy ? 'healthy' : 'unhealthy',
      service: 'OpenRouter',
      model: process.env.OPENROUTER_MODEL || 'openai/gpt-5',
      timestamp: new Date(),
    },
  });
}));

export default router;