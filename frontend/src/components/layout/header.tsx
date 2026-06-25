'use client';

import React from 'react';
import { useAuth } from '../../features/auth/context/auth-context';
import { User } from 'lucide-react';

export const Header: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: '70px',
    padding: '0 32px',
    backgroundColor: 'transparent',
    borderBottom: '1px solid hsl(var(--border))',
    marginBottom: '24px',
  };

  return (
    <header style={headerStyle}>
      <div className="flex-row-center" style={{ gap: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
            {user.full_name || 'Guest User'}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>
            {user.email}
          </span>
        </div>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'hsl(var(--accent))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid hsl(var(--border))',
          }}
        >
          <User size={18} color="hsl(var(--primary))" />
        </div>
      </div>
    </header>
  );
};
export default Header;
