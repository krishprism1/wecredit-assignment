"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const app_error_js_1 = require("../shared/errors/app-error.js");
const validate = (schema) => {
    return async (req, res, next) => {
        try {
            const parsed = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            req.body = parsed.body;
            req.query = parsed.query;
            req.params = parsed.params;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const details = error.errors.map((err) => ({
                    field: err.path.join('.').replace(/^(body|query|params)\./, ''),
                    message: err.message,
                }));
                return next(new app_error_js_1.ValidationError('Validation failed', details));
            }
            next(error);
        }
    };
};
exports.validate = validate;
//# sourceMappingURL=validate.middleware.js.map