"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const credit_controller_js_1 = require("./credit.controller.js");
const auth_middleware_js_1 = require("../../middleware/auth.middleware.js");
const router = (0, express_1.Router)();
const controller = new credit_controller_js_1.CreditController();
router.use(auth_middleware_js_1.authenticate);
router.route('/score')
    .get(controller.getLatestScore)
    .post(controller.generateScore);
exports.default = router;
//# sourceMappingURL=credit.routes.js.map