// frontend/src/components/ui/select.tsx
import React from 'react';
import '../../styles/components.css';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    return (
      <div className="input-container">
        {label && <label className="input-label">{label}</label>}
        <div style={{ position: 'relative' }}>
          <select
            ref={ref}
            className={`select-field ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} style={{ backgroundColor: 'hsl(var(--card))' }}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        {error && <span className="input-error">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
