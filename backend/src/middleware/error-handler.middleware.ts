// backend/src/middleware/error-handler.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/errors/app-error.js';
import { logger } from '../shared/utils/logger.js';
import { ApiResponse } from 'shared';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
      },
    };
    return res.status(err.statusCode).json(response);
  }

  // Log unhandled exceptions
  logger.error(err, `Unhandled error on ${req.method} ${req.url}`);

  const response: ApiResponse = {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred on the server',
    },
  };
  res.status(500).json(response);
};
