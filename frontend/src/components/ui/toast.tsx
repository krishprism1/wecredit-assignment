// frontend/src/components/ui/toast.tsx
'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import '../../styles/components.css';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextType {
  toast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast-message toast-${t.type} flex-between`}
          >
            <div className="flex-row-center" style={{ gap: '10px' }}>
              {t.type === 'success' && <CheckCircle size={18} color="hsl(var(--success))" />}
              {t.type === 'error' && <AlertCircle size={18} color="hsl(var(--destructive))" />}
              <span style={{ fontSize: '0.875rem' }}>{t.message}</span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              style={{ background: 'none', border: 'none', color: 'hsl(var(--muted-foreground))', cursor: 'pointer', display: 'flex' }}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
export default useToast;
