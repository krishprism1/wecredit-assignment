"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const loan_controller_js_1 = require("./loan.controller.js");
const auth_middleware_js_1 = require("../../middleware/auth.middleware.js");
const validate_middleware_js_1 = require("../../middleware/validate.middleware.js");
const loan_schemas_js_1 = require("./loan.schemas.js");
const router = (0, express_1.Router)();
const controller = new loan_controller_js_1.LoanController();
router.use(auth_middleware_js_1.authenticate);
router.route('/')
    .get(controller.listLoans)
    .post((0, validate_middleware_js_1.validate)(loan_schemas_js_1.createLoanSchema), controller.createLoan);
router.route('/:id')
    .get(controller.getLoan)
    .put((0, validate_middleware_js_1.validate)(loan_schemas_js_1.updateLoanSchema), controller.updateLoan);
router.post('/:id/submit', controller.submitLoan);
exports.default = router;
//# sourceMappingURL=loan.routes.js.map