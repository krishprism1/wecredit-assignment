import { z } from 'zod';
export declare const createLoanSchema: z.ZodObject<{
    body: z.ZodObject<{
        loan_type: z.ZodEnum<["PERSONAL", "HOME", "CAR", "EDUCATION", "BUSINESS"]>;
        amount_requested: z.ZodNumber;
        tenure_months: z.ZodNumber;
        purpose: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        loan_type: "PERSONAL" | "HOME" | "CAR" | "EDUCATION" | "BUSINESS";
        amount_requested: number;
        tenure_months: number;
        purpose?: string | undefined;
    }, {
        loan_type: "PERSONAL" | "HOME" | "CAR" | "EDUCATION" | "BUSINESS";
        amount_requested: number;
        tenure_months: number;
        purpose?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        loan_type: "PERSONAL" | "HOME" | "CAR" | "EDUCATION" | "BUSINESS";
        amount_requested: number;
        tenure_months: number;
        purpose?: string | undefined;
    };
}, {
    body: {
        loan_type: "PERSONAL" | "HOME" | "CAR" | "EDUCATION" | "BUSINESS";
        amount_requested: number;
        tenure_months: number;
        purpose?: string | undefined;
    };
}>;
export declare const updateLoanSchema: z.ZodObject<{
    body: z.ZodObject<{
        loan_type: z.ZodOptional<z.ZodEnum<["PERSONAL", "HOME", "CAR", "EDUCATION", "BUSINESS"]>>;
        amount_requested: z.ZodOptional<z.ZodNumber>;
        tenure_months: z.ZodOptional<z.ZodNumber>;
        purpose: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        loan_type?: "PERSONAL" | "HOME" | "CAR" | "EDUCATION" | "BUSINESS" | undefined;
        amount_requested?: number | undefined;
        tenure_months?: number | undefined;
        purpose?: string | undefined;
    }, {
        loan_type?: "PERSONAL" | "HOME" | "CAR" | "EDUCATION" | "BUSINESS" | undefined;
        amount_requested?: number | undefined;
        tenure_months?: number | undefined;
        purpose?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        loan_type?: "PERSONAL" | "HOME" | "CAR" | "EDUCATION" | "BUSINESS" | undefined;
        amount_requested?: number | undefined;
        tenure_months?: number | undefined;
        purpose?: string | undefined;
    };
}, {
    body: {
        loan_type?: "PERSONAL" | "HOME" | "CAR" | "EDUCATION" | "BUSINESS" | undefined;
        amount_requested?: number | undefined;
        tenure_months?: number | undefined;
        purpose?: string | undefined;
    };
}>;
