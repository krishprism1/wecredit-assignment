import React from 'react';
import '../../styles/components.css';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  children,
  className = '',
  ...props
}) => {
  const styles: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' },
    secondary: { backgroundColor: 'rgba(75, 85, 99, 0.15)', color: '#9ca3af' },
    success: { backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399' },
    warning: { backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' },
    danger: { backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171' },
  };

  return (
    <span
      className={`badge-base ${className}`}
      style={styles[variant]}
      {...props}
    >
      {children}
    </span>
  );
};
