// backend/src/modules/profile/profile.schemas.ts
import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    full_name: z.string().min(2, 'Name must be at least 2 characters long').max(100).optional(),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format').optional(),
    date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be in YYYY-MM-DD format').optional(),
  }),
});

export const updateAddressSchema = z.object({
  body: z.object({
    address_line_1: z.string().min(5, 'Address line must be at least 5 characters').max(200),
    city: z.string().min(2, 'City must be at least 2 characters').max(50),
    state: z.string().min(2, 'State must be at least 2 characters').max(50),
    pincode: z.string().regex(/^\d{6}$/, 'Pincode must be exactly 6 digits'),
    address_type: z.enum(['CURRENT', 'PERMANENT']),
  }),
});

export const updateEmploymentSchema = z.object({
  body: z.object({
    employer_name: z.string().min(2, 'Employer name must be at least 2 characters').max(100),
    designation: z.string().min(2, 'Designation must be at least 2 characters').max(50),
    monthly_income: z.number().min(0, 'Monthly income cannot be negative'),
    employment_type: z.enum(['SALARIED', 'SELF_EMPLOYED', 'BUSINESS_OWNER', 'OTHER']),
    years_at_job: z.number().min(0, 'Years at job cannot be negative'),
  }),
});
