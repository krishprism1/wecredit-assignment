import { z } from 'zod';

export const createLoanSchema = z.object({
  body: z.object({
    loan_type: z.enum(['PERSONAL', 'HOME', 'CAR', 'EDUCATION', 'BUSINESS']),
    amount_requested: z.number().positive('Amount requested must be greater than zero'),
    tenure_months: z.number().int().positive('Tenure must be a positive number of months'),
    purpose: z.string().max(500, 'Purpose description cannot exceed 500 characters').optional(),
  }),
});

export const updateLoanSchema = z.object({
  body: z.object({
    loan_type: z.enum(['PERSONAL', 'HOME', 'CAR', 'EDUCATION', 'BUSINESS']).optional(),
    amount_requested: z.number().positive('Amount requested must be greater than zero').optional(),
    tenure_months: z.number().int().positive('Tenure must be a positive number of months').optional(),
    purpose: z.string().max(500, 'Purpose description cannot exceed 500 characters').optional(),
  }),
});
