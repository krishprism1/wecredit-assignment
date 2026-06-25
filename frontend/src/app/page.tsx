'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../features/auth/context/auth-context';
import { Skeleton } from '../components/ui/skeleton';

export default function RootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (user.is_admin) {
          router.push('/admin/dashboard');
        } else {
          router.push('/dashboard');
        }
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'hsl(var(--background))', padding: '32px' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
        <Skeleton height="40px" width="200px" />
        <Skeleton height="20px" width="300px" />
      </div>
    </div>
  );
}
