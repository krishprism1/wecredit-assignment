import { LoanApplication, LoanStatus } from 'shared';
export declare class LoanRepository {
    createLoan(userId: string, data: Omit<LoanApplication, 'id' | 'applicant_id' | 'status' | 'assigned_admin_id' | 'created_at' | 'updated_at'>): Promise<LoanApplication>;
    getLoanById(id: string): Promise<LoanApplication | null>;
    updateLoan(id: string, data: Partial<Omit<LoanApplication, 'id' | 'applicant_id' | 'status' | 'created_at' | 'updated_at'>>): Promise<LoanApplication>;
    listLoansByUserId(userId: string): Promise<LoanApplication[]>;
    updateLoanStatus(id: string, fromStatus: LoanStatus, toStatus: LoanStatus, changedBy: string | null, remarks: string | null): Promise<LoanApplication>;
}
