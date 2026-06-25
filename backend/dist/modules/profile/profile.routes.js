"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profile_controller_js_1 = require("./profile.controller.js");
const auth_middleware_js_1 = require("../../middleware/auth.middleware.js");
const validate_middleware_js_1 = require("../../middleware/validate.middleware.js");
const profile_schemas_js_1 = require("./profile.schemas.js");
const router = (0, express_1.Router)();
const controller = new profile_controller_js_1.ProfileController();
router.use(auth_middleware_js_1.authenticate);
router.route('/')
    .get(controller.getProfile)
    .put((0, validate_middleware_js_1.validate)(profile_schemas_js_1.updateProfileSchema), controller.updateProfile);
router.put('/address', (0, validate_middleware_js_1.validate)(profile_schemas_js_1.updateAddressSchema), controller.updateAddress);
router.put('/employment', (0, validate_middleware_js_1.validate)(profile_schemas_js_1.updateEmploymentSchema), controller.updateEmployment);
exports.default = router;
//# sourceMappingURL=profile.routes.js.map