// frontend/src/app/(public)/register/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '../../../components/ui/toast';
import { Input } from '../../../components/ui/input';
import { Select } from '../../../components/ui/select';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { apiClient } from '../../../lib/api-client';
import { FolderLock, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');

  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  const [employerName, setEmployerName] = useState('');
  const [designation, setDesignation] = useState('');
  const [income, setIncome] = useState('');
  const [employmentType, setEmploymentType] = useState('SALARIED');
  const [yearsAtJob, setYearsAtJob] = useState('');

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      toast('Please fill all fields', 'error');
      return;
    }
    setLoading(true);
    try {
      // Call register API
      const data = await apiClient.post<any>('/auth/register', {
        email,
        password,
        full_name: fullName,
      });
      // Save token manually to authorize subsequent profile/address/employment updates
      localStorage.setItem('we_credit_token', data.token);
      toast('Account created! Let us complete your profile.', 'success');
      setStep(2);
    } catch (err: any) {
      toast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !dob) {
      toast('Please fill all fields', 'error');
      return;
    }
    setLoading(true);
    try {
      await apiClient.put('/profile', {
        phone,
        date_of_birth: dob,
      });
      toast('Personal details updated!', 'success');
      setStep(3);
    } catch (err: any) {
      toast(err.message || 'Failed to update personal details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressLine1 || !city || !state || !pincode || !employerName || !designation || !income || !yearsAtJob) {
      toast('Please fill all fields', 'error');
      return;
    }
    setLoading(true);
    try {
      // Upsert address
      await apiClient.put('/profile/address', {
        address_line_1: addressLine1,
        city,
        state,
        pincode,
        address_type: 'CURRENT',
      });

      // Upsert employment details
      await apiClient.put('/profile/employment', {
        employer_name: employerName,
        designation,
        monthly_income: Number(income),
        employment_type: employmentType,
        years_at_job: Number(yearsAtJob),
      });

      toast('Profile completed successfully!', 'success');
      
      // Redirect to dashboard (force page reload to re-run auth check context init)
      window.location.href = '/dashboard';
    } catch (err: any) {
      toast(err.message || 'Failed to complete profile configuration', 'error');
    } finally {
      setLoading(false);
    }
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
    background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.15), transparent), radial-gradient(circle at bottom left, rgba(59, 130, 246, 0.1), transparent)',
  };

  return (
    <div style={containerStyle}>
      <Card className="glass-card animate-slide-up" style={{ width: '100%', maxWidth: '520px', padding: '40px 30px' }}>
        
        {/* Logo and title */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(59, 130, 246, 0.1)', marginBottom: '12px' }}>
            <FolderLock size={28} color="hsl(var(--primary))" />
          </div>
          <h2 className="grad-text" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
            Create Your Account
          </h2>
          {/* Step indicator bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
            <div style={{ width: '24px', height: '6px', borderRadius: '3px', backgroundColor: step >= 1 ? 'hsl(var(--primary))' : 'hsl(var(--border))' }} />
            <div style={{ width: '24px', height: '6px', borderRadius: '3px', backgroundColor: step >= 2 ? 'hsl(var(--primary))' : 'hsl(var(--border))' }} />
            <div style={{ width: '24px', height: '6px', borderRadius: '3px', backgroundColor: step >= 3 ? 'hsl(var(--primary))' : 'hsl(var(--border))' }} />
          </div>
          <p style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', marginTop: '8px' }}>
            Step {step} of 3
          </p>
        </div>

        {/* Step 1: Account setup */}
        {step === 1 && (
          <form onSubmit={handleStep1}>
            <Input
              type="text"
              label="Full Name"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={loading}
            />
            <Input
              type="email"
              label="Email Address"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <Input
              type="password"
              label="Password"
              placeholder="•••••••• (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <Button
              type="submit"
              style={{ width: '100%', marginTop: '16px', padding: '12px' }}
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Next Step'}
            </Button>
            <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.875rem' }}>
              <span style={{ color: 'hsl(var(--muted-foreground))' }}>Already have an account? </span>
              <Link href="/login" style={{ color: 'hsl(var(--primary))', fontWeight: 500 }}>
                Sign In
              </Link>
            </div>
          </form>
        )}

        {/* Step 2: Personal details */}
        {step === 2 && (
          <form onSubmit={handleStep2}>
            <Input
              type="tel"
              label="Phone Number"
              placeholder="+919876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              disabled={loading}
            />
            <Input
              type="date"
              label="Date of Birth"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
              disabled={loading}
            />
            <Button
              type="submit"
              style={{ width: '100%', marginTop: '16px', padding: '12px' }}
              disabled={loading}
            >
              {loading ? 'Saving details...' : 'Continue'}
            </Button>
          </form>
        )}

        {/* Step 3: Address & Employment */}
        {step === 3 && (
          <form onSubmit={handleStep3}>
            <h3 style={{ fontSize: '1rem', marginBottom: '12px', borderBottom: '1px solid hsl(var(--border))', paddingBottom: '6px' }}>Current Address</h3>
            <Input
              type="text"
              label="Address Line 1"
              placeholder="Flat 101, Green Apartments"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              required
              disabled={loading}
            />
            <div className="grid-cols-3">
              <Input
                type="text"
                label="City"
                placeholder="Bangalore"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                disabled={loading}
              />
              <Input
                type="text"
                label="State"
                placeholder="Karnataka"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
                disabled={loading}
              />
              <Input
                type="text"
                label="Pincode"
                placeholder="560001"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <h3 style={{ fontSize: '1rem', marginTop: '20px', marginBottom: '12px', borderBottom: '1px solid hsl(var(--border))', paddingBottom: '6px' }}>Employment & Income</h3>
            <Input
              type="text"
              label="Employer Name"
              placeholder="Google LLC"
              value={employerName}
              onChange={(e) => setEmployerName(e.target.value)}
              required
              disabled={loading}
            />
            <div className="grid-cols-2">
              <Input
                type="text"
                label="Designation"
                placeholder="Software Engineer"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                required
                disabled={loading}
              />
              <Select
                label="Employment Type"
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                options={[
                  { value: 'SALARIED', label: 'Salaried' },
                  { value: 'SELF_EMPLOYED', label: 'Self-Employed' },
                  { value: 'BUSINESS_OWNER', label: 'Business Owner' },
                  { value: 'OTHER', label: 'Other' },
                ]}
                required
                disabled={loading}
              />
            </div>
            <div className="grid-cols-2">
              <Input
                type="number"
                label="Monthly Income (INR)"
                placeholder="75000"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                required
                disabled={loading}
              />
              <Input
                type="number"
                step="0.1"
                label="Years at Current Job"
                placeholder="2.5"
                value={yearsAtJob}
                onChange={(e) => setYearsAtJob(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              style={{ width: '100%', marginTop: '24px', padding: '12px' }}
              disabled={loading}
            >
              {loading ? 'Completing Setup...' : 'Finish Registration'}
            </Button>
          </form>
        )}

      </Card>
    </div>
  );
}
