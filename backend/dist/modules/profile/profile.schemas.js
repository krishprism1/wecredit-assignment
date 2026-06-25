"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEmploymentSchema = exports.updateAddressSchema = exports.updateProfileSchema = void 0;
const zod_1 = require("zod");
exports.updateProfileSchema = zod_1.z.object({
    body: zod_1.z.object({
        full_name: zod_1.z.string().min(2, 'Name must be at least 2 characters long').max(100).optional(),
        phone: zod_1.z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format').optional(),
        date_of_birth: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be in YYYY-MM-DD format').optional(),
    }),
});
exports.updateAddressSchema = zod_1.z.object({
    body: zod_1.z.object({
        address_line_1: zod_1.z.string().min(5, 'Address line must be at least 5 characters').max(200),
        city: zod_1.z.string().min(2, 'City must be at least 2 characters').max(50),
        state: zod_1.z.string().min(2, 'State must be at least 2 characters').max(50),
        pincode: zod_1.z.string().regex(/^\d{6}$/, 'Pincode must be exactly 6 digits'),
        address_type: zod_1.z.enum(['CURRENT', 'PERMANENT']),
    }),
});
exports.updateEmploymentSchema = zod_1.z.object({
    body: zod_1.z.object({
        employer_name: zod_1.z.string().min(2, 'Employer name must be at least 2 characters').max(100),
        designation: zod_1.z.string().min(2, 'Designation must be at least 2 characters').max(50),
        monthly_income: zod_1.z.number().min(0, 'Monthly income cannot be negative'),
        employment_type: zod_1.z.enum(['SALARIED', 'SELF_EMPLOYED', 'BUSINESS_OWNER', 'OTHER']),
        years_at_job: zod_1.z.number().min(0, 'Years at job cannot be negative'),
    }),
});
//# sourceMappingURL=profile.schemas.js.map