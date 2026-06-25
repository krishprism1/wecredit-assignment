// frontend/src/components/shared/status-badge.tsx
import React from 'react';
import { Badge } from '../ui/badge';
import { LoanStatus } from 'shared';

interface StatusBadgeProps {
  status: LoanStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getVariant = (s: LoanStatus): 'primary' | 'secondary' | 'success' | 'warning' | 'danger' => {
    switch (s) {
      case 'DRAFT':
        return 'secondary';
      case 'SUBMITTED':
        return 'primary';
      case 'UNDER_REVIEW':
      case 'INFO_REQUESTED':
        return 'warning';
      case 'APPROVED':
        return 'success';
      case 'DISBURSED':
        return 'success';
      case 'REJECTED':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getLabel = (s: LoanStatus): string => {
    switch (s) {
      case 'UNDER_REVIEW':
        return 'Under Review';
      case 'INFO_REQUESTED':
        return 'Info Requested';
      default:
        return s;
    }
  };

  return (
    <Badge variant={getVariant(status)}>
      {getLabel(status)}
    </Badge>
  );
};
export default StatusBadge;
