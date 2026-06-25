"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const logger_js_1 = require("../shared/utils/logger.js");
const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger_js_1.logger.info({
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
        }, `${req.method} ${req.originalUrl} - ${res.statusCode} in ${duration}ms`);
    });
    next();
};
exports.requestLogger = requestLogger;
//# sourceMappingURL=request-logger.middleware.js.map