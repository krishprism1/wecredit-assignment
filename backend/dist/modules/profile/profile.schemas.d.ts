import { z } from 'zod';
export declare const updateProfileSchema: z.ZodObject<{
    body: z.ZodObject<{
        full_name: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        date_of_birth: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        phone?: string | undefined;
        full_name?: string | undefined;
        date_of_birth?: string | undefined;
    }, {
        phone?: string | undefined;
        full_name?: string | undefined;
        date_of_birth?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        phone?: string | undefined;
        full_name?: string | undefined;
        date_of_birth?: string | undefined;
    };
}, {
    body: {
        phone?: string | undefined;
        full_name?: string | undefined;
        date_of_birth?: string | undefined;
    };
}>;
export declare const updateAddressSchema: z.ZodObject<{
    body: z.ZodObject<{
        address_line_1: z.ZodString;
        city: z.ZodString;
        state: z.ZodString;
        pincode: z.ZodString;
        address_type: z.ZodEnum<["CURRENT", "PERMANENT"]>;
    }, "strip", z.ZodTypeAny, {
        address_line_1: string;
        city: string;
        state: string;
        pincode: string;
        address_type: "PERMANENT" | "CURRENT";
    }, {
        address_line_1: string;
        city: string;
        state: string;
        pincode: string;
        address_type: "PERMANENT" | "CURRENT";
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        address_line_1: string;
        city: string;
        state: string;
        pincode: string;
        address_type: "PERMANENT" | "CURRENT";
    };
}, {
    body: {
        address_line_1: string;
        city: string;
        state: string;
        pincode: string;
        address_type: "PERMANENT" | "CURRENT";
    };
}>;
export declare const updateEmploymentSchema: z.ZodObject<{
    body: z.ZodObject<{
        employer_name: z.ZodString;
        designation: z.ZodString;
        monthly_income: z.ZodNumber;
        employment_type: z.ZodEnum<["SALARIED", "SELF_EMPLOYED", "BUSINESS_OWNER", "OTHER"]>;
        years_at_job: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        employer_name: string;
        designation: string;
        monthly_income: number;
        employment_type: "SALARIED" | "SELF_EMPLOYED" | "BUSINESS_OWNER" | "OTHER";
        years_at_job: number;
    }, {
        employer_name: string;
        designation: string;
        monthly_income: number;
        employment_type: "SALARIED" | "SELF_EMPLOYED" | "BUSINESS_OWNER" | "OTHER";
        years_at_job: number;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        employer_name: string;
        designation: string;
        monthly_income: number;
        employment_type: "SALARIED" | "SELF_EMPLOYED" | "BUSINESS_OWNER" | "OTHER";
        years_at_job: number;
    };
}, {
    body: {
        employer_name: string;
        designation: string;
        monthly_income: number;
        employment_type: "SALARIED" | "SELF_EMPLOYED" | "BUSINESS_OWNER" | "OTHER";
        years_at_job: number;
    };
}>;
