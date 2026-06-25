"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryApplicationsSchema = exports.rejectActionSchema = exports.reviewActionSchema = void 0;
const zod_1 = require("zod");
exports.reviewActionSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid(),
    }),
    body: zod_1.z.object({
        remarks: zod_1.z.string().max(500, 'Remarks description cannot exceed 500 characters').optional(),
    }),
});
exports.rejectActionSchema = zod_1.z.object({
    body: zod_1.z.object({
        remarks: zod_1.z.string().min(5, 'A rejection reason of at least 5 characters is required').max(500),
    }),
});
exports.queryApplicationsSchema = zod_1.z.object({
    query: zod_1.z.object({
        status: zod_1.z.enum(['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'INFO_REQUESTED', 'DISBURSED']).optional(),
        loan_type: zod_1.z.enum(['PERSONAL', 'HOME', 'CAR', 'EDUCATION', 'BUSINESS']).optional(),
        search: zod_1.z.string().optional(),
        limit: zod_1.z.coerce.number().int().positive().default(20),
        page: zod_1.z.coerce.number().int().positive().default(1),
    }),
});
//# sourceMappingURL=admin.schemas.js.map