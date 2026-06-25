// backend/src/modules/admin/admin.repository.ts
import { supabaseAdmin } from '../../config/supabase.js';
import { LoanApplication, AuditLog } from 'shared';

export class AdminRepository {
  async listApplications(filters: {
    status?: string;
    loan_type?: string;
    search?: string;
    limit: number;
    offset: number;
  }): Promise<{ applications: LoanApplication[]; count: number }> {
    let query = supabaseAdmin
      .from('loan_applications')
      .select(`
        *,
        applicant:profiles!loan_applications_applicant_id_fkey(*),
        eligibility_result:eligibility_results(*)
      `, { count: 'exact' });

    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.loan_type) {
      query = query.eq('loan_type', filters.loan_type);
    }

    if (filters.search) {
      // Search in full_name or email of profile
      // Note: PostgREST doesn't support complex OR filters across relations easily in a single string,
      // but we can query matching profiles first if search is present, then filter by applicant_id.
      const { data: profiles } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);

      const profileIds = (profiles || []).map((p) => p.id);
      if (profileIds.length > 0) {
        query = query.in('applicant_id', profileIds);
      } else {
        // Force no results if search term matched nothing
        query = query.eq('applicant_id', '00000000-0000-0000-0000-000000000000');
      }
    }

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(filters.offset, filters.offset + filters.limit - 1);

    if (error) throw error;
    return {
      applications: data || [],
      count: count || 0,
    };
  }

  async assignAdmin(applicationId: string, adminId: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('loan_applications')
      .update({ assigned_admin_id: adminId })
      .eq('id', applicationId);

    if (error) throw error;
  }

  async getDashboardStats() {
    const { data: loans, error } = await supabaseAdmin
      .from('loan_applications')
      .select('status, amount_requested');

    if (error) throw error;

    const stats = {
      totalApplications: loans.length,
      pendingReview: loans.filter((l) => l.status === 'SUBMITTED' || l.status === 'UNDER_REVIEW').length,
      approved: loans.filter((l) => l.status === 'APPROVED').length,
      disbursed: loans.filter((l) => l.status === 'DISBURSED').length,
      rejected: loans.filter((l) => l.status === 'REJECTED').length,
      totalDisbursedAmount: loans
        .filter((l) => l.status === 'DISBURSED')
        .reduce((sum, l) => sum + Number(l.amount_requested), 0),
    };

    return stats;
  }

  async getAuditLogs(limit: number = 50): Promise<AuditLog[]> {
    const { data, error } = await supabaseAdmin
      .from('audit_logs')
      .select(`
        *,
        actor_profile:profiles!audit_logs_actor_id_fkey(*)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }
}
