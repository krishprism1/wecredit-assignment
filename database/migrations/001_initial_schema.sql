-- 001_initial_schema.sql
-- Create initial schema tables for Loan Application & Eligibility Management System

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (Linked to Supabase Auth)
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text,
    email text unique not null,
    phone text,
    date_of_birth date,
    is_admin boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trigger to automatically create a profile for new auth.users
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, email, full_name)
    values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'full_name', '')
    );
    return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- 2. Addresses Table
create table if not exists public.addresses (
    id uuid primary key default gen_random_uuid(),
    profile_id uuid not null references public.profiles(id) on delete cascade,
    address_line_1 text not null,
    city text not null,
    state text not null,
    pincode text not null,
    address_type text not null check (address_type in ('PERMANENT', 'CURRENT')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Employment Details Table
create table if not exists public.employment_details (
    id uuid primary key default gen_random_uuid(),
    profile_id uuid not null unique references public.profiles(id) on delete cascade,
    employer_name text not null,
    designation text not null,
    monthly_income numeric(12, 2) not null check (monthly_income >= 0),
    employment_type text not null check (employment_type in ('SALARIED', 'SELF_EMPLOYED', 'BUSINESS_OWNER', 'OTHER')),
    years_at_job numeric(4, 1) not null check (years_at_job >= 0),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Loan Applications Table
create table if not exists public.loan_applications (
    id uuid primary key default gen_random_uuid(),
    applicant_id uuid not null references public.profiles(id) on delete cascade,
    loan_type text not null check (loan_type in ('PERSONAL', 'HOME', 'CAR', 'EDUCATION', 'BUSINESS')),
    amount_requested numeric(12, 2) not null check (amount_requested > 0),
    tenure_months integer not null check (tenure_months > 0),
    purpose text,
    status text not null default 'DRAFT' check (status in ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'INFO_REQUESTED', 'DISBURSED')),
    assigned_admin_id uuid references public.profiles(id) on delete set null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Credit Scores Table (Simulated Bureau Integration)
create table if not exists public.credit_scores (
    id uuid primary key default gen_random_uuid(),
    profile_id uuid not null references public.profiles(id) on delete cascade,
    score integer not null check (score >= 300 and score <= 900),
    score_factors jsonb not null default '{}'::jsonb,
    generated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index on profile_id and generated_at for fast retrieval of latest score
create index if not exists idx_credit_scores_profile_id_date on public.credit_scores(profile_id, generated_at desc);

-- 6. Eligibility Results Table
create table if not exists public.eligibility_results (
    id uuid primary key default gen_random_uuid(),
    application_id uuid not null unique references public.loan_applications(id) on delete cascade,
    is_eligible boolean not null,
    max_eligible_amount numeric(12, 2) not null check (max_eligible_amount >= 0),
    recommended_tenure integer not null check (recommended_tenure >= 0),
    rejection_reasons jsonb not null default '[]'::jsonb,
    checked_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Application Status History Table (Audit Trail for transitions)
create table if not exists public.application_status_history (
    id uuid primary key default gen_random_uuid(),
    application_id uuid not null references public.loan_applications(id) on delete cascade,
    from_status text not null check (from_status in ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'INFO_REQUESTED', 'DISBURSED')),
    to_status text not null check (to_status in ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'INFO_REQUESTED', 'DISBURSED')),
    changed_by uuid references public.profiles(id) on delete set null,
    remarks text,
    changed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Audit Logs Table (General Audit)
create table if not exists public.audit_logs (
    id uuid primary key default gen_random_uuid(),
    actor_id uuid references public.profiles(id) on delete set null,
    action text not null,
    entity_type text not null,
    entity_id uuid,
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Helper trigger function to update updated_at timestamps
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

create or replace trigger update_profiles_updated_at before update on public.profiles
    for each row execute procedure public.update_updated_at_column();

create or replace trigger update_addresses_updated_at before update on public.addresses
    for each row execute procedure public.update_updated_at_column();

create or replace trigger update_employment_details_updated_at before update on public.employment_details
    for each row execute procedure public.update_updated_at_column();

create or replace trigger update_loan_applications_updated_at before update on public.loan_applications
    for each row execute procedure public.update_updated_at_column();
