import React from 'react';
import '../styles/globals.css';
import '../styles/components.css';
import { AuthProvider } from '../features/auth/context/auth-context';
import { ToastProvider } from '../components/ui/toast';

export const metadata = {
  title: 'WeCredit - Loan Management System',
  description: 'Apply for loans and check eligibility instantly',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
