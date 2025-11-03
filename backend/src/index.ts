import 'express-async-errors'; // Must be imported first
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

import { config, validateConfig } from './config';
import { database } from './config/database';
import { logger, morganStream } from './config/logger';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import { requestLogger } from './middleware/requestLogger';
import { securityMiddleware } from './middleware/security';
import { validationMiddleware } from './middleware/validation';
import { authMiddleware } from './middleware/auth';
import { rateLimitMiddleware } from './middleware/rateLimit';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import streakRoutes from './routes/streaks';
import checkinRoutes from './routes/checkins';
import emergencyRoutes from './routes/emergency';
import coachRoutes from './routes/coach';
import communityRoutes from './routes/community';
import habitsRoutes from './routes/habits';
import healthRoutes from './routes/health';

class App {
  public app: express.Application;
  public server: any;
  public io: SocketIOServer;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: config.cors.origin,
        methods: ['GET', 'POST'],
        credentials: true,
      },
      transports: ['websocket', 'polling'],
    });

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.initializeSocketIO();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", "wss:", "https:"],
        },
      },
      crossOriginEmbedderPolicy: false, // Disable for compatibility
    }));

    // CORS configuration
    if (config.dev.enableCORS) {
      this.app.use(cors({
        origin: config.cors.origin,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      }));
    }

    // Compression
    this.app.use(compression());

    // Request logging
    if (config.dev.enableMorganLogging) {
      this.app.use(morgan('combined', { stream: morganStream }));
    }

    // Custom request logger
    this.app.use(requestLogger);

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: config.rateLimit.windowMs,
      max: config.rateLimit.maxRequests,
      message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: Math.ceil(config.rateLimit.windowMs / 1000),
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use('/api/', limiter);

    // Custom rate limiting middleware
    this.app.use(rateLimitMiddleware);

    // Security middleware
    this.app.use(securityMiddleware);

    // Validation middleware
    this.app.use(validationMiddleware);

    // Health check endpoint (before auth middleware)
    this.app.get('/health', (_req, res) => {
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.env,
        version: process.env['npm_package_version'] || '1.0.0',
      });
    });
  }

  private initializeRoutes(): void {
    const apiRouter = express.Router();

    // API routes
    apiRouter.use('/auth', authRoutes);
    apiRouter.use('/users', authMiddleware, userRoutes);
    apiRouter.use('/streaks', authMiddleware, streakRoutes);
    apiRouter.use('/checkins', authMiddleware, checkinRoutes);
    apiRouter.use('/emergency', authMiddleware, emergencyRoutes);
    apiRouter.use('/coach', authMiddleware, coachRoutes);
    apiRouter.use('/community', authMiddleware, communityRoutes);
    apiRouter.use('/habits', authMiddleware, habitsRoutes);
    apiRouter.use('/health', healthRoutes);

    // Mount API routes
    this.app.use(`/api/${config.api.version}`, apiRouter);

    // Root endpoint
    this.app.get('/', (req, res) => {
      res.json({
        message: 'UNDO Recovery App API',
        version: config.api.version,
        environment: config.env,
        documentation: `/api/${config.api.version}/health`,
      });
    });
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);

    // Global error handler
    this.app.use(errorHandler);
  }

  private initializeSocketIO(): void {
    this.io.use(async (socket, next) => {
      try {
        // Authenticate socket connections
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication token required'));
        }

        // Verify JWT token and attach user to socket
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, config.jwt.secret);
        socket.data.user = decoded;
        next();
      } catch (error) {
        next(new Error('Invalid authentication token'));
      }
    });

    this.io.on('connection', (socket) => {
      const userId = socket.data.user.userId;
      logger.info(`Socket connected: ${socket.id} for user: ${userId}`);

      // Join user to their personal room
      socket.join(`user:${userId}`);

      // Handle chat messages for AI coach
      socket.on('ai-coach:message', async (data) => {
        try {
          // Process AI coach message
          // This will be implemented in the coach service
          logger.info(`AI Coach message from user ${userId}:`, data);

          // Emit response back to user
          socket.emit('ai-coach:response', {
            type: 'response',
            message: 'This is a placeholder response. AI coach integration coming soon.',
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          logger.error('Error processing AI coach message:', error);
          socket.emit('ai-coach:error', {
            message: 'Sorry, there was an error processing your message.',
          });
        }
      });

      // Handle community chat
      socket.on('community:join', (communityId) => {
        socket.join(`community:${communityId}`);
        logger.info(`User ${userId} joined community ${communityId}`);
      });

      socket.on('community:leave', (communityId) => {
        socket.leave(`community:${communityId}`);
        logger.info(`User ${userId} left community ${communityId}`);
      });

      socket.on('community:message', (data) => {
        // Broadcast to community room
        socket.to(`community:${data.communityId}`).emit('community:message', {
          ...data,
          userId,
          timestamp: new Date().toISOString(),
        });
      });

      // Handle emergency notifications
      socket.on('emergency:triggered', async (data) => {
        try {
          logger.warn(`Emergency triggered by user ${userId}:`, data);

          // Notify emergency contacts if configured
          // This would integrate with the emergency service

          // Send acknowledgement
          socket.emit('emergency:acknowledged', {
            message: 'Emergency support has been activated. Help is on the way.',
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          logger.error('Error handling emergency trigger:', error);
        }
      });

      // Handle disconnection
      socket.on('disconnect', (reason) => {
        logger.info(`Socket disconnected: ${socket.id} for user: ${userId}, reason: ${reason}`);
      });

      // Handle errors
      socket.on('error', (error) => {
        logger.error(`Socket error for user ${userId}:`, error);
      });
    });

    logger.info('Socket.IO server initialized');
  }

  public async start(): Promise<void> {
    try {
      // Validate configuration
      validateConfig();

      // Connect to database
      await database.connect();

      // Start server
      this.server.listen(config.port, config.host, () => {
        logger.info(`🚀 Server running on ${config.host}:${config.port}`);
        logger.info(`📝 Environment: ${config.env}`);
        logger.info(`🔗 API Base URL: ${config.api.baseUrl}`);
        logger.info(`🌐 Frontend URL: ${config.frontend.url}`);
      });

      // Graceful shutdown
      this.setupGracefulShutdown();

    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  private setupGracefulShutdown(): void {
    const gracefulShutdown = async (signal: string) => {
      logger.info(`Received ${signal}, starting graceful shutdown...`);

      try {
        // Stop accepting new connections
        this.server.close(async () => {
          logger.info('HTTP server closed');

          try {
            // Close Socket.IO connections
            this.io.close(() => {
              logger.info('Socket.IO server closed');
            });

            // Disconnect from database
            await database.disconnect();

            logger.info('Graceful shutdown completed');
            process.exit(0);
          } catch (error) {
            logger.error('Error during graceful shutdown:', error);
            process.exit(1);
          }
        });

        // Force close after 30 seconds
        setTimeout(() => {
          logger.error('Graceful shutdown timeout, forcing exit');
          process.exit(1);
        }, 30000);

      } catch (error) {
        logger.error('Error during shutdown:', error);
        process.exit(1);
      }
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      gracefulShutdown('uncaughtException');
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      gracefulShutdown('unhandledRejection');
    });
  }
}

// Create and start the application
const app = new App();
app.start().catch((error) => {
  logger.error('Failed to start application:', error);
  process.exit(1);
});

export default app;