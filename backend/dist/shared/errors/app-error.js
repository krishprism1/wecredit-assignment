"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.ConflictError = exports.ValidationError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = exports.AppError = void 0;
class AppError extends Error {
    statusCode;
    code;
    details;
    constructor(statusCode, message, code, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
class BadRequestError extends AppError {
    constructor(message = 'Bad request', code = 'BAD_REQUEST', details = null) {
        super(400, message, code, details);
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized', code = 'UNAUTHORIZED') {
        super(401, message, code);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends AppError {
    constructor(message = 'Forbidden', code = 'FORBIDDEN') {
        super(403, message, code);
    }
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends AppError {
    constructor(message = 'Resource not found', code = 'NOT_FOUND') {
        super(404, message, code);
    }
}
exports.NotFoundError = NotFoundError;
class ValidationError extends AppError {
    constructor(message = 'Validation failed', details = null) {
        super(400, message, 'VALIDATION_ERROR', details);
    }
}
exports.ValidationError = ValidationError;
class ConflictError extends AppError {
    constructor(message = 'Conflict occurred', code = 'CONFLICT') {
        super(409, message, code);
    }
}
exports.ConflictError = ConflictError;
class InternalServerError extends AppError {
    constructor(message = 'Internal server error') {
        super(500, message, 'INTERNAL_SERVER_ERROR');
    }
}
exports.InternalServerError = InternalServerError;
//# sourceMappingURL=app-error.js.map