"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanRepository = void 0;
const supabase_js_1 = require("../../config/supabase.js");
class LoanRepository {
    async createLoan(userId, data) {
        const { data: result, error } = await supabase_js_1.supabaseAdmin
            .from('loan_applications')
            .insert({
            applicant_id: userId,
            status: 'DRAFT',
            ...data,
        })
            .select()
            .single();
        if (error)
            throw error;
        return result;
    }
    async getLoanById(id) {
        const { data: result, error } = await supabase_js_1.supabaseAdmin
            .from('loan_applications')
            .select(`
        *,
        applicant:profiles!loan_applications_applicant_id_fkey(*),
        assigned_admin:profiles!loan_applications_assigned_admin_id_fkey(*),
        eligibility_result:eligibility_results(*),
        credit_score:credit_scores(*)
      `)
            .eq('id', id)
            .maybeSingle();
        if (error)
            throw error;
        return result;
    }
    async updateLoan(id, data) {
        const { data: result, error } = await supabase_js_1.supabaseAdmin
            .from('loan_applications')
            .update(data)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        return result;
    }
    async listLoansByUserId(userId) {
        const { data: results, error } = await supabase_js_1.supabaseAdmin
            .from('loan_applications')
            .select(`
        *,
        eligibility_result:eligibility_results(*)
      `)
            .eq('applicant_id', userId)
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        return results || [];
    }
    async updateLoanStatus(id, fromStatus, toStatus, changedBy, remarks) {
        // 1. Update application status
        const { data: updatedLoan, error: updateError } = await supabase_js_1.supabaseAdmin
            .from('loan_applications')
            .update({ status: toStatus })
            .eq('id', id)
            .select()
            .single();
        if (updateError)
            throw updateError;
        // 2. Insert into application_status_history
        const { error: historyError } = await supabase_js_1.supabaseAdmin
            .from('application_status_history')
            .insert({
            application_id: id,
            from_status: fromStatus,
            to_status: toStatus,
            changed_by: changedBy,
            remarks: remarks,
        });
        if (historyError)
            throw historyError;
        // 3. Add to general audit logs
        const { error: logError } = await supabase_js_1.supabaseAdmin
            .from('audit_logs')
            .insert({
            actor_id: changedBy,
            action: `LOAN_STATUS_CHANGE_${toStatus}`,
            entity_type: 'LOAN_APPLICATION',
            entity_id: id,
            metadata: { from_status: fromStatus, to_status: toStatus, remarks },
        });
        if (logError)
            throw logError;
        return updatedLoan;
    }
}
exports.LoanRepository = LoanRepository;
//# sourceMappingURL=loan.repository.js.map