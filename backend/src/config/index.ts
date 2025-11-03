import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Server configuration
export const config = {
  // Environment
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  host: process.env.HOST || 'localhost',

  // Database
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/undo_dev',
    testUri: process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/undo_test',
  },

  // Redis
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD || undefined,
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // OpenAI
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
  },

  // Email
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: {
      email: process.env.FROM_EMAIL || 'noreply@undo-app.com',
      name: process.env.FROM_NAME || 'UNDO Recovery App',
    },
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },

  // File Upload
  upload: {
    dir: process.env.UPLOAD_DIR || 'uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB
    allowedTypes: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp').split(','),
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  // Security
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
    sessionSecret: process.env.SESSION_SECRET || 'your-session-secret',
  },

  // API
  api: {
    version: process.env.API_VERSION || 'v1',
    baseUrl: process.env.API_BASE_URL || 'http://localhost:3001/api/v1',
  },

  // Frontend
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000',
    successUrl: process.env.FRONTEND_SUCCESS_URL || 'http://localhost:3000/auth/success',
    errorUrl: process.env.FRONTEND_ERROR_URL || 'http://localhost:3000/auth/error',
  },

  // Development tools
  dev: {
    enableCORS: process.env.ENABLE_CORS === 'true',
    enableSwagger: process.env.ENABLE_SWAGGER === 'true',
    enableMorganLogging: process.env.ENABLE_MORGAN_LOGGING === 'true',
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log',
  },

  // External services
  services: {
    crisisHotline: process.env.CRISIS_HOTLINE_NUMBER || '988',
    emergencyServicesUrl: process.env.EMERGENCY_SERVICES_URL || 'https://findahelpline.com/',
    therapyDirectoryUrl: process.env.THERAPY_DIRECTORY_URL || 'https://www.psychologytoday.com/us/therapists',
  },

  // Monitoring
  monitoring: {
    sentryDsn: process.env.SENTRY_DSN || '',
    enableErrorReporting: process.env.ENABLE_ERROR_REPORTING === 'true',
    enablePerformanceMonitoring: process.env.ENABLE_PERFORMANCE_MONITORING === 'true',
  },

  // Content Delivery
  cdn: {
    url: process.env.CDN_URL || '',
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
      apiKey: process.env.CLOUDINARY_API_KEY || '',
      apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    },
  },

  // Backup
  backup: {
    enableBackups: process.env.ENABLE_BACKUPS === 'true',
    schedule: process.env.BACKUP_SCHEDULE || '0 2 * * *',
    retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || '30', 10),
  },
};

// Validation functions
export const validateConfig = () => {
  const requiredVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'OPENAI_API_KEY',
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  // Validate JWT secrets are sufficiently long
  if (config.jwt.secret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }

  if (config.jwt.refreshSecret.length < 32) {
    throw new Error('JWT_REFRESH_SECRET must be at least 32 characters long');
  }

  // Validate ports
  if (isNaN(config.port) || config.port < 1 || config.port > 65535) {
    throw new Error('PORT must be a valid port number (1-65535)');
  }

  // Validate MongoDB URI format
  if (!config.mongodb.uri.startsWith('mongodb://') && !config.mongodb.uri.startsWith('mongodb+srv://')) {
    throw new Error('MONGODB_URI must be a valid MongoDB connection string');
  }

  return true;
};

// Get config for specific environment
export const getConfig = (env?: string) => {
  const targetEnv = env || config.env;

  if (targetEnv === 'test') {
    return {
      ...config,
      mongodb: {
        ...config.mongodb,
        uri: config.mongodb.testUri,
      },
      logging: {
        ...config.logging,
        level: 'error',
      },
    };
  }

  return config;
};

export default config;