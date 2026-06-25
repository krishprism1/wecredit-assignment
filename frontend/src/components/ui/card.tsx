// frontend/src/components/ui/card.tsx
import React from 'react';
import '../../styles/components.css';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`card-base ${className}`} {...props}>
      {children}
    </div>
  );
};
