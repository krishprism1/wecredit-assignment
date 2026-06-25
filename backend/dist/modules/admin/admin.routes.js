"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/modules/admin/admin.routes.ts
const express_1 = require("express");
const admin_controller_js_1 = require("./admin.controller.js");
const auth_middleware_js_1 = require("../../middleware/auth.middleware.js");
const admin_middleware_js_1 = require("../../middleware/admin.middleware.js");
const validate_middleware_js_1 = require("../../middleware/validate.middleware.js");
const admin_schemas_js_1 = require("./admin.schemas.js");
const router = (0, express_1.Router)();
const controller = new admin_controller_js_1.AdminController();
router.use(auth_middleware_js_1.authenticate, admin_middleware_js_1.requireAdmin);
router.get('/dashboard', controller.getDashboardStats);
router.get('/audit-logs', controller.getAuditLogs);
router.get('/applications', (0, validate_middleware_js_1.validate)(admin_schemas_js_1.queryApplicationsSchema), controller.listApplications);
router.get('/applications/:id', controller.getApplicationDetails);
router.post('/applications/:id/review', (0, validate_middleware_js_1.validate)(admin_schemas_js_1.reviewActionSchema), controller.startReview);
router.post('/applications/:id/approve', (0, validate_middleware_js_1.validate)(admin_schemas_js_1.reviewActionSchema), controller.approveApplication);
router.post('/applications/:id/reject', (0, validate_middleware_js_1.validate)(admin_schemas_js_1.rejectActionSchema), controller.rejectApplication);
router.post('/applications/:id/disburse', (0, validate_middleware_js_1.validate)(admin_schemas_js_1.reviewActionSchema), controller.disburseLoan);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map