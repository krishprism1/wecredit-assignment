import { LoanApplication, LoanStatus } from 'shared';
export declare class LoanService {
    private loanRepository;
    private creditService;
    private eligibilityService;
    createLoan(userId: string, data: Omit<LoanApplication, 'id' | 'applicant_id' | 'status' | 'assigned_admin_id' | 'created_at' | 'updated_at'>): Promise<LoanApplication>;
    getLoan(userId: string, loanId: string, isAdmin?: boolean): Promise<{
        history: any[];
        id: string;
        applicant_id: string;
        loan_type: import("shared").LoanType;
        amount_requested: number;
        tenure_months: number;
        purpose: string | null;
        status: LoanStatus;
        assigned_admin_id: string | null;
        created_at: string;
        updated_at: string;
        applicant?: import("shared").Profile;
        assigned_admin?: import("shared").Profile;
        eligibility_result?: import("shared").EligibilityResult;
        credit_score?: import("shared").CreditScore;
    }>;
    listLoans(userId: string): Promise<LoanApplication[]>;
    updateLoan(userId: string, loanId: string, data: Partial<Omit<LoanApplication, 'id' | 'applicant_id' | 'status' | 'created_at' | 'updated_at'>>): Promise<LoanApplication>;
    submitLoan(userId: string, loanId: string): Promise<{
        history: any[];
        id: string;
        applicant_id: string;
        loan_type: import("shared").LoanType;
        amount_requested: number;
        tenure_months: number;
        purpose: string | null;
        status: LoanStatus;
        assigned_admin_id: string | null;
        created_at: string;
        updated_at: string;
        applicant?: import("shared").Profile;
        assigned_admin?: import("shared").Profile;
        eligibility_result?: import("shared").EligibilityResult;
        credit_score?: import("shared").CreditScore;
    }>;
}
