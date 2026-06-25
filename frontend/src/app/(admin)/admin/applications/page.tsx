// frontend/src/app/(admin)/admin/applications/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useToast } from '../../../../components/ui/toast';
import { apiClient } from '../../../../lib/api-client';
import { Card } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Select } from '../../../../components/ui/select';
import { Skeleton } from '../../../../components/ui/skeleton';
import { StatusBadge } from '../../../../components/shared/status-badge';
import { FileText, Search } from 'lucide-react';
import { LoanApplication } from 'shared';

export default function AdminApplicationsList() {
  const { toast } = useToast();
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters state
  const [status, setStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchApplications = async () => {
    setLoading(true);
    try {
      let url = `/admin/applications?limit=50`;
      if (status) url += `&status=${status}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
      
      const data = await apiClient.get<any>(url);
      setLoans(data.applications || []);
    } catch (err: any) {
      toast(err.message || 'Failed to retrieve applications', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [status, toast]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchApplications();
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 className="grad-text">Loan Applications Registry</h1>
        <p>Review, track and update status details for all incoming customer applications</p>
      </div>

      {/* Filter Section */}
      <Card className="glass-card" style={{ padding: '16px 24px', marginBottom: '24px' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'flex-end', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <Input
              type="text"
              label="Search Applicant Name / Email"
              placeholder="e.g. John Doe"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginBottom: 0 }}
            />
          </div>
          <div style={{ width: '220px' }}>
            <Select
              label="Filter by Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { value: '', label: 'All Statuses' },
                { value: 'DRAFT', label: 'Draft' },
                { value: 'SUBMITTED', label: 'Submitted' },
                { value: 'UNDER_REVIEW', label: 'Under Review' },
                { value: 'APPROVED', label: 'Approved' },
                { value: 'DISBURSED', label: 'Disbursed' },
                { value: 'REJECTED', label: 'Rejected' },
                { value: 'INFO_REQUESTED', label: 'Info Requested' },
              ]}
              style={{ marginBottom: 0 }}
            />
          </div>
          <Button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '42px' }}>
            <Search size={16} /> Search
          </Button>
        </form>
      </Card>

      {/* Table Section */}
      <Card className="glass-card" style={{ padding: 0 }}>
        {loading ? (
          <Skeleton height="300px" />
        ) : loans.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', color: 'hsl(var(--muted-foreground))' }}>
            <FileText size={48} style={{ marginBottom: '16px' }} />
            <h3>No applications found</h3>
            <p style={{ fontSize: '0.875rem', marginTop: '8px' }}>
              Try adjusting your query filter options or search term.
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Applicant Name</th>
                  <th>Loan Type</th>
                  <th>Amount Requested</th>
                  <th>Tenure</th>
                  <th>Status</th>
                  <th>Auto Eligibility</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan: any) => (
                  <tr key={loan.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{loan.applicant?.full_name || 'Guest User'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>{loan.applicant?.email}</div>
                    </td>
                    <td>{loan.loan_type}</td>
                    <td style={{ fontWeight: 600 }}>₹{Number(loan.amount_requested).toLocaleString()}</td>
                    <td>{loan.tenure_months} Months</td>
                    <td>
                      <StatusBadge status={loan.status} />
                    </td>
                    <td>
                      {loan.eligibility_result ? (
                        <span style={{ color: loan.eligibility_result.is_eligible ? 'hsl(var(--success))' : 'hsl(var(--destructive))', fontWeight: 600, fontSize: '0.8rem' }}>
                          {loan.eligibility_result.is_eligible ? 'PASSED' : 'FAILED'}
                        </span>
                      ) : (
                        <span style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.8rem' }}>Pending</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link href={`/admin/applications/${loan.id}`}>
                        <Button variant="outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                          Review
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
