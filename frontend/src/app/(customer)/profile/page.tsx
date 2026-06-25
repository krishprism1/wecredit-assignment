// frontend/src/app/(customer)/profile/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useToast } from '../../../components/ui/toast';
import { apiClient } from '../../../lib/api-client';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Select } from '../../../components/ui/select';
import { Button } from '../../../components/ui/button';
import { Skeleton } from '../../../components/ui/skeleton';
import { User, MapPin, Briefcase } from 'lucide-react';

export default function ProfilePage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile Details State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');

  // Address Details State
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  // Employment Details State
  const [employerName, setEmployerName] = useState('');
  const [designation, setDesignation] = useState('');
  const [income, setIncome] = useState('');
  const [employmentType, setEmploymentType] = useState('SALARIED');
  const [yearsAtJob, setYearsAtJob] = useState('');

  const fetchProfileDetails = async () => {
    try {
      const data = await apiClient.get<any>('/profile');
      
      setFullName(data.full_name || '');
      setPhone(data.phone || '');
      setDob(data.date_of_birth || '');

      if (data.addresses && data.addresses.length > 0) {
        setAddressLine1(data.addresses[0].address_line_1 || '');
        setCity(data.addresses[0].city || '');
        setState(data.addresses[0].state || '');
        setPincode(data.addresses[0].pincode || '');
      }

      if (data.employment) {
        setEmployerName(data.employment.employer_name || '');
        setDesignation(data.employment.designation || '');
        setIncome(data.employment.monthly_income?.toString() || '');
        setEmploymentType(data.employment.employment_type || 'SALARIED');
        setYearsAtJob(data.employment.years_at_job?.toString() || '');
      }
    } catch (err: any) {
      toast(err.message || 'Failed to retrieve profile information', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileDetails();
  }, [toast]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.put('/profile', {
        full_name: fullName,
        phone,
        date_of_birth: dob || null,
      });
      toast('Personal details updated successfully!', 'success');
    } catch (err: any) {
      toast(err.message || 'Failed to update personal details', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.put('/profile/address', {
        address_line_1: addressLine1,
        city,
        state,
        pincode,
        address_type: 'CURRENT',
      });
      toast('Address details updated successfully!', 'success');
    } catch (err: any) {
      toast(err.message || 'Failed to update address', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEmployment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.put('/profile/employment', {
        employer_name: employerName,
        designation,
        monthly_income: Number(income),
        employment_type: employmentType,
        years_at_job: Number(yearsAtJob),
      });
      toast('Employment details updated successfully!', 'success');
    } catch (err: any) {
      toast(err.message || 'Failed to update employment details', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Skeleton height="450px" />;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 className="grad-text">My Profile</h1>
        <p>Manage your address, employment parameters, and personal contact details</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Section 1: Personal Details */}
        <Card className="glass-card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} color="hsl(var(--primary))" />
            Personal Details
          </h3>
          <form onSubmit={handleSaveProfile}>
            <div className="grid-cols-2">
              <Input
                type="text"
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={saving}
              />
              <Input
                type="tel"
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={saving}
              />
            </div>
            <div className="grid-cols-2">
              <Input
                type="date"
                label="Date of Birth"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
                disabled={saving}
              />
              <div />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Update Personal Details'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Section 2: Address Info */}
        <Card className="glass-card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={18} color="hsl(var(--primary))" />
            Current Address
          </h3>
          <form onSubmit={handleSaveAddress}>
            <Input
              type="text"
              label="Address Line 1"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              required
              disabled={saving}
            />
            <div className="grid-cols-3">
              <Input
                type="text"
                label="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                disabled={saving}
              />
              <Input
                type="text"
                label="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
                disabled={saving}
              />
              <Input
                type="text"
                label="Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                required
                disabled={saving}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Update Address'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Section 3: Job & Income Info */}
        <Card className="glass-card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={18} color="hsl(var(--primary))" />
            Employment & Income
          </h3>
          <form onSubmit={handleSaveEmployment}>
            <Input
              type="text"
              label="Employer Name"
              value={employerName}
              onChange={(e) => setEmployerName(e.target.value)}
              required
              disabled={saving}
            />
            <div className="grid-cols-2">
              <Input
                type="text"
                label="Designation"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                required
                disabled={saving}
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
                disabled={saving}
              />
            </div>
            <div className="grid-cols-2">
              <Input
                type="number"
                label="Monthly Net Income (INR)"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                required
                disabled={saving}
              />
              <Input
                type="number"
                step="0.1"
                label="Years at Current Job"
                value={yearsAtJob}
                onChange={(e) => setYearsAtJob(e.target.value)}
                required
                disabled={saving}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Update Employment'}
              </Button>
            </div>
          </form>
        </Card>

      </div>
    </div>
  );
}
