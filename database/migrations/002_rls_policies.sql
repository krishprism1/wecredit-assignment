-- 002_rls_policies.sql
create or replace function public.is_admin()
returns boolean as $$
begin
    return coalesce(
        (select is_admin from public.profiles where id = auth.uid()),
        false
    );
end;
$$ language plpgsql security definer set search_path = public;

create or replace function public.is_owner(owner_id uuid)
returns boolean as $$
begin
    return auth.uid() = owner_id;
end;
$$ language plpgsql security definer set search_path = public;

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.employment_details enable row level security;
alter table public.loan_applications enable row level security;
alter table public.credit_scores enable row level security;
alter table public.eligibility_results enable row level security;
alter table public.application_status_history enable row level security;
alter table public.audit_logs enable row level security;


create policy "Allow select for owner or admin" on public.profiles
    for select using (public.is_owner(id) or public.is_admin());

create policy "Allow update for owner or admin" on public.profiles
    for update using (public.is_owner(id) or public.is_admin());


create policy "Allow select for address owner or admin" on public.addresses
    for select using (public.is_owner(profile_id) or public.is_admin());

create policy "Allow insert for address owner" on public.addresses
    for insert with check (public.is_owner(profile_id));

create policy "Allow update for address owner or admin" on public.addresses
    for update using (public.is_owner(profile_id) or public.is_admin());

create policy "Allow delete for address owner or admin" on public.addresses
    for delete using (public.is_owner(profile_id) or public.is_admin());

-- 3. Employment Details Policies
create policy "Allow select for employment owner or admin" on public.employment_details
    for select using (public.is_owner(profile_id) or public.is_admin());

create policy "Allow insert for employment owner" on public.employment_details
    for insert with check (public.is_owner(profile_id));

create policy "Allow update for employment owner or admin" on public.employment_details
    for update using (public.is_owner(profile_id) or public.is_admin());

-- 4. Loan Applications Policies
create policy "Allow select for applicant or admin" on public.loan_applications
    for select using (public.is_owner(applicant_id) or public.is_admin());

create policy "Allow insert for applicant" on public.loan_applications
    for insert with check (public.is_owner(applicant_id));

create policy "Allow update for applicant or admin" on public.loan_applications
    for update using (public.is_owner(applicant_id) or public.is_admin());

-- 5. Credit Scores Policies (Only read allowed for owner or admin, write by system)
create policy "Allow select for credit score owner or admin" on public.credit_scores
    for select using (public.is_owner(profile_id) or public.is_admin());

-- 6. Eligibility Results Policies (Only read allowed for applicant or admin)
create policy "Allow select for eligibility result applicant or admin" on public.eligibility_results
    for select using (
        (select applicant_id from public.loan_applications where id = application_id) = auth.uid()
        or public.is_admin()
    );

-- 7. Application Status History Policies (Only read allowed for applicant or admin)
create policy "Allow select for history applicant or admin" on public.application_status_history
    for select using (
        (select applicant_id from public.loan_applications where id = application_id) = auth.uid()
        or public.is_admin()
    );

-- 8. Audit Logs Policies (Admins can view logs, authenticated users can insert logs)
create policy "Allow select for admin only" on public.audit_logs
    for select using (public.is_admin());

create policy "Allow insert for authenticated users" on public.audit_logs
    for insert with check (auth.uid() is not null);
