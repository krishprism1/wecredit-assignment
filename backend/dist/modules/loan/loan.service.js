"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanService = void 0;
const loan_repository_js_1 = require("./loan.repository.js");
const credit_service_js_1 = require("../credit/credit.service.js");
const eligibility_service_js_1 = require("../eligibility/eligibility.service.js");
const supabase_js_1 = require("../../config/supabase.js");
const app_error_js_1 = require("../../shared/errors/app-error.js");
class LoanService {
    loanRepository = new loan_repository_js_1.LoanRepository();
    creditService = new credit_service_js_1.CreditService();
    eligibilityService = new eligibility_service_js_1.EligibilityService();
    async createLoan(userId, data) {
        return this.loanRepository.createLoan(userId, data);
    }
    async getLoan(userId, loanId, isAdmin = false) {
        const loan = await this.loanRepository.getLoanById(loanId);
        if (!loan) {
            throw new app_error_js_1.NotFoundError('Loan application not found');
        }
        if (!isAdmin && loan.applicant_id !== userId) {
            throw new app_error_js_1.ForbiddenError('Access denied: You do not own this application');
        }
        // Fetch status history for audit trail
        const { data: history, error: historyError } = await supabase_js_1.supabaseAdmin
            .from('application_status_history')
            .select(`
        *,
        changed_by_profile:profiles!application_status_history_changed_by_fkey(*)
      `)
            .eq('application_id', loanId)
            .order('changed_at', { ascending: true });
        if (historyError)
            throw historyError;
        return {
            ...loan,
            history: history || [],
        };
    }
    async listLoans(userId) {
        return this.loanRepository.listLoansByUserId(userId);
    }
    async updateLoan(userId, loanId, data) {
        const loan = await this.getLoan(userId, loanId);
        // Can only edit if in DRAFT or INFO_REQUESTED status
        if (loan.status !== 'DRAFT' && loan.status !== 'INFO_REQUESTED') {
            throw new app_error_js_1.BadRequestError(`Cannot edit application in ${loan.status} status`);
        }
        return this.loanRepository.updateLoan(loanId, data);
    }
    async submitLoan(userId, loanId) {
        console.log("jadu11111111");
        const loan = await this.getLoan(userId, loanId);
        console.log("jadu222222");
        if (loan.status !== 'DRAFT' && loan.status !== 'INFO_REQUESTED') {
            throw new app_error_js_1.BadRequestError(`Cannot submit application in ${loan.status} status`);
        }
        // 1. Validate complete profile details
        const { data: profile } = await supabase_js_1.supabaseAdmin.from('profiles').select('*').eq('id', userId).single();
        if (!profile?.full_name || !profile?.phone || !profile?.date_of_birth) {
            throw new app_error_js_1.BadRequestError('Profile details (Name, Phone, Date of Birth) must be fully filled before submission');
        }
        // 2. Validate complete address details
        const { data: addresses } = await supabase_js_1.supabaseAdmin.from('addresses').select('*').eq('profile_id', userId);
        if (!addresses || addresses.length === 0) {
            throw new app_error_js_1.BadRequestError('At least one address must be added before submission');
        }
        // 3. Validate employment details
        const { data: employment } = await supabase_js_1.supabaseAdmin.from('employment_details').select('*').eq('profile_id', userId).maybeSingle();
        if (!employment) {
            throw new app_error_js_1.BadRequestError('Employment details must be filled before submission');
        }
        // 4. Generate credit score if missing
        let creditScore = await this.creditService.getLatestScore(userId);
        if (!creditScore) {
            creditScore = await this.creditService.generateScore(userId);
        }
        console.log("hello111111111111");
        // 5. Submit application (Update status)
        const updatedLoan = await this.loanRepository.updateLoanStatus(loanId, loan.status, 'SUBMITTED', userId, 'Application submitted by applicant');
        console.log("hello2222222222222");
        // 6. Execute eligibility engine check
        await this.eligibilityService.runAssessment(loanId);
        console.log("hello333333333");
        return this.getLoan(userId, loanId);
    }
}
exports.LoanService = LoanService;
//# sourceMappingURL=loan.service.js.map