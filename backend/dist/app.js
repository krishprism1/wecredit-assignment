"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_js_1 = require("./config/env.js");
const request_logger_middleware_js_1 = require("./middleware/request-logger.middleware.js");
const error_handler_middleware_js_1 = require("./middleware/error-handler.middleware.js");
const auth_routes_js_1 = __importDefault(require("./modules/auth/auth.routes.js"));
const profile_routes_js_1 = __importDefault(require("./modules/profile/profile.routes.js"));
const loan_routes_js_1 = __importDefault(require("./modules/loan/loan.routes.js"));
const credit_routes_js_1 = __importDefault(require("./modules/credit/credit.routes.js"));
const admin_routes_js_1 = __importDefault(require("./modules/admin/admin.routes.js"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: env_js_1.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express_1.default.json());
app.use(request_logger_middleware_js_1.requestLogger);
// Health Check
app.get('/health', (req, res) => {
    res.json({ success: true, status: 'OK' });
});
// API Routes
app.use('/api/v1/auth', auth_routes_js_1.default);
app.use('/api/v1/profile', profile_routes_js_1.default);
app.use('/api/v1/loans', loan_routes_js_1.default);
app.use('/api/v1/credit', credit_routes_js_1.default);
app.use('/api/v1/admin', admin_routes_js_1.default);
app.use(error_handler_middleware_js_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map