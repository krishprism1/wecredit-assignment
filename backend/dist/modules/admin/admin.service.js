"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const admin_repository_js_1 = require("./admin.repository.js");
const loan_repository_js_1 = require("../loan/loan.repository.js");
const supabase_js_1 = require("../../config/supabase.js");
const app_error_js_1 = require("../../shared/errors/app-error.js");
class AdminService {
    adminRepository = new admin_repository_js_1.AdminRepository();
    loanRepository = new loan_repository_js_1.LoanRepository();
    async listApplications(filters) {
        const offset = (filters.page - 1) * filters.limit;
        return this.adminRepository.listApplications({
            ...filters,
            offset,
        });
    }
    async getApplicationDetails(loanId) {
        const loan = await this.loanRepository.getLoanById(loanId);
        if (!loan) {
            throw new app_error_js_1.NotFoundError('Loan application not found');
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
    async startReview(adminId, loanId, remarks) {
        const loan = await this.loanRepository.getLoanById(loanId);
        if (!loan)
            throw new app_error_js_1.NotFoundError('Loan application not found');
        if (loan.status !== 'SUBMITTED') {
            throw new app_error_js_1.BadRequestError(`Cannot start review. Application is in ${loan.status} status.`);
        }
        // Assign the admin
        await this.adminRepository.assignAdmin(loanId, adminId);
        return this.loanRepository.updateLoanStatus(loanId, 'SUBMITTED', 'UNDER_REVIEW', adminId, remarks || 'Started application review');
    }
    async approveApplication(adminId, loanId, remarks) {
        const loan = await this.loanRepository.getLoanById(loanId);
        if (!loan)
            throw new app_error_js_1.NotFoundError('Loan application not found');
        if (loan.status !== 'UNDER_REVIEW') {
            throw new app_error_js_1.BadRequestError(`Cannot approve application. Status must be UNDER_REVIEW (Current: ${loan.status}).`);
        }
        return this.loanRepository.updateLoanStatus(loanId, 'UNDER_REVIEW', 'APPROVED', adminId, remarks || 'Application approved');
    }
    async rejectApplication(adminId, loanId, remarks) {
        const loan = await this.loanRepository.getLoanById(loanId);
        if (!loan)
            throw new app_error_js_1.NotFoundError('Loan application not found');
        if (loan.status !== 'UNDER_REVIEW') {
            throw new app_error_js_1.BadRequestError(`Cannot reject application. Status must be UNDER_REVIEW (Current: ${loan.status}).`);
        }
        return this.loanRepository.updateLoanStatus(loanId, 'UNDER_REVIEW', 'REJECTED', adminId, remarks);
    }
    async disburseLoan(adminId, loanId, remarks) {
        const loan = await this.loanRepository.getLoanById(loanId);
        if (!loan)
            throw new app_error_js_1.NotFoundError('Loan application not found');
        if (loan.status !== 'APPROVED') {
            throw new app_error_js_1.BadRequestError(`Cannot disburse loan. Application must be APPROVED (Current: ${loan.status}).`);
        }
        return this.loanRepository.updateLoanStatus(loanId, 'APPROVED', 'DISBURSED', adminId, remarks || 'Loan disbursed');
    }
    async getDashboardStats() {
        return this.adminRepository.getDashboardStats();
    }
    async getAuditLogs(limit = 50) {
        return this.adminRepository.getAuditLogs(limit);
    }
}
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map