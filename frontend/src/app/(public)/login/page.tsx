// frontend/src/app/(public)/login/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../features/auth/context/auth-context';
import { useToast } from '../../../components/ui/toast';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { FolderLock } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast('Please enter both email and password', 'error');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast('Welcome back!', 'success');
    } catch (err: any) {
      toast(err.message || 'Login failed', 'error');
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
      <Card className="glass-card animate-slide-up" style={{ width: '100%', maxWidth: '420px', padding: '40px 30px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '16px', backgroundColor: 'rgba(59, 130, 246, 0.1)', marginBottom: '16px' }}>
            <FolderLock size={32} color="hsl(var(--primary))" />
          </div>
          <h2 className="grad-text" style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.5px' }}>
            Sign In to WeCredit
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))', marginTop: '8px' }}>
            Enter your credentials to access your portal
          </p>
        </div>

        <form onSubmit={handleSubmit}>
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
            placeholder="••••••••"
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
            {loading ? 'Authenticating...' : 'Sign In'}
          </Button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.875rem' }}>
          <span style={{ color: 'hsl(var(--muted-foreground))' }}>Don't have an account? </span>
          <Link href="/register" style={{ color: 'hsl(var(--primary))', fontWeight: 500 }}>
            Register here
          </Link>
        </div>
      </Card>
    </div>
  );
}
