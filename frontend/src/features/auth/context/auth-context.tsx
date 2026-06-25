'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '../../../lib/api-client';
import { AuthResponseData } from 'shared';

interface AuthContextType {
  user: AuthResponseData['user'] | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthResponseData['user'] | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('we_credit_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await apiClient.get<any>('/profile');
        setUser({
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          is_admin: profile.is_admin,
        });
      } catch (err) {
        console.error('Authentication check failed:', err);
        localStorage.removeItem('we_credit_token');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await apiClient.post<AuthResponseData>('/auth/login', { email, password });
      localStorage.setItem('we_credit_token', data.token);
      setUser(data.user);
      if (data.user.is_admin) {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    try {
      const data = await apiClient.post<AuthResponseData>('/auth/register', {
        email,
        password,
        full_name: fullName,
      });
      localStorage.setItem('we_credit_token', data.token);
      setUser(data.user);
      router.push('/dashboard');
    } catch (error) {
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      console.warn('Sign out call failed on backend, cleaning client storage anyway');
    } finally {
      localStorage.removeItem('we_credit_token');
      setUser(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
