// frontend/src/app/(customer)/credit-score/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useToast } from '../../../components/ui/toast';
import { apiClient } from '../../../lib/api-client';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Skeleton } from '../../../components/ui/skeleton';
import { CreditScoreGauge } from '../../../components/shared/credit-score-gauge';
import { ShieldCheck, Sparkles, RefreshCw, Zap } from 'lucide-react';
import { CreditScore } from 'shared';

export default function CreditScorePage() {
  const { toast } = useToast();
  const [score, setScore] = useState<CreditScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchScore = async () => {
    try {
      const data = await apiClient.get<CreditScore | null>('/credit/score');
      setScore(data);
    } catch (err: any) {
      toast(err.message || 'Failed to retrieve credit score', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScore();
  }, [toast]);

  const handleGenerateScore = async () => {
    setGenerating(true);
    try {
      const newScore = await apiClient.post<CreditScore>('/credit/score');
      setScore(newScore);
      toast('Credit score generated successfully!', 'success');
    } catch (err: any) {
      toast(err.message || 'Failed to generate credit score. Check profile completeness.', 'error');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <Skeleton height="350px" />;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 className="grad-text">Credit Rating</h1>
        <p>Monitor your simulated credit bureau rating used during eligibility assessments</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '24px' }} className="grid-cols-2">
        {/* Left Side: Score display */}
        <Card className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '340px' }}>
          {score ? (
            <div style={{ textAlign: 'center', width: '100%' }}>
              <CreditScoreGauge score={score.score} />
              <div style={{ marginTop: '16px' }}>
                <span style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>
                  Assessed: {new Date(score.generated_at).toLocaleDateString()}
                </span>
              </div>
              <Button
                onClick={handleGenerateScore}
                disabled={generating}
                variant="outline"
                style={{ marginTop: '20px', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.825rem' }}
              >
                <RefreshCw size={14} className={generating ? 'animate-spin' : ''} />
                Re-assess Score
              </Button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px' }}>
              <ShieldCheck size={48} color="#fbbf24" style={{ marginBottom: '16px' }} />
              <h3>Score Not Generated</h3>
              <p style={{ fontSize: '0.875rem', marginTop: '8px', color: 'hsl(var(--muted-foreground))', marginBottom: '24px' }}>
                You haven't requested a credit score simulation yet.
              </p>
              <Button onClick={handleGenerateScore} disabled={generating}>
                {generating ? 'Calculating...' : 'Generate Credit Score'}
              </Button>
            </div>
          )}
        </Card>

        {/* Right Side: Score factors explainer */}
        <Card className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} color="hsl(var(--primary))" />
              How is your score calculated?
            </h3>
            <p style={{ fontSize: '0.85rem', marginBottom: '20px' }}>
              Our simulated Credit Bureau model uses a deterministic algorithm that evaluates your demographic details, monthly earnings, and job duration to calculate a credit rating between 300 (Poor) and 900 (Excellent).
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'hsl(var(--primary))', marginTop: '6px', flexShrink: 0 }} />
                <div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Age Demographics</span>
                  <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>Higher scores are granted to applicants within standard working age brackets (25 - 55).</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'hsl(var(--primary))', marginTop: '6px', flexShrink: 0 }} />
                <div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Employment Type</span>
                  <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>Salaried jobs are historically seen as more predictable and stable, yielding minor score bonuses.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'hsl(var(--primary))', marginTop: '6px', flexShrink: 0 }} />
                <div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Job Stability</span>
                  <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>Continuous employment of more than 2 years with a single company significantly boosts your profile safety rating.</p>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(59, 130, 246, 0.05)',
              border: '1px solid rgba(59, 130, 246, 0.1)',
              padding: '12px 16px',
              borderRadius: 'var(--radius)',
              fontSize: '0.75rem',
              color: 'hsl(var(--muted-foreground))',
              marginTop: '16px',
            }}
          >
            ⚠️ <strong>Important Note:</strong> A minimum score of 650 is strictly required to pass automatic eligibility checks for all loans.
          </div>
        </Card>
      </div>
    </div>
  );
}
