// frontend/src/app/(customer)/loans/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useToast } from '../../../components/ui/toast';
import { apiClient } from '../../../lib/api-client';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Skeleton } from '../../../components/ui/skeleton';
import { StatusBadge } from '../../../components/shared/status-badge';
import { FileText, Plus } from 'lucide-react';
import { LoanApplication } from 'shared';

export default function MyLoansPage() {
  const { toast } = useToast();
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const data = await apiClient.get<LoanApplication[]>('/loans');
        setLoans(data);
      } catch (err: any) {
        toast(err.message || 'Failed to retrieve applications', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, [toast]);

  if (loading) {
    return <Skeleton height="350px" />;
  }

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '32px' }}>
        <div>
          <h1 className="grad-text">My Applications</h1>
          <p>Track your submitted applications and historical eligibility checks</p>
        </div>
        <Link href="/loans/new">
          <Button style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} /> Apply Now
          </Button>
        </Link>
      </div>

      <Card className="glass-card" style={{ padding: 0 }}>
        {loans.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <FileText size={48} style={{ color: 'hsl(var(--muted-foreground))', marginBottom: '16px' }} />
            <h3>No applications found</h3>
            <p style={{ fontSize: '0.875rem', marginTop: '8px', color: 'hsl(var(--muted-foreground))', marginBottom: '24px' }}>
              You haven't initiated any loan applications yet.
            </p>
            <Link href="/loans/new">
              <Button>Start Your First Application</Button>
            </Link>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Application ID</th>
                  <th>Loan Type</th>
                  <th>Amount Requested</th>
                  <th>Tenure</th>
                  <th>Status</th>
                  <th>Date Initiated</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr key={loan.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                      {loan.id.substring(0, 8)}...
                    </td>
                    <td style={{ fontWeight: 600 }}>{loan.loan_type}</td>
                    <td>₹{Number(loan.amount_requested).toLocaleString()}</td>
                    <td>{loan.tenure_months} Months</td>
                    <td>
                      <StatusBadge status={loan.status} />
                    </td>
                    <td>{new Date(loan.created_at).toLocaleDateString()}</td>
                    <td style={{ textAlign: 'right' }}>
                      <Link href={`/loans/${loan.id}`}>
                        <Button variant="outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                          View Details
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
