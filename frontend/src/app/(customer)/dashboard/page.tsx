// frontend/src/app/(customer)/dashboard/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../features/auth/context/auth-context';
import { useToast } from '../../../components/ui/toast';
import { apiClient } from '../../../lib/api-client';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Skeleton } from '../../../components/ui/skeleton';
import { CreditScoreGauge } from '../../../components/shared/credit-score-gauge';
import { StatusBadge } from '../../../components/shared/status-badge';
import { ArrowRight, FileText, IndianRupee, ShieldCheck, Sparkles } from 'lucide-react';
import { LoanApplication, CreditScore } from 'shared';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [creditScore, setCreditScore] = useState<CreditScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [loansData, scoreData] = await Promise.all([
          apiClient.get<LoanApplication[]>('/loans'),
          apiClient.get<CreditScore | null>('/credit/score'),
        ]);
        setLoans(loansData);
        setCreditScore(scoreData);
      } catch (err: any) {
        toast(err.message || 'Failed to fetch dashboard data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [toast]);

  if (loading) {
    return (
      <div>
        <Skeleton height="40px" width="300px" style={{ marginBottom: '24px' }} />
        <div className="dashboard-grid" style={{ marginBottom: '32px' }}>
          <Skeleton height="120px" />
          <Skeleton height="120px" />
          <Skeleton height="120px" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          <Skeleton height="300px" />
          <Skeleton height="300px" />
        </div>
      </div>
    );
  }

  const activeLoans = loans.filter((l) => l.status === 'APPROVED' || l.status === 'DISBURSED');
  const pendingLoans = loans.filter((l) => l.status === 'SUBMITTED' || l.status === 'UNDER_REVIEW');
  const totalBorrowed = activeLoans.reduce((sum, l) => sum + Number(l.amount_requested), 0);

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 className="grad-text">Welcome back, {user?.full_name}!</h1>
        <p>Monitor your active applications and eligibility criteria</p>
      </div>

      {/* KPI Stats section */}
      <div className="dashboard-grid" style={{ marginBottom: '32px' }}>
        <Card className="glass-card flex-between" style={{ padding: '20px 24px' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', fontWeight: 600, textTransform: 'uppercase' }}>
              Total Borrowed Amount
            </span>
            <h2 style={{ fontSize: '1.75rem', marginTop: '6px', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
              <IndianRupee size={22} style={{ marginRight: '4px' }} />
              {totalBorrowed.toLocaleString()}
            </h2>
          </div>
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#34d399', padding: '12px', borderRadius: '12px' }}>
            <IndianRupee size={24} />
          </div>
        </Card>

        <Card className="glass-card flex-between" style={{ padding: '20px 24px' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', fontWeight: 600, textTransform: 'uppercase' }}>
              Active Applications
            </span>
            <h2 style={{ fontSize: '1.75rem', marginTop: '6px', fontWeight: 700 }}>
              {activeLoans.length}
            </h2>
          </div>
          <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', padding: '12px', borderRadius: '12px' }}>
            <FileText size={24} />
          </div>
        </Card>

        <Card className="glass-card flex-between" style={{ padding: '20px 24px' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', fontWeight: 600, textTransform: 'uppercase' }}>
              Pending Under Review
            </span>
            <h2 style={{ fontSize: '1.75rem', marginTop: '6px', fontWeight: 700 }}>
              {pendingLoans.length}
            </h2>
          </div>
          <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', padding: '12px', borderRadius: '12px' }}>
            <FileText size={24} />
          </div>
        </Card>
      </div>

      {/* Main Grid Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.1fr', gap: '24px' }} className="grid-cols-2">
        
        {/* Recent Applications Card */}
        <Card className="glass-card" style={{ padding: '24px 0' }}>
          <div style={{ padding: '0 24px 16px 24px', borderBottom: '1px solid hsl(var(--border))' }} className="flex-between">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={20} color="hsl(var(--primary))" />
              Recent Applications
            </h3>
            <Link href="/loans" style={{ fontSize: '0.825rem', color: 'hsl(var(--primary))', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>
          
          <div style={{ padding: '8px 24px 0 24px' }}>
            {loans.length === 0 ? (
              <div style={{ padding: '40px 0', textAlign: 'center' }}>
                <p style={{ fontSize: '0.875rem' }}>You have not submitted any applications yet.</p>
                <Link href="/loans/new">
                  <Button variant="outline" style={{ marginTop: '16px' }}>Apply for a Loan</Button>
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
                {loans.slice(0, 4).map((loan) => (
                  <div
                    key={loan.id}
                    className="flex-between"
                    style={{
                      padding: '12px 16px',
                      borderRadius: 'var(--radius)',
                      backgroundColor: 'hsl(var(--input))',
                      border: '1px solid hsl(var(--border))',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{loan.loan_type} LOAN</span>
                      <div style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', marginTop: '4px' }}>
                        Requested: ₹{Number(loan.amount_requested).toLocaleString()} | Tenure: {loan.tenure_months} months
                      </div>
                    </div>
                    <div className="flex-row-center" style={{ gap: '12px' }}>
                      <StatusBadge status={loan.status} />
                      <Link href={`/loans/${loan.id}`}>
                        <Button variant="outline" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Details</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Right side: Credit Score block */}
        <Card className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} color="hsl(var(--primary))" />
            Your Credit Score
          </h3>
          
          {creditScore ? (
            <div>
              <CreditScoreGauge score={creditScore.score} />
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <p style={{ fontSize: '0.8rem' }}>Last assessed: {new Date(creditScore.generated_at).toLocaleDateString()}</p>
                <Link href="/credit-score">
                  <Button variant="outline" style={{ marginTop: '12px', fontSize: '0.8rem' }}>Re-assess Score</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px' }}>
              <div style={{ color: '#fbbf24', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                <Sparkles size={36} />
              </div>
              <p style={{ fontSize: '0.875rem', marginBottom: '16px' }}>
                Generate your simulated credit bureau rating to check eligibility and interest terms.
              </p>
              <Link href="/credit-score">
                <Button>Assess My Profile</Button>
              </Link>
            </div>
          )}
        </Card>

      </div>
    </div>
  );
}
