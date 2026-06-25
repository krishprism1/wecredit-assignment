// frontend/src/components/ui/skeleton.tsx
import React from 'react';
import '../../styles/components.css';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  circle?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  circle = false,
  className = '',
  style,
  ...props
}) => {
  const styles: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    borderRadius: circle ? '50%' : 'var(--radius)',
    ...style,
  };

  return (
    <div
      className={`skeleton-anim ${className}`}
      style={styles}
      {...props}
    />
  );
};
