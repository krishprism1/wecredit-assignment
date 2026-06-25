"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const app_error_js_1 = require("../shared/errors/app-error.js");
const logger_js_1 = require("../shared/utils/logger.js");
const errorHandler = (err, req, res, next) => {
    if (err instanceof app_error_js_1.AppError) {
        const response = {
            success: false,
            error: {
                code: err.code,
                message: err.message,
                ...(err.details ? { details: err.details } : {}),
            },
        };
        return res.status(err.statusCode).json(response);
    }
    logger_js_1.logger.error(err, `Unhandled error on ${req.method} ${req.url}`);
    const response = {
        success: false,
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred on the server',
        },
    };
    res.status(500).json(response);
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error-handler.middleware.js.map