// backend/src/modules/loan/loan.service.ts
import { LoanRepository } from './loan.repository.js';
import { CreditService } from '../credit/credit.service.js';
import { EligibilityService } from '../eligibility/eligibility.service.js';
import { supabaseAdmin } from '../../config/supabase.js';
import { BadRequestError, NotFoundError, ForbiddenError } from '../../shared/errors/app-error.js';
import { LoanApplication, LoanStatus } from 'shared';

export class LoanService {
  private loanRepository = new LoanRepository();
  private creditService = new CreditService();
  private eligibilityService = new EligibilityService();

  async createLoan(userId: string, data: Omit<LoanApplication, 'id' | 'applicant_id' | 'status' | 'assigned_admin_id' | 'created_at' | 'updated_at'>) {
    return this.loanRepository.createLoan(userId, data);
  }

  async getLoan(userId: string, loanId: string, isAdmin: boolean = false) {
    const loan = await this.loanRepository.getLoanById(loanId);
    if (!loan) {
      throw new NotFoundError('Loan application not found');
    }

    if (!isAdmin && loan.applicant_id !== userId) {
      throw new ForbiddenError('Access denied: You do not own this application');
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

  async listLoans(userId: string) {
    return this.loanRepository.listLoansByUserId(userId);
  }

  async updateLoan(userId: string, loanId: string, data: Partial<Omit<LoanApplication, 'id' | 'applicant_id' | 'status' | 'created_at' | 'updated_at'>>) {
    const loan = await this.getLoan(userId, loanId);

    // Can only edit if in DRAFT or INFO_REQUESTED status
    if (loan.status !== 'DRAFT' && loan.status !== 'INFO_REQUESTED') {
      throw new BadRequestError(`Cannot edit application in ${loan.status} status`);
    }

    return this.loanRepository.updateLoan(loanId, data);
  }

  async submitLoan(userId: string, loanId: string) {
    console.log("jadu11111111")
    const loan = await this.getLoan(userId, loanId);
console.log("jadu222222")
    if (loan.status !== 'DRAFT' && loan.status !== 'INFO_REQUESTED') {
      throw new BadRequestError(`Cannot submit application in ${loan.status} status`);
    }

    // 1. Validate complete profile details
    const { data: profile } = await supabaseAdmin.from('profiles').select('*').eq('id', userId).single();
    if (!profile?.full_name || !profile?.phone || !profile?.date_of_birth) {
      throw new BadRequestError('Profile details (Name, Phone, Date of Birth) must be fully filled before submission');
    }

    // 2. Validate complete address details
    const { data: addresses } = await supabaseAdmin.from('addresses').select('*').eq('profile_id', userId);
    if (!addresses || addresses.length === 0) {
      throw new BadRequestError('At least one address must be added before submission');
    }

    // 3. Validate employment details
    const { data: employment } = await supabaseAdmin.from('employment_details').select('*').eq('profile_id', userId).maybeSingle();
    if (!employment) {
      throw new BadRequestError('Employment details must be filled before submission');
    }

    // 4. Generate credit score if missing
    let creditScore = await this.creditService.getLatestScore(userId);
    if (!creditScore) {
      creditScore = await this.creditService.generateScore(userId);
    }

    console.log("hello111111111111")
    // 5. Submit application (Update status)
    const updatedLoan = await this.loanRepository.updateLoanStatus(
      loanId,
      loan.status,
      'SUBMITTED',
      userId,
      'Application submitted by applicant'
    );

    console.log("hello2222222222222")

    // 6. Execute eligibility engine check
    await this.eligibilityService.runAssessment(loanId);
    console.log("hello333333333")

    return this.getLoan(userId, loanId);
  }
}
