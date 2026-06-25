// frontend/src/app/(admin)/admin/applications/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '../../../../../components/ui/toast';
import { apiClient } from '../../../../../lib/api-client';
import { Card } from '../../../../../components/ui/card';
import { Button } from '../../../../../components/ui/button';
import { Input } from '../../../../../components/ui/input';
import { Skeleton } from '../../../../../components/ui/skeleton';
import { StatusBadge } from '../../../../../components/shared/status-badge';
import { CreditScoreGauge } from '../../../../../components/shared/credit-score-gauge';
import { ArrowLeft, User, Briefcase, MapPin, ShieldCheck, Clock, FileText, CheckCircle, XCircle } from 'lucide-react';

export default function AdminApplicationReview() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [loan, setLoan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [remarks, setRemarks] = useState('');

  const fetchApplicationDetails = async () => {
    try {
      const data = await apiClient.get<any>(`/admin/applications/${params.id}`);
      setLoan(data);
    } catch (err: any) {
      toast(err.message || 'Failed to retrieve application details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicationDetails();
  }, [params.id, toast]);

  const handleAction = async (endpoint: 'review' | 'approve' | 'reject' | 'disburse') => {
    if (endpoint === 'reject' && !remarks) {
      toast('Please provide a reason remarks for rejection', 'error');
      return;
    }

    setActionLoading(true);
    try {
      await apiClient.post(`/admin/applications/${loan.id}/${endpoint}`, { remarks });
      toast(`Application successfully moved to status: ${endpoint === 'review' ? 'UNDER REVIEW' : endpoint.toUpperCase()}`, 'success');
      setRemarks('');
      fetchApplicationDetails();
    } catch (err: any) {
      toast(err.message || 'Action failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <Skeleton height="400px" />;
  }

  if (!loan) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>Application details not found.</p>
        <Link href="/admin/applications">
          <Button variant="outline" style={{ marginTop: '16px' }}>Back to Registry</Button>
        </Link>
      </div>
    );
  }

  // Determine active action steps
  const canStartReview = loan.status === 'SUBMITTED';
  const canApproveOrReject = loan.status === 'UNDER_REVIEW';
  const canDisburse = loan.status === 'APPROVED';

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Back Link */}
      <div style={{ marginBottom: '24px' }}>
        <Link href="/admin/applications" style={{ display: 'flex', alignItems: 'center', color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem' }}>
          <ArrowLeft size={16} style={{ marginRight: '6px' }} /> Back to Registry
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }} className="grid-cols-2">
        <div>
          {/* Main info card */}
          <Card className="glass-card" style={{ marginBottom: '32px' }}>
            <div className="flex-between" style={{ borderBottom: '1px solid hsl(var(--border))', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))', fontWeight: 600 }}>
                  Loan Reference
                </span>
                <h2 style={{ fontSize: '1.25rem', fontFamily: 'monospace', fontWeight: 700, marginTop: '2px' }}>
                  #{loan.id}
                </h2>
              </div>
              <StatusBadge status={loan.status} />
            </div>

            <div className="grid-cols-2" style={{ marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>Requested Loan Type</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '4px' }}>{loan.loan_type}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>Requested Amount</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '4px' }}>
                  ₹{Number(loan.amount_requested).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="grid-cols-2">
              <div>
                <span style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>Requested Tenure</span>
                <div style={{ fontSize: '1rem', fontWeight: 600, marginTop: '4px' }}>{loan.tenure_months} Months</div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>Purpose</span>
                <div style={{ fontSize: '0.9rem', marginTop: '4px' }}>{loan.purpose || 'Not specified'}</div>
              </div>
            </div>
          </Card>

          {/* User Applicant details */}
          <Card className="glass-card" style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="hsl(var(--primary))" />
              Applicant Profile & Contact Details
            </h3>
            <div className="grid-cols-2" style={{ marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>Full Name</span>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '2px' }}>{loan.applicant?.full_name}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>Email Address</span>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '2px' }}>{loan.applicant?.email}</div>
              </div>
            </div>
            <div className="grid-cols-2" style={{ marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>Phone Number</span>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '2px' }}>{loan.applicant?.phone || 'N/A'}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>Date of Birth</span>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '2px' }}>{loan.applicant?.date_of_birth || 'N/A'}</div>
              </div>
            </div>
          </Card>

          {/* User Address & Employment */}
          <div className="grid-cols-2" style={{ marginBottom: '32px' }}>
            {/* Address */}
            <Card className="glass-card" style={{ height: '100%' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} color="hsl(var(--primary))" />
                Current Address
              </h3>
              {loan.applicant?.addresses && loan.applicant.addresses.length > 0 ? (
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{loan.applicant.addresses[0].address_line_1}</div>
                  <div style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', marginTop: '4px' }}>
                    {loan.applicant.addresses[0].city}, {loan.applicant.addresses[0].state} - {loan.applicant.addresses[0].pincode}
                  </div>
                </div>
              ) : (
                <span style={{ fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))' }}>No address record provided.</span>
              )}
            </Card>

            {/* Employment */}
            <Card className="glass-card" style={{ height: '100%' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Briefcase size={16} color="hsl(var(--primary))" />
                Employment & Income
              </h3>
              {loan.applicant?.employment ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="flex-between">
                    <span style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>Employer</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{loan.applicant.employment.employer_name}</span>
                  </div>
                  <div className="flex-between">
                    <span style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>Designation</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{loan.applicant.employment.designation}</span>
                  </div>
                  <div className="flex-between">
                    <span style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>Monthly Income</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'hsl(var(--primary))' }}>
                      ₹{Number(loan.applicant.employment.monthly_income).toLocaleString()}
                    </span>
                  </div>
                </div>
              ) : (
                <span style={{ fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))' }}>No employment record provided.</span>
              )}
            </Card>
          </div>

          {/* Decision Timeline History */}
          <Card className="glass-card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="hsl(var(--primary))" />
              Decision Audit History
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingLeft: '20px', borderLeft: '2px solid hsl(var(--border))', marginLeft: '6px' }}>
              {loan.history?.map((h: any) => (
                <div key={h.id} style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '-27px', top: '5px', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'hsl(var(--border))', border: '2px solid hsl(var(--card))' }} />
                  <div className="flex-between">
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{h.from_status} ➔ {h.to_status}</span>
                    <span style={{ fontSize: '0.7rem', color: 'hsl(var(--muted-foreground))' }}>
                      {new Date(h.changed_at).toLocaleString()} | Officer: {h.changed_by_profile?.full_name || 'System'}
                    </span>
                  </div>
                  {h.remarks && (
                    <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', marginTop: '4px', fontStyle: 'italic' }}>
                      "{h.remarks}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right side: Action panel and eligibility */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Credit Bureau Details */}
          <Card className="glass-card">
            <h3 style={{ fontSize: '1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={16} color="hsl(var(--primary))" />
              Credit Bureau Simulation
            </h3>
            {loan.applicant?.credit_score ? (
              <CreditScoreGauge score={loan.applicant.credit_score.score} />
            ) : (
              <div style={{ textAlign: 'center', padding: '16px', color: 'hsl(var(--muted-foreground))', fontSize: '0.8rem' }}>
                No score simulated for user.
              </div>
            )}
          </Card>

          {/* Eligibility Engine Outcome */}
          {loan.eligibility_result && (
            <Card className="glass-card">
              <h3 style={{ fontSize: '1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="hsl(var(--primary))" />
                Automated Rules Recommendation
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="flex-between">
                  <span style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>Result</span>
                  <StatusBadge status={loan.eligibility_result.is_eligible ? 'APPROVED' : 'REJECTED'} />
                </div>
                <div className="flex-between">
                  <span style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>Max Limit Allowed</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>₹{Number(loan.eligibility_result.max_eligible_amount).toLocaleString()}</span>
                </div>
                <div className="flex-between">
                  <span style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>Rec Term</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{loan.eligibility_result.recommended_tenure} Months</span>
                </div>

                {!loan.eligibility_result.is_eligible && (
                  <div style={{ marginTop: '8px', borderTop: '1px solid hsl(var(--border))', paddingTop: '8px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'hsl(var(--destructive))' }}>FAIL REASONS:</span>
                    <ul style={{ paddingLeft: '14px', listStyleType: 'disc', fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', marginTop: '6px' }}>
                      {loan.eligibility_result.rejection_reasons?.map((r: string, idx: number) => (
                        <li key={idx} style={{ marginBottom: '4px' }}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Action dashboard panel */}
          <Card className="glass-card">
            <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Workflow Actions</h3>
            
            {canStartReview && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>
                  This application has been submitted by the client. Claim ownership to start detailed profile verification.
                </p>
                <Button onClick={() => handleAction('review')} disabled={actionLoading} style={{ width: '100%' }}>
                  Claim & Start Review
                </Button>
              </div>
            )}

            {canApproveOrReject && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', display: 'block', marginBottom: '6px' }}>
                    Officer Review Remarks / Rejection Reason
                  </label>
                  <textarea
                    rows={4}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter review remarks here..."
                    style={{
                      width: '100%',
                      backgroundColor: 'hsl(var(--input))',
                      border: '1px solid hsl(var(--border))',
                      color: 'hsl(var(--foreground))',
                      borderRadius: 'var(--radius)',
                      padding: '10px',
                      fontSize: '0.85rem',
                      outline: 'none',
                      fontFamily: 'inherit',
                      resize: 'none',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Button
                    onClick={() => handleAction('reject')}
                    disabled={actionLoading}
                    variant="danger"
                    style={{ flex: 1 }}
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleAction('approve')}
                    disabled={actionLoading}
                    style={{ flex: 1 }}
                  >
                    Approve
                  </Button>
                </div>
              </div>
            )}

            {canDisburse && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>
                  This application has been approved. Execute actual funds transfer and mark loan status as disbursed.
                </p>
                <Button onClick={() => handleAction('disburse')} disabled={actionLoading} style={{ width: '100%' }}>
                  Mark as Disbursed
                </Button>
              </div>
            )}

            {!canStartReview && !canApproveOrReject && !canDisburse && (
              <p style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', textAlign: 'center' }}>
                No actions available for status: <strong>{loan.status}</strong>
              </p>
            )}
          </Card>

        </div>
      </div>
    </div>
  );
}
