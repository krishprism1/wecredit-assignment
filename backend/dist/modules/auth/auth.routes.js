"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_js_1 = require("./auth.controller.js");
const validate_middleware_js_1 = require("../../middleware/validate.middleware.js");
const auth_middleware_js_1 = require("../../middleware/auth.middleware.js");
const auth_schemas_js_1 = require("./auth.schemas.js");
const router = (0, express_1.Router)();
const controller = new auth_controller_js_1.AuthController();
router.post('/register', (0, validate_middleware_js_1.validate)(auth_schemas_js_1.registerSchema), controller.register);
router.post('/login', (0, validate_middleware_js_1.validate)(auth_schemas_js_1.loginSchema), controller.login);
router.post('/logout', auth_middleware_js_1.authenticate, controller.logout);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map