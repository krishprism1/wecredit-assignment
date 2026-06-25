import app from './app.js';
import { env } from './config/env.js';
import { logger } from './shared/utils/logger.js';

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
});

const gracefulShutdown = (signal: string) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    logger.info('Http server closed.');
    process.exit(0);
  });

  // Force shutdown after 10s if not closed
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  logger.error({ promise, reason }, 'Unhandled Rejection at Promise');
});

process.on('uncaughtException', (error) => {
  logger.error(error, 'Uncaught Exception thrown');
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});
