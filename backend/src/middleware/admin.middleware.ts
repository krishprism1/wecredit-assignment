// backend/src/middleware/admin.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../shared/errors/app-error.js';

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new ForbiddenError('Access denied: Authentication required'));
  }

  if (!req.user.is_admin) {
    return next(new ForbiddenError('Access denied: Admin privileges required'));
  }

  next();
};
