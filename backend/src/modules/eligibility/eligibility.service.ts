import { supabaseAdmin } from '../../config/supabase.js';
import { BadRequestError, NotFoundError } from '../../shared/errors/app-error.js';
import { EligibilityResult } from 'shared';

export class EligibilityService {
  async runAssessment(applicationId: string): Promise<EligibilityResult> {
    // 1. Fetch loan application
    const { data: application, error: appError } = await supabaseAdmin
      .from('loan_applications')
      .select('*')
      .eq('id', applicationId)
      .single();

    if (appError || !application) {
      throw new NotFoundError('Loan application not found');
    }

    const userId = application.applicant_id;

    // 2. Fetch dependencies
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    const { data: employment } = await supabaseAdmin
      .from('employment_details')
      .select('*')
      .eq('profile_id', userId)
      .maybeSingle();

    const { data: creditScore } = await supabaseAdmin
      .from('credit_scores')
      .select('*')
      .eq('profile_id', userId)
      .order('generated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!profile || !employment || !creditScore) {
      throw new BadRequestError('User profile, employment, and credit score are all required for eligibility assessment');
    }

    // 3. Assessment Logic
    const reasons: string[] = [];
    let isEligible = true;

    // Rule A: Minimum Credit Score (>= 650)
    if (creditScore.score < 650) {
      isEligible = false;
      reasons.push(`Credit score is below the minimum required limit of 650 (Current: ${creditScore.score})`);
    }

    // Rule B: Minimum Monthly Income (>= ₹25,000)
    const income = Number(employment.monthly_income);
    if (income < 25000) {
      isEligible = false;
      reasons.push(`Monthly income is below the minimum required limit of ₹25,000 (Current: ₹${income.toLocaleString()})`);
    }

    // Rule C: Minimum Age (21 - 60 years)
    let age = 0;
    if (profile.date_of_birth) {
      const birthDate = new Date(profile.date_of_birth);
      const today = new Date();
      age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 21 || age > 60) {
        isEligible = false;
        reasons.push(`Age is outside eligible limits of 21-60 years (Current: ${age} years)`);
      }
    } else {
      isEligible = false;
      reasons.push('Date of birth is required to verify age limits');
    }

    // Rule D: Job Stability (>= 1 year)
    const yearsAtJob = Number(employment.years_at_job);
    if (yearsAtJob < 1) {
      isEligible = false;
      reasons.push(`Employment stability at current job must be at least 1 year (Current: ${yearsAtJob} years)`);
    }

    // Calculate maximum eligible loan amount factor based on credit score
    let multiplier = 0;
    if (creditScore.score >= 750) multiplier = 60;
    else if (creditScore.score >= 700) multiplier = 40;
    else if (creditScore.score >= 650) multiplier = 24;

    const maxEligibleAmount = income * multiplier;
    const requestedAmount = Number(application.amount_requested);

    if (isEligible && requestedAmount > maxEligibleAmount) {
      reasons.push(`Requested amount ₹${requestedAmount.toLocaleString()} exceeds maximum eligible limit of ₹${maxEligibleAmount.toLocaleString()} based on credit score.`);
    }

    // Calculate Estimated EMI
    let interestRate = 0.18;
    if (creditScore.score >= 800) interestRate = 0.10;
    else if (creditScore.score >= 700) interestRate = 0.12;
    else if (creditScore.score >= 650) interestRate = 0.15;

    const monthlyRate = interestRate / 12;
    const months = application.tenure_months;
    const emi = (requestedAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);

    const dti = (emi / income) * 100;
    if (isEligible && dti > 50) {
      isEligible = false;
      reasons.push(`Estimated Monthly Installment (EMI) of ₹${Math.round(emi).toLocaleString()} exceeds 50% of monthly income (DTI: ${dti.toFixed(1)}%)`);
    }

    let recommendedTenure = months;
    if (dti > 40 && isEligible) {
      for (let t = months; t <= 60; t++) {
        const estEmi = (requestedAmount * monthlyRate * Math.pow(1 + monthlyRate, t)) / (Math.pow(1 + monthlyRate, t) - 1);
        if ((estEmi / income) * 100 <= 40) {
          recommendedTenure = t;
          break;
        }
      }
    }

    // Upsert eligibility results
    const { data: existingResult } = await supabaseAdmin
      .from('eligibility_results')
      .select('id')
      .eq('application_id', applicationId)
      .maybeSingle();

    let query;
    if (existingResult) {
      query = supabaseAdmin
        .from('eligibility_results')
        .update({
          is_eligible: isEligible,
          max_eligible_amount: maxEligibleAmount,
          recommended_tenure: recommendedTenure,
          rejection_reasons: reasons,
        })
        .eq('id', existingResult.id);
    } else {
      query = supabaseAdmin
        .from('eligibility_results')
        .insert({
          application_id: applicationId,
          is_eligible: isEligible,
          max_eligible_amount: maxEligibleAmount,
          recommended_tenure: recommendedTenure,
          rejection_reasons: reasons,
        });
    }

    const { data: result, error: saveError } = await query.select().single();
    if (saveError) throw saveError;

    // Audit logs
    await supabaseAdmin.from('audit_logs').insert({
      actor_id: userId,
      action: 'RUN_ELIGIBILITY_CHECK',
      entity_type: 'LOAN_APPLICATION',
      entity_id: applicationId,
      metadata: { is_eligible: isEligible, score: creditScore.score, reasons },
    });

    return result;
  }
}
