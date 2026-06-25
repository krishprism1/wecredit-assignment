// shared/types/index.ts
// Shared TypeScript types for Loan Application & Eligibility Management System

export type AddressType = 'PERMANENT' | 'CURRENT';

export type EmploymentType = 'SALARIED' | 'SELF_EMPLOYED' | 'BUSINESS_OWNER' | 'OTHER';

export type LoanType = 'PERSONAL' | 'HOME' | 'CAR' | 'EDUCATION' | 'BUSINESS';

export type LoanStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'INFO_REQUESTED'
  | 'DISBURSED';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  date_of_birth: string | null; // YYYY-MM-DD
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  profile_id: string;
  address_line_1: string;
  city: string;
  state: string;
  pincode: string;
  address_type: AddressType;
  created_at: string;
  updated_at: string;
}

export interface EmploymentDetails {
  id: string;
  profile_id: string;
  employer_name: string;
  designation: string;
  monthly_income: number;
  employment_type: EmploymentType;
  years_at_job: number;
  created_at: string;
  updated_at: string;
}

export interface LoanApplication {
  id: string;
  applicant_id: string;
  loan_type: LoanType;
  amount_requested: number;
  tenure_months: number;
  purpose: string | null;
  status: LoanStatus;
  assigned_admin_id: string | null;
  created_at: string;
  updated_at: string;
  // Optional relations
  applicant?: Profile;
  assigned_admin?: Profile;
  eligibility_result?: EligibilityResult;
  credit_score?: CreditScore;
}

export interface CreditScore {
  id: string;
  profile_id: string;
  score: number;
  score_factors: Record<string, any>;
  generated_at: string;
}

export interface EligibilityResult {
  id: string;
  application_id: string;
  is_eligible: boolean;
  max_eligible_amount: number;
  recommended_tenure: number;
  rejection_reasons: string[];
  checked_at: string;
}

export interface ApplicationStatusHistory {
  id: string;
  application_id: string;
  from_status: LoanStatus;
  to_status: LoanStatus;
  changed_by: string | null;
  remarks: string | null;
  changed_at: string;
  changed_by_profile?: Profile;
}

export interface AuditLog {
  id: string;
  actor_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, any>;
  created_at: string;
  actor_profile?: Profile;
}

// API Request/Response Common formats
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface AuthResponseData {
  user: {
    id: string;
    email: string;
    full_name: string | null;
    is_admin: boolean;
  };
  token: string;
}
