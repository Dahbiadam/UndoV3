import mongoose from 'mongoose';
import { logger } from './logger';

interface DatabaseConfig {
  uri: string;
  options: mongoose.ConnectOptions;
}

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  private getConfig(): DatabaseConfig {
    const uri = process.env.MONGODB_URI;

    if (!uri || uri.includes('MONGODB_URI')) {
      // Return placeholder for development without MongoDB
      return {
        uri: 'mongodb://localhost:27017/undo_dev',
        options: {},
      };
    }

    const options: mongoose.ConnectOptions = {
      maxPoolSize: 10, // Maximum number of connections in the connection pool
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferMaxEntries: 0, // Disable mongoose buffering
      bufferCommands: false, // Disable mongoose buffering
      retryWrites: true, // Retry write operations if they fail
      retryReads: true, // Retry read operations if they fail
      readPreference: 'primaryPreferred',
      writeConcern: {
        w: 'majority',
        j: true,
        wtimeout: 10000,
      },
    };

    return { uri, options };
  }

  public async connect(): Promise<void> {
    try {
      if (this.isConnected) {
        logger.info('Database already connected');
        return;
      }

      const { uri, options } = this.getConfig();

      await mongoose.connect(uri, options);
      this.isConnected = true;

      logger.info('Connected to MongoDB successfully');

      // Set up connection event listeners
      this.setupEventListeners();
    } catch (error) {
      logger.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      if (!this.isConnected) {
        logger.info('Database already disconnected');
        return;
      }

      await mongoose.disconnect();
      this.isConnected = false;

      logger.info('Disconnected from MongoDB successfully');
    } catch (error) {
      logger.error('Failed to disconnect from MongoDB:', error);
      throw error;
    }
  }

  public async healthCheck(): Promise<boolean> {
    try {
      if (mongoose.connection.readyState !== 1) {
        return false;
      }

      // Ping the database to check connectivity
      await mongoose.connection.db.admin().ping();
      return true;
    } catch (error) {
      logger.error('Database health check failed:', error);
      return false;
    }
  }

  private setupEventListeners(): void {
    const db = mongoose.connection;

    db.on('error', (error) => {
      logger.error('MongoDB connection error:', error);
      this.isConnected = false;
    });

    db.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
      this.isConnected = false;
    });

    db.on('reconnected', () => {
      logger.info('MongoDB reconnected');
      this.isConnected = true;
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      await this.disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await this.disconnect();
      process.exit(0);
    });
  }

  public getConnectionState(): string {
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    return states[mongoose.connection.readyState as keyof typeof states] || 'unknown';
  }

  public isHealthy(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  // Utility method to get database stats
  public async getStats() {
    try {
      if (!this.isHealthy()) {
        throw new Error('Database is not connected');
      }

      const admin = mongoose.connection.db.admin();
      const serverStatus = await admin.serverStatus();
      const dbStats = await mongoose.connection.db.stats();

      return {
        connectionState: this.getConnectionState(),
        serverStatus: {
          version: serverStatus.version,
          uptime: serverStatus.uptime,
          connections: {
            current: serverStatus.connections?.current,
            available: serverStatus.connections?.available,
            totalCreated: serverStatus.connections?.totalCreated,
          },
        },
        database: {
          collections: dbStats.collections,
          documents: dbStats.objects,
          dataSize: dbStats.dataSize,
          storageSize: dbStats.storageSize,
          indexes: dbStats.indexes,
          indexSize: dbStats.indexSize,
        },
      };
    } catch (error) {
      logger.error('Failed to get database stats:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const database = DatabaseConnection.getInstance();

// Export for testing
export const resetDatabaseConnection = () => {
  // This is only for testing purposes
  if (process.env.NODE_ENV === 'test') {
    const instance = DatabaseConnection.getInstance();
    (instance as any).isConnected = false;
  }
};