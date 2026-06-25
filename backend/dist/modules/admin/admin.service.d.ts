import { LoanApplication, AuditLog } from 'shared';
export declare class AdminService {
    private adminRepository;
    private loanRepository;
    listApplications(filters: {
        status?: string;
        loan_type?: string;
        search?: string;
        limit: number;
        page: number;
    }): Promise<{
        applications: LoanApplication[];
        count: number;
    }>;
    getApplicationDetails(loanId: string): Promise<any>;
    startReview(adminId: string, loanId: string, remarks?: string): Promise<LoanApplication>;
    approveApplication(adminId: string, loanId: string, remarks?: string): Promise<LoanApplication>;
    rejectApplication(adminId: string, loanId: string, remarks: string): Promise<LoanApplication>;
    disburseLoan(adminId: string, loanId: string, remarks?: string): Promise<LoanApplication>;
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
