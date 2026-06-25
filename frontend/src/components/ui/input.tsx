// frontend/src/components/ui/input.tsx
import React from 'react';
import '../../styles/components.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="input-container">
        {label && <label className="input-label">{label}</label>}
        <input
          ref={ref}
          className={`input-field ${error ? 'input-field-error' : ''} ${className}`}
          {...props}
        />
        {error && <span className="input-error">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
