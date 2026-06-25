import { z } from 'zod';
export declare const reviewActionSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        remarks: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        remarks?: string | undefined;
    }, {
        remarks?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        remarks?: string | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        remarks?: string | undefined;
    };
}>;
export declare const rejectActionSchema: z.ZodObject<{
    body: z.ZodObject<{
        remarks: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        remarks: string;
    }, {
        remarks: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        remarks: string;
    };
}, {
    body: {
        remarks: string;
    };
}>;
export declare const queryApplicationsSchema: z.ZodObject<{
    query: z.ZodObject<{
        status: z.ZodOptional<z.ZodEnum<["DRAFT", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED", "INFO_REQUESTED", "DISBURSED"]>>;
        loan_type: z.ZodOptional<z.ZodEnum<["PERSONAL", "HOME", "CAR", "EDUCATION", "BUSINESS"]>>;
        search: z.ZodOptional<z.ZodString>;
        limit: z.ZodDefault<z.ZodNumber>;
        page: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
        page: number;
        status?: "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "INFO_REQUESTED" | "DISBURSED" | undefined;
        search?: string | undefined;
        loan_type?: "PERSONAL" | "HOME" | "CAR" | "EDUCATION" | "BUSINESS" | undefined;
    }, {
        status?: "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "INFO_REQUESTED" | "DISBURSED" | undefined;
        search?: string | undefined;
        loan_type?: "PERSONAL" | "HOME" | "CAR" | "EDUCATION" | "BUSINESS" | undefined;
        limit?: number | undefined;
        page?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        limit: number;
        page: number;
        status?: "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "INFO_REQUESTED" | "DISBURSED" | undefined;
        search?: string | undefined;
        loan_type?: "PERSONAL" | "HOME" | "CAR" | "EDUCATION" | "BUSINESS" | undefined;
    };
}, {
    query: {
        status?: "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "INFO_REQUESTED" | "DISBURSED" | undefined;
        search?: string | undefined;
        loan_type?: "PERSONAL" | "HOME" | "CAR" | "EDUCATION" | "BUSINESS" | undefined;
        limit?: number | undefined;
        page?: number | undefined;
    };
}>;
