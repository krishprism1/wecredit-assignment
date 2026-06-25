// frontend/src/components/shared/credit-score-gauge.tsx
import React from 'react';

interface CreditScoreGaugeProps {
  score: number;
}

export const CreditScoreGauge: React.FC<CreditScoreGaugeProps> = ({ score }) => {
  // Normalize score between 300 and 900
  const min = 300;
  const max = 900;
  const clamped = Math.max(min, Math.min(max, score));
  const percentage = (clamped - min) / (max - min);
  
  // SVG Arc length calculations
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - percentage * circumference;

  // Determine rating text and color
  let rating = 'POOR';
  let color = '#ef4444'; // Red
  let glow = 'rgba(239, 68, 68, 0.2)';

  if (clamped >= 800) {
    rating = 'EXCELLENT';
    color = '#10b981'; // Emerald
    glow = 'rgba(16, 185, 129, 0.3)';
  } else if (clamped >= 720) {
    rating = 'VERY GOOD';
    color = '#34d399'; // Light emerald
    glow = 'rgba(52, 211, 153, 0.25)';
  } else if (clamped >= 650) {
    rating = 'GOOD';
    color = '#fbbf24'; // Amber
    glow = 'rgba(245, 158, 11, 0.25)';
  } else if (clamped >= 580) {
    rating = 'FAIR';
    color = '#f97316'; // Orange
    glow = 'rgba(249, 115, 22, 0.2)';
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ position: 'relative', width: '160px', height: '160px' }}>
        <svg width="100%" height="100%" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="8"
          />
          {/* Active progress arc */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </svg>
        {/* Inner text container */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '110px',
            height: '110px',
            borderRadius: '50%',
            backgroundColor: 'hsl(var(--card))',
            boxShadow: `0 0 20px ${glow}, inset 0 0 10px rgba(255, 255, 255, 0.05)`,
            border: '1px solid hsl(var(--card-border))',
          }}
        >
          <span style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>
            {clamped}
          </span>
          <span style={{ fontSize: '0.65rem', fontWeight: 700, color, letterSpacing: '1px', marginTop: '6px' }}>
            {rating}
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '180px', marginTop: '12px', fontSize: '0.65rem', color: 'hsl(var(--muted-foreground))' }}>
        <span>Min: 300</span>
        <span>Max: 900</span>
      </div>
    </div>
  );
};
export default CreditScoreGauge;
