// backend/src/middleware/validate.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ValidationError } from '../shared/errors/app-error.js';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      // Replace with validated data
      req.body = parsed.body;
      req.query = parsed.query;
      req.params = parsed.params;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.map((err) => ({
          field: err.path.join('.').replace(/^(body|query|params)\./, ''),
          message: err.message,
        }));
        return next(new ValidationError('Validation failed', details));
      }
      next(error);
    }
  };
};
