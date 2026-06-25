import { LoanApplication, AuditLog } from 'shared';
export declare class AdminRepository {
    listApplications(filters: {
        status?: string;
        loan_type?: string;
        search?: string;
        limit: number;
        offset: number;
    }): Promise<{
        applications: LoanApplication[];
        count: number;
    }>;
    assignAdmin(applicationId: string, adminId: string): Promise<void>;
    getDashboardStats(): Promise<{
        totalApplications: number;
        pendingReview: number;
        approved: number;
        disbursed: number;
        rejected: number;
        totalDisbursedAmount: number;
    }>;
    getAuditLogs(limit?: number): Promise<AuditLog[]>;
}
