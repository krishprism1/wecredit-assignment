import { supabaseAdmin } from '../../config/supabase.js';
import { LoanApplication, LoanStatus } from 'shared';

export class LoanRepository {
  async createLoan(userId: string, data: Omit<LoanApplication, 'id' | 'applicant_id' | 'status' | 'assigned_admin_id' | 'created_at' | 'updated_at'>): Promise<LoanApplication> {
    const { data: result, error } = await supabaseAdmin
      .from('loan_applications')
      .insert({
        applicant_id: userId,
        status: 'DRAFT',
        ...data,
      })
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  async getLoanById(id: string): Promise<LoanApplication | null> {
    const { data: result, error } = await supabaseAdmin
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

    if (error) throw error;
    return result;
  }

  async updateLoan(id: string, data: Partial<Omit<LoanApplication, 'id' | 'applicant_id' | 'status' | 'created_at' | 'updated_at'>>): Promise<LoanApplication> {
    const { data: result, error } = await supabaseAdmin
      .from('loan_applications')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  async listLoansByUserId(userId: string): Promise<LoanApplication[]> {
    const { data: results, error } = await supabaseAdmin
      .from('loan_applications')
      .select(`
        *,
        eligibility_result:eligibility_results(*)
      `)
      .eq('applicant_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return results || [];
  }

  async updateLoanStatus(
    id: string,
    fromStatus: LoanStatus,
    toStatus: LoanStatus,
    changedBy: string | null,
    remarks: string | null
  ): Promise<LoanApplication> {
    // 1. Update application status
    const { data: updatedLoan, error: updateError } = await supabaseAdmin
      .from('loan_applications')
      .update({ status: toStatus })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    // 2. Insert into application_status_history
    const { error: historyError } = await supabaseAdmin
      .from('application_status_history')
      .insert({
        application_id: id,
        from_status: fromStatus,
        to_status: toStatus,
        changed_by: changedBy,
        remarks: remarks,
      });

    if (historyError) throw historyError;

    // 3. Add to general audit logs
    const { error: logError } = await supabaseAdmin
      .from('audit_logs')
      .insert({
        actor_id: changedBy,
        action: `LOAN_STATUS_CHANGE_${toStatus}`,
        entity_type: 'LOAN_APPLICATION',
        entity_id: id,
        metadata: { from_status: fromStatus, to_status: toStatus, remarks },
      });

    if (logError) throw logError;

    return updatedLoan;
  }
}
