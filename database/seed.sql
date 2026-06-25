-- Seed script for development / testing

-- 1. Create test users in auth.users
-- Password is 'password123'
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000001',
  'authenticated',
  'authenticated',
  'customer@wecredit.com',
  '$2a$10$tZ92rD9c81pC11Qsz.N15e7H8mZtJ.6/B5d0G6D99b24Vp523rJae',
  now(),
  null,
  null,
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Test Customer"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
),
(
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000002',
  'authenticated',
  'authenticated',
  'admin@wecredit.com',
  '$2a$10$tZ92rD9c81pC11Qsz.N15e7H8mZtJ.6/B5d0G6D99b24Vp523rJae',
  now(),
  null,
  null,
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Test Admin"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- 2. Make the admin user an admin in public.profiles
-- The profile is automatically created by the trigger, so we just update it.
UPDATE public.profiles 
SET is_admin = true 
WHERE id = '00000000-0000-0000-0000-000000000002';

-- 3. Insert sample addresses
INSERT INTO public.addresses (profile_id, address_line_1, city, state, pincode, address_type)
VALUES 
    ('00000000-0000-0000-0000-000000000001', '123 Tech Park, Phase 1', 'Bangalore', 'Karnataka', '560001', 'CURRENT'),
    ('00000000-0000-0000-0000-000000000001', '456 Green Meadows', 'Pune', 'Maharashtra', '411001', 'PERMANENT');

-- 4. Insert sample employment details
INSERT INTO public.employment_details (profile_id, employer_name, designation, monthly_income, employment_type, years_at_job)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'Tech Solutions Inc', 'Software Engineer', 85000.00, 'SALARIED', 2.5);

-- 5. Insert sample credit score
INSERT INTO public.credit_scores (profile_id, score, score_factors)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 750, '{"payment_history": "Excellent", "credit_utilization": "Low", "debt_ratio": "15%"}'::jsonb);

-- 6. Insert sample loan applications
INSERT INTO public.loan_applications (id, applicant_id, loan_type, amount_requested, tenure_months, purpose, status)
VALUES 
    ('e6c8dc54-7128-4fb6-9e8c-85a0349b14b2', '00000000-0000-0000-0000-000000000001', 'PERSONAL', 500000.00, 24, 'Medical Expense', 'SUBMITTED');

-- 7. Insert eligibility results for sample application
INSERT INTO public.eligibility_results (application_id, is_eligible, max_eligible_amount, recommended_tenure, rejection_reasons)
VALUES 
    ('e6c8dc54-7128-4fb6-9e8c-85a0349b14b2', true, 510000.00, 24, '[]'::jsonb);

-- 8. Status history
INSERT INTO public.application_status_history (application_id, from_status, to_status, remarks)
VALUES 
    ('e6c8dc54-7128-4fb6-9e8c-85a0349b14b2', 'DRAFT', 'SUBMITTED', 'Submitted by customer');
