// frontend/src/app/(customer)/loans/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '../../../../components/ui/toast';
import { apiClient } from '../../../../lib/api-client';
import { Card } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Skeleton } from '../../../../components/ui/skeleton';
import { StatusBadge } from '../../../../components/shared/status-badge';
import { ArrowLeft, Calendar, FileText, IndianRupee, Clock, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { LoanApplication } from 'shared';

export default function LoanDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [loan, setLoan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchLoanDetails = async () => {
    try {
      const data = await apiClient.get<any>(`/loans/${params.id}`);
      setLoan(data);
    } catch (err: any) {
      toast(err.message || 'Failed to load application details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoanDetails();
  }, [params.id, toast]);

  const handleSubmitDraft = async () => {
    setSubmitting(true);
    try {
      await apiClient.post(`/loans/${loan.id}/submit`);
      toast('Application submitted successfully!', 'success');
      fetchLoanDetails();
    } catch (err: any) {
      toast(err.message || 'Submission failed. Check profile completeness.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Skeleton height="400px" />;
  }

  if (!loan) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>Loan application not found.</p>
        <Link href="/loans">
          <Button variant="outline" style={{ marginTop: '16px' }}>Back to Applications</Button>
        </Link>
      </div>
    );
  }

  const showSubmit = loan.status === 'DRAFT' || loan.status === 'INFO_REQUESTED';

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Back button */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link href="/loans" style={{ display: 'flex', alignItems: 'center', color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem' }}>
          <ArrowLeft size={16} style={{ marginRight: '6px' }} /> Back to Applications
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '24px' }} className="grid-cols-2">
        <div>
          {/* Main Details Card */}
          <Card className="glass-card" style={{ marginBottom: '24px' }}>
            <div className="flex-between" style={{ borderBottom: '1px solid hsl(var(--border))', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))', fontWeight: 600 }}>
                  Application Reference
                </span>
                <h2 style={{ fontSize: '1.25rem', fontFamily: 'monospace', fontWeight: 700, marginTop: '2px' }}>
                  #{loan.id.substring(0, 13)}
                </h2>
              </div>
              <StatusBadge status={loan.status} />
            </div>

            {loan.status === 'INFO_REQUESTED' && (
              <div
                style={{
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  padding: '16px',
                  borderRadius: 'var(--radius)',
                  marginBottom: '20px',
                  display: 'flex',
                  gap: '10px',
                }}
              >
                <AlertTriangle color="hsl(var(--warning))" size={20} style={{ flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600 }}>Info Requested by Officer</h4>
                  <p style={{ fontSize: '0.8rem', marginTop: '4px', color: 'hsl(var(--muted-foreground))' }}>
                    Remarks: {loan.history?.filter((h: any) => h.to_status === 'INFO_REQUESTED').pop()?.remarks || 'Please update details.'}
                  </p>
                </div>
              </div>
            )}

            <div className="grid-cols-2" style={{ marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>Loan Type</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '4px' }}>{loan.loan_type}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>Requested Amount</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginTop: '4px', display: 'flex', alignItems: 'center' }}>
                  <IndianRupee size={16} />
                  {Number(loan.amount_requested).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="grid-cols-2" style={{ marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>Requested Tenure</span>
                <div style={{ fontSize: '1rem', fontWeight: 600, marginTop: '4px' }}>{loan.tenure_months} Months</div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>Purpose</span>
                <div style={{ fontSize: '0.9rem', marginTop: '4px' }}>{loan.purpose || 'Not specified'}</div>
              </div>
            </div>

            {showSubmit && (
              <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid hsl(var(--border))', paddingTop: '20px', marginTop: '20px' }}>
                <Button
                  onClick={handleSubmitDraft}
                  disabled={submitting}
                  style={{ flex: 1 }}
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            )}
          </Card>

          {/* Automated Assessment Results */}
          {loan.eligibility_result && (
            <Card className="glass-card" style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="hsl(var(--primary))" />
                Automated Eligibility Decision
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="flex-between">
                  <span style={{ fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))' }}>Engine Outcome</span>
                  <StatusBadge status={loan.eligibility_result.is_eligible ? 'APPROVED' : 'REJECTED'} />
                </div>
                <div className="flex-between">
                  <span style={{ fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))' }}>Max Permitted Amount</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>₹{Number(loan.eligibility_result.max_eligible_amount).toLocaleString()}</span>
                </div>
                <div className="flex-between">
                  <span style={{ fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))' }}>Recommended Term</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>{loan.eligibility_result.recommended_tenure} Months</span>
                </div>

                {!loan.eligibility_result.is_eligible && (
                  <div style={{ borderTop: '1px solid hsl(var(--border))', paddingTop: '12px', marginTop: '4px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'hsl(var(--destructive))' }}>ADJUSTMENT REQUIRED:</span>
                    <ul style={{ paddingLeft: '16px', listStyleType: 'disc', fontSize: '0.8rem', marginTop: '8px', color: 'hsl(var(--muted-foreground))' }}>
                      {loan.eligibility_result.rejection_reasons?.map((reason: string, i: number) => (
                        <li key={i}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Timeline Audits */}
        <div>
          <Card className="glass-card" style={{ height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="hsl(var(--primary))" />
              Application Timeline
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', paddingLeft: '24px', borderLeft: '2px solid hsl(var(--border))', marginLeft: '8px' }}>
              {loan.history && loan.history.length > 0 ? (
                loan.history.map((h: any, i: number) => (
                  <div key={h.id} style={{ position: 'relative' }}>
                    {/* Circle Node indicator on border line */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '-31px',
                        top: '4px',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: i === loan.history.length - 1 ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                        border: '2px solid hsl(var(--card))',
                      }}
                    />
                    <div>
                      <div className="flex-between">
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{h.to_status}</span>
                        <span style={{ fontSize: '0.7rem', color: 'hsl(var(--muted-foreground))' }}>
                          {new Date(h.changed_at).toLocaleDateString()}
                        </span>
                      </div>
                      {h.remarks && (
                        <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', marginTop: '4px', fontStyle: 'italic' }}>
                          "{h.remarks}"
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>
                  No timeline data recorded yet.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
