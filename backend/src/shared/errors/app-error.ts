// backend/src/shared/errors/app-error.ts

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code: string,
    public readonly details: any = null
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad request', code: string = 'BAD_REQUEST', details: any = null) {
    super(400, message, code, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized', code: string = 'UNAUTHORIZED') {
    super(401, message, code);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden', code: string = 'FORBIDDEN') {
    super(403, message, code);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found', code: string = 'NOT_FOUND') {
    super(404, message, code);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed', details: any = null) {
    super(400, message, 'VALIDATION_ERROR', details);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Conflict occurred', code: string = 'CONFLICT') {
    super(409, message, code);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(500, message, 'INTERNAL_SERVER_ERROR');
  }
}
