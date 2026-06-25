// backend/src/modules/admin/admin.service.ts
import { AdminRepository } from './admin.repository.js';
import { LoanRepository } from '../loan/loan.repository.js';
import { supabaseAdmin } from '../../config/supabase.js';
import { BadRequestError, NotFoundError } from '../../shared/errors/app-error.js';
import { LoanApplication, AuditLog } from 'shared';

export class AdminService {
  private adminRepository = new AdminRepository();
  private loanRepository = new LoanRepository();

  async listApplications(filters: {
    status?: string;
    loan_type?: string;
    search?: string;
    limit: number;
    page: number;
  }) {
    const offset = (filters.page - 1) * filters.limit;
    return this.adminRepository.listApplications({
      ...filters,
      offset,
    });
  }

  async getApplicationDetails(loanId: string): Promise<any> {
    const loan = await this.loanRepository.getLoanById(loanId);
    if (!loan) {
      throw new NotFoundError('Loan application not found');
    }

    // Fetch status history for audit trail
    const { data: history, error: historyError } = await supabaseAdmin
      .from('application_status_history')
      .select(`
        *,
        changed_by_profile:profiles!application_status_history_changed_by_fkey(*)
      `)
      .eq('application_id', loanId)
      .order('changed_at', { ascending: true });

    if (historyError) throw historyError;

    return {
      ...loan,
      history: history || [],
    };
  }

  async startReview(adminId: string, loanId: string, remarks?: string): Promise<LoanApplication> {
    const loan = await this.loanRepository.getLoanById(loanId);
    if (!loan) throw new NotFoundError('Loan application not found');

    if (loan.status !== 'SUBMITTED') {
      throw new BadRequestError(`Cannot start review. Application is in ${loan.status} status.`);
    }

    // Assign the admin
    await this.adminRepository.assignAdmin(loanId, adminId);

    // Update status to UNDER_REVIEW
    return this.loanRepository.updateLoanStatus(
      loanId,
      'SUBMITTED',
      'UNDER_REVIEW',
      adminId,
      remarks || 'Started application review'
    );
  }

  async approveApplication(adminId: string, loanId: string, remarks?: string): Promise<LoanApplication> {
    const loan = await this.loanRepository.getLoanById(loanId);
    if (!loan) throw new NotFoundError('Loan application not found');

    if (loan.status !== 'UNDER_REVIEW') {
      throw new BadRequestError(`Cannot approve application. Status must be UNDER_REVIEW (Current: ${loan.status}).`);
    }

    return this.loanRepository.updateLoanStatus(
      loanId,
      'UNDER_REVIEW',
      'APPROVED',
      adminId,
      remarks || 'Application approved'
    );
  }

  async rejectApplication(adminId: string, loanId: string, remarks: string): Promise<LoanApplication> {
    const loan = await this.loanRepository.getLoanById(loanId);
    if (!loan) throw new NotFoundError('Loan application not found');

    if (loan.status !== 'UNDER_REVIEW') {
      throw new BadRequestError(`Cannot reject application. Status must be UNDER_REVIEW (Current: ${loan.status}).`);
    }

    return this.loanRepository.updateLoanStatus(
      loanId,
      'UNDER_REVIEW',
      'REJECTED',
      adminId,
      remarks
    );
  }

  async disburseLoan(adminId: string, loanId: string, remarks?: string): Promise<LoanApplication> {
    const loan = await this.loanRepository.getLoanById(loanId);
    if (!loan) throw new NotFoundError('Loan application not found');

    if (loan.status !== 'APPROVED') {
      throw new BadRequestError(`Cannot disburse loan. Application must be APPROVED (Current: ${loan.status}).`);
    }

    return this.loanRepository.updateLoanStatus(
      loanId,
      'APPROVED',
      'DISBURSED',
      adminId,
      remarks || 'Loan disbursed'
    );
  }

  async getDashboardStats() {
    return this.adminRepository.getDashboardStats();
  }

  async getAuditLogs(limit: number = 50): Promise<AuditLog[]> {
    return this.adminRepository.getAuditLogs(limit);
  }
}
