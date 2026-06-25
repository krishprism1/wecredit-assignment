import { z } from 'zod';

export const reviewActionSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    remarks: z.string().max(500, 'Remarks description cannot exceed 500 characters').optional(),
  }),
});

export const rejectActionSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    remarks: z.string().min(5, 'A rejection reason of at least 5 characters is required').max(500),
  }),
});

export const queryApplicationsSchema = z.object({
  query: z.object({
    status: z.enum(['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'INFO_REQUESTED', 'DISBURSED']).optional(),
    loan_type: z.enum(['PERSONAL', 'HOME', 'CAR', 'EDUCATION', 'BUSINESS']).optional(),
    search: z.string().optional(),
    limit: z.coerce.number().int().positive().default(20),
    page: z.coerce.number().int().positive().default(1),
  }),
});
