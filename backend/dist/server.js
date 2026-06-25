"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = __importDefault(require("./app.js"));
const env_js_1 = require("./config/env.js");
const logger_js_1 = require("./shared/utils/logger.js");
const server = app_js_1.default.listen(env_js_1.env.PORT, () => {
    logger_js_1.logger.info(`Server running in ${env_js_1.env.NODE_ENV} mode on port ${env_js_1.env.PORT}`);
});
const gracefulShutdown = (signal) => {
    logger_js_1.logger.info(`Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
        logger_js_1.logger.info('Http server closed.');
        process.exit(0);
    });
    // Force shutdown after 10s if not closed
    setTimeout(() => {
        logger_js_1.logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('unhandledRejection', (reason, promise) => {
    logger_js_1.logger.error({ promise, reason }, 'Unhandled Rejection at Promise');
});
process.on('uncaughtException', (error) => {
    logger_js_1.logger.error(error, 'Uncaught Exception thrown');
    gracefulShutdown('UNCAUGHT_EXCEPTION');
});
//# sourceMappingURL=server.js.map