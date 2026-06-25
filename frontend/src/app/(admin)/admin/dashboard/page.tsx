// frontend/src/app/(admin)/admin/dashboard/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useToast } from '../../../../components/ui/toast';
import { apiClient } from '../../../../lib/api-client';
import { Card } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Skeleton } from '../../../../components/ui/skeleton';
import { StatusBadge } from '../../../../components/shared/status-badge';
import { FileText, IndianRupee, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { LoanApplication } from 'shared';

interface Stats {
  totalApplications: number;
  pendingReview: number;
  approved: number;
  disbursed: number;
  rejected: number;
  totalDisbursedAmount: number;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [stats, setStats] = useState<Stats | null>(null);
  const [pendingLoans, setPendingLoans] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminDashboard = async () => {
      try {
        const statsData = await apiClient.get<Stats>('/admin/dashboard');
        setStats(statsData);

        // Fetch applications awaiting review
        const apps = await apiClient.get<{ applications: LoanApplication[] }>('/admin/applications?status=SUBMITTED&limit=5');
        setPendingLoans(apps.applications || []);
      } catch (err: any) {
        toast(err.message || 'Failed to fetch admin statistics', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminDashboard();
  }, [toast]);

  if (loading) {
    return (
      <div>
        <Skeleton height="40px" width="300px" style={{ marginBottom: '24px' }} />
        <div className="dashboard-grid" style={{ marginBottom: '32px' }}>
          <Skeleton height="100px" />
          <Skeleton height="100px" />
          <Skeleton height="100px" />
        </div>
        <Skeleton height="250px" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 className="grad-text">Admin Control Panel</h1>
        <p>Monitor applications flow, system metrics, and officer action audit trails</p>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="dashboard-grid" style={{ marginBottom: '32px' }}>
          <Card className="glass-card flex-between" style={{ padding: '20px 24px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', fontWeight: 600, textTransform: 'uppercase' }}>
                Total Disbursed Volume
              </span>
              <h2 style={{ fontSize: '1.75rem', marginTop: '6px', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                <IndianRupee size={22} style={{ marginRight: '4px' }} />
                {stats.totalDisbursedAmount.toLocaleString()}
              </h2>
            </div>
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#34d399', padding: '12px', borderRadius: '12px' }}>
              <IndianRupee size={24} />
            </div>
          </Card>

          <Card className="glass-card flex-between" style={{ padding: '20px 24px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', fontWeight: 600, textTransform: 'uppercase' }}>
                Awaiting Officer Review
              </span>
              <h2 style={{ fontSize: '1.75rem', marginTop: '6px', fontWeight: 700 }}>
                {stats.pendingReview}
              </h2>
            </div>
            <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', padding: '12px', borderRadius: '12px' }}>
              <Clock size={24} />
            </div>
          </Card>

          <Card className="glass-card flex-between" style={{ padding: '20px 24px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', fontWeight: 600, textTransform: 'uppercase' }}>
                Approved & Awaiting Disburse
              </span>
              <h2 style={{ fontSize: '1.75rem', marginTop: '6px', fontWeight: 700 }}>
                {stats.approved}
              </h2>
            </div>
            <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', padding: '12px', borderRadius: '12px' }}>
              <CheckCircle size={24} />
            </div>
          </Card>
        </div>
      )}

      {/* Awaiting Action Applications List */}
      <Card className="glass-card" style={{ padding: 0 }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid hsl(var(--border))' }} className="flex-between">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={20} color="hsl(var(--primary))" />
            Applications Awaiting Initial Review
          </h3>
          <Link href="/admin/applications">
            <Button variant="outline" style={{ fontSize: '0.8rem' }}>View All Applications</Button>
          </Link>
        </div>

        <div style={{ padding: '12px 24px 24px 24px' }}>
          {pendingLoans.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'hsl(var(--muted-foreground))' }}>
              <CheckCircle size={32} style={{ color: 'hsl(var(--success))', marginBottom: '12px' }} />
              <p style={{ fontSize: '0.875rem' }}>Inbox cleared! No applications awaiting review.</p>
            </div>
          ) : (
            <div className="table-wrapper" style={{ marginTop: '12px' }}>
              <table className="table-base">
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Loan Type</th>
                    <th>Requested Amount</th>
                    <th>Status</th>
                    <th>Date Submitted</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingLoans.map((loan: any) => (
                    <tr key={loan.id}>
                      <td style={{ fontWeight: 600 }}>{loan.applicant?.full_name || 'Guest Applicant'}</td>
                      <td>{loan.loan_type}</td>
                      <td>₹{Number(loan.amount_requested).toLocaleString()}</td>
                      <td>
                        <StatusBadge status={loan.status} />
                      </td>
                      <td>{new Date(loan.created_at).toLocaleDateString()}</td>
                      <td style={{ textAlign: 'right' }}>
                        <Link href={`/admin/applications/${loan.id}`}>
                          <Button style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Review Details</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
