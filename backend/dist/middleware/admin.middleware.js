"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = void 0;
const app_error_js_1 = require("../shared/errors/app-error.js");
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return next(new app_error_js_1.ForbiddenError('Access denied: Authentication required'));
    }
    if (!req.user.is_admin) {
        return next(new app_error_js_1.ForbiddenError('Access denied: Admin privileges required'));
    }
    next();
};
exports.requireAdmin = requireAdmin;
//# sourceMappingURL=admin.middleware.js.map