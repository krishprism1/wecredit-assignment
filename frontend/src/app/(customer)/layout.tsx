// frontend/src/app/(customer)/layout.tsx
'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../../features/auth/context/auth-context';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/layout/sidebar';
import Header from '../../components/layout/header';
import { Skeleton } from '../../components/ui/skeleton';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.is_admin) {
        router.push('/admin/dashboard');
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.is_admin) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'hsl(var(--background))' }}>
        <div style={{ width: '260px', height: '100vh', borderRight: '1px solid hsl(var(--border))', padding: '24px' }}>
          <Skeleton height="40px" style={{ marginBottom: '24px' }} />
          <Skeleton height="30px" style={{ marginBottom: '16px' }} />
          <Skeleton height="30px" style={{ marginBottom: '16px' }} />
          <Skeleton height="30px" style={{ marginBottom: '16px' }} />
        </div>
        <div style={{ flex: 1, padding: '32px' }}>
          <Skeleton height="60px" style={{ marginBottom: '32px' }} />
          <Skeleton height="200px" />
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
