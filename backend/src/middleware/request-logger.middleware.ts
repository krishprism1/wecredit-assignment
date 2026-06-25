import { Request, Response, NextFunction } from 'express';
import { logger } from '../shared/utils/logger.js';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(
      {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip,
      },
      `${req.method} ${req.originalUrl} - ${res.statusCode} in ${duration}ms`
    );
  });
  next();
};
