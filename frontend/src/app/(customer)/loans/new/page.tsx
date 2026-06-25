// frontend/src/app/(customer)/loans/new/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '../../../../components/ui/toast';
import { apiClient } from '../../../../lib/api-client';
import { Card } from '../../../../components/ui/card';
import { Input } from '../../../../components/ui/input';
import { Select } from '../../../../components/ui/select';
import { Button } from '../../../../components/ui/button';
import { Skeleton } from '../../../../components/ui/skeleton';
import { StatusBadge } from '../../../../components/shared/status-badge';
import { ArrowLeft, CheckCircle2, XCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import { LoanApplication } from 'shared';

export default function NewLoanApplication() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  // Form States
  const [loanType, setLoanType] = useState('PERSONAL');
  const [amount, setAmount] = useState('');
  const [tenure, setTenure] = useState('');
  const [purpose, setPurpose] = useState('');

  // Loaded Details
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [profileComplete, setProfileComplete] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [eligibilityOutcome, setEligibilityOutcome] = useState<any>(null);

  useEffect(() => {
    const checkProfileData = async () => {
      try {
        const profile = await apiClient.get<any>('/profile');
        setProfileData(profile);

        const hasProfile = profile.full_name && profile.phone && profile.date_of_birth;
        const hasAddress = profile.addresses && profile.addresses.length > 0;
        const hasEmployment = profile.employment;

        setProfileComplete(!!(hasProfile && hasAddress && hasEmployment));
      } catch (err: any) {
        toast('Failed to load profile details for verification', 'error');
      } finally {
        setProfileLoading(false);
      }
    };
    checkProfileData();
  }, [toast]);

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !tenure) {
      toast('Please enter the loan amount and tenure', 'error');
      return;
    }

    setLoading(true);
    try {
      const loan = await apiClient.post<LoanApplication>('/loans', {
        loan_type: loanType,
        amount_requested: Number(amount),
        tenure_months: Number(tenure),
        purpose: purpose || undefined,
      });
      setApplicationId(loan.id);
      toast('Loan application draft created!', 'success');
      setStep(2);
    } catch (err: any) {
      toast(err.message || 'Failed to create loan draft', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!applicationId) return;
    setLoading(true);
    try {
      const result = await apiClient.post<LoanApplication>(`/loans/${applicationId}/submit`);
      setEligibilityOutcome(result.eligibility_result);
      toast('Application submitted successfully!', 'success');
      setStep(3);
    } catch (err: any) {
      toast(err.message || 'Failed to submit application', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return <Skeleton height="400px" />;
  }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={() => {
            if (step === 2) setStep(1);
            else router.push('/dashboard');
          }}
          style={{ background: 'none', border: 'none', color: 'hsl(var(--muted-foreground))', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          disabled={step === 3}
        >
          <ArrowLeft size={18} style={{ marginRight: '6px' }} /> Back
        </button>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }} className="grad-text">Apply for a New Loan</h1>
      </div>

      {/* Step Indicator */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '15px', left: '10%', right: '10%', height: '2px', backgroundColor: 'hsl(var(--border))', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '15px', left: '10%', width: step === 2 ? '40%' : step === 3 ? '80%' : '0%', height: '2px', backgroundColor: 'hsl(var(--primary))', zIndex: 0, transition: 'width 0.3s ease' }} />

        {[
          { num: 1, label: 'Configure Loan' },
          { num: 2, label: 'Verify Profile' },
          { num: 3, label: 'Eligibility Outcome' },
        ].map((s) => (
          <div key={s.num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, width: '30%' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: step >= s.num ? 'hsl(var(--primary))' : 'hsl(var(--card))',
                border: `2px solid ${step >= s.num ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                color: step >= s.num ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            >
              {s.num}
            </div>
            <span style={{ fontSize: '0.75rem', marginTop: '8px', color: step >= s.num ? '#fff' : 'hsl(var(--muted-foreground))', fontWeight: 500 }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Step 1 Form */}
      {step === 1 && (
        <Card className="glass-card">
          <form onSubmit={handleStep1Submit}>
            <Select
              label="Loan Type"
              value={loanType}
              onChange={(e) => setLoanType(e.target.value)}
              options={[
                { value: 'PERSONAL', label: 'Personal Loan' },
                { value: 'HOME', label: 'Home Loan' },
                { value: 'CAR', label: 'Car Loan' },
                { value: 'EDUCATION', label: 'Education Loan' },
                { value: 'BUSINESS', label: 'Business Loan' },
              ]}
              required
            />
            <div className="grid-cols-2">
              <Input
                type="number"
                label="Requested Amount (INR)"
                placeholder="500000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <Input
                type="number"
                label="Tenure (Months)"
                placeholder="24"
                value={tenure}
                onChange={(e) => setTenure(e.target.value)}
                required
              />
            </div>
            <Input
              type="text"
              label="Purpose of Loan"
              placeholder="Medical expenses, tuition fees, property purchase, etc."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
            <Button type="submit" style={{ width: '100%', marginTop: '16px', padding: '12px' }} disabled={loading}>
              {loading ? 'Creating application draft...' : 'Save Draft & Proceed'}
            </Button>
          </form>
        </Card>
      )}

      {/* Step 2 Form */}
      {step === 2 && (
        <Card className="glass-card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Verify Your Profile Information</h3>
          <p style={{ fontSize: '0.85rem', marginBottom: '24px' }}>
            We'll fetch details below from your profile to assess your credit and loan eligibility. Make sure they are correct.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
            <div className="flex-between" style={{ paddingBottom: '12px', borderBottom: '1px solid hsl(var(--border))' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>Full Name</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '4px' }}>{profileData?.full_name || 'Not provided'}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>Phone</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '4px' }}>{profileData?.phone || 'Not provided'}</div>
              </div>
            </div>

            <div className="flex-between" style={{ paddingBottom: '12px', borderBottom: '1px solid hsl(var(--border))' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>Date of Birth</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '4px' }}>{profileData?.date_of_birth || 'Not provided'}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>Monthly Income</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '4px' }}>
                  {profileData?.employment ? `₹${Number(profileData.employment.monthly_income).toLocaleString()}` : 'Not provided'}
                </div>
              </div>
            </div>

            <div style={{ paddingBottom: '12px', borderBottom: '1px solid hsl(var(--border))' }}>
              <span style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>Current Address</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '4px' }}>
                {profileData?.addresses && profileData.addresses.length > 0 ? (
                  `${profileData.addresses[0].address_line_1}, ${profileData.addresses[0].city}, ${profileData.addresses[0].state} - ${profileData.addresses[0].pincode}`
                ) : (
                  'Not provided'
                )}
              </div>
            </div>
          </div>

          {!profileComplete ? (
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: 'var(--radius)',
                padding: '16px',
                marginBottom: '20px',
                display: 'flex',
                gap: '12px',
              }}
            >
              <AlertTriangle color="hsl(var(--destructive))" size={24} style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>Incomplete Profile Data</h4>
                <p style={{ fontSize: '0.8rem', marginTop: '4px', color: 'hsl(var(--muted-foreground))' }}>
                  Please navigate to the <Link href="/profile" style={{ color: 'hsl(var(--primary))', fontWeight: 600 }}>My Profile</Link> page to fill in missing personal details, address, and job information before submission.
                </p>
              </div>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: 'var(--radius)',
                padding: '16px',
                marginBottom: '20px',
                display: 'flex',
                gap: '12px',
              }}
            >
              <CheckCircle2 color="hsl(var(--success))" size={24} style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>Profile Verified</h4>
                <p style={{ fontSize: '0.8rem', marginTop: '4px', color: 'hsl(var(--muted-foreground))' }}>
                  All requirements met. Ready to perform credit check and calculate loan limits.
                </p>
              </div>
            </div>
          )}

          <Button
            onClick={handleFinalSubmit}
            style={{ width: '100%', padding: '12px' }}
            disabled={!profileComplete || loading}
          >
            {loading ? 'Evaluating Eligibility...' : 'Submit & Check Eligibility'}
          </Button>
        </Card>
      )}

      {/* Step 3 Form - Eligibility Outcome */}
      {step === 3 && eligibilityOutcome && (
        <Card className="glass-card animate-slide-up" style={{ textAlign: 'center', padding: '40px 30px' }}>
          {eligibilityOutcome.is_eligible ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ color: 'hsl(var(--success))', marginBottom: '20px' }}>
                <CheckCircle2 size={56} />
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Eligibility Passed!</h2>
              <p style={{ fontSize: '0.875rem', marginTop: '8px', color: 'hsl(var(--muted-foreground))', maxWidth: '400px' }}>
                Great news! Our engine recommends approval for your application.
              </p>

              <div
                style={{
                  width: '100%',
                  marginTop: '32px',
                  padding: '24px',
                  borderRadius: 'var(--radius)',
                  backgroundColor: 'hsl(var(--input))',
                  border: '1px solid hsl(var(--border))',
                  textAlign: 'left',
                }}
              >
                <div className="flex-between" style={{ marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))' }}>Recommended Tenure</span>
                  <span style={{ fontSize: '1rem', fontWeight: 600 }}>{eligibilityOutcome.recommended_tenure} Months</span>
                </div>
                <div className="flex-between">
                  <span style={{ fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))' }}>Max Eligible Amount</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'hsl(var(--primary))' }}>
                    ₹{Number(eligibilityOutcome.max_eligible_amount).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ color: 'hsl(var(--destructive))', marginBottom: '20px' }}>
                <XCircle size={56} />
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Eligibility Rejected</h2>
              <p style={{ fontSize: '0.875rem', marginTop: '8px', color: 'hsl(var(--muted-foreground))', maxWidth: '400px' }}>
                Unfortunately, your profile does not meet one or more of our automated eligibility rules.
              </p>

              <div
                style={{
                  width: '100%',
                  marginTop: '32px',
                  padding: '20px 24px',
                  borderRadius: 'var(--radius)',
                  backgroundColor: 'rgba(239, 68, 68, 0.05)',
                  border: '1px solid rgba(239, 68, 68, 0.1)',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: '0.8rem', color: 'hsl(var(--destructive))', fontWeight: 600 }}>REJECTION FACTORS:</span>
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px', fontSize: '0.825rem', marginTop: '10px', color: 'hsl(var(--muted-foreground))', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {eligibilityOutcome.rejection_reasons.map((reason: string, idx: number) => (
                    <li key={idx}>{reason}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div style={{ marginTop: '32px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link href="/loans">
              <Button variant="outline">View Applications</Button>
            </Link>
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
