'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../features/auth/context/auth-context';
import {
  LayoutDashboard,
  FilePlus2,
  FileText,
  ShieldCheck,
  User,
  LogOut,
  FolderLock,
  History,
} from 'lucide-react';
import '../../styles/components.css';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user) return null;

  const customerLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/loans/new', label: 'Apply for Loan', icon: FilePlus2 },
    { href: '/loans', label: 'My Applications', icon: FileText },
    { href: '/credit-score', label: 'Credit Score', icon: ShieldCheck },
    { href: '/profile', label: 'My Profile', icon: User },
  ];

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/applications', label: 'All Applications', icon: FileText },
    // { href: '/admin/audit-logs', label: 'System Logs', icon: History },
  ];

  const links = user.is_admin ? adminLinks : customerLinks;

  const sidebarStyle: React.CSSProperties = {
    width: '260px',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '24px 16px',
    backgroundColor: 'hsl(var(--card))',
    borderRight: '1px solid hsl(var(--card-border))',
    zIndex: 100,
  };

  const linkStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: 'var(--radius)',
    fontSize: '0.925rem',
    fontWeight: 500,
    color: active ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))',
    backgroundColor: active ? 'hsl(var(--primary))' : 'transparent',
    transition: 'background-color var(--transition-fast)',
    marginBottom: '8px',
  });

  return (
    <div style={sidebarStyle}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', marginBottom: '32px' }}>
          <FolderLock size={28} color="hsl(var(--primary))" />
          <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.5px' }}>
            WeCredit
          </span>
          {user.is_admin && (
            <span style={{ fontSize: '0.65rem', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 600 }}>
              Admin
            </span>
          )}
        </div>

        <nav>
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link key={link.href} href={link.href} style={linkStyle(isActive)}>
                <Icon size={18} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div>
        <button
          onClick={logout}
          style={{
            ...linkStyle(false),
            width: '100%',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            color: 'hsl(var(--destructive))',
          }}
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
export default Sidebar;
