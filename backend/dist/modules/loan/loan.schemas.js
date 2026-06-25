"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLoanSchema = exports.createLoanSchema = void 0;
const zod_1 = require("zod");
exports.createLoanSchema = zod_1.z.object({
    body: zod_1.z.object({
        loan_type: zod_1.z.enum(['PERSONAL', 'HOME', 'CAR', 'EDUCATION', 'BUSINESS']),
        amount_requested: zod_1.z.number().positive('Amount requested must be greater than zero'),
        tenure_months: zod_1.z.number().int().positive('Tenure must be a positive number of months'),
        purpose: zod_1.z.string().max(500, 'Purpose description cannot exceed 500 characters').optional(),
    }),
});
exports.updateLoanSchema = zod_1.z.object({
    body: zod_1.z.object({
        loan_type: zod_1.z.enum(['PERSONAL', 'HOME', 'CAR', 'EDUCATION', 'BUSINESS']).optional(),
        amount_requested: zod_1.z.number().positive('Amount requested must be greater than zero').optional(),
        tenure_months: zod_1.z.number().int().positive('Tenure must be a positive number of months').optional(),
        purpose: zod_1.z.string().max(500, 'Purpose description cannot exceed 500 characters').optional(),
    }),
});
//# sourceMappingURL=loan.schemas.js.map