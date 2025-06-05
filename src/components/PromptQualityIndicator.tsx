import React from 'react';
import { useTranslation } from 'react-i18next';
import { Gauge } from '@/components/ui/gauge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { PromptQualityScore } from '@/utils/semanticAnalysis';

interface PromptQualityIndicatorProps {
  score: PromptQualityScore | null;
  isLoading?: boolean;
  'aria-live'?: 'off' | 'assertive' | 'polite' | undefined;
  'aria-atomic'?: boolean;
}

export function PromptQualityIndicator({ 
  score, 
  isLoading = false,
  'aria-live': ariaLive = 'polite',
  'aria-atomic': ariaAtomic = true
}: PromptQualityIndicatorProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div 
        className="space-y-4 animate-pulse" 
        aria-live={ariaLive}
        aria-busy="true"
        aria-atomic={ariaAtomic}
      >
        <div className="h-4 bg-muted rounded w-1/3" aria-hidden="true" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-muted rounded w-1/2" aria-hidden="true" />
              <div className="h-24 bg-muted rounded" aria-hidden="true" />
            </div>
          ))}
        </div>
        <span className="sr-only">Loading prompt quality analysis...</span>
      </div>
    );
  }

  if (!score) {
    return (
      <div 
        className="text-center py-8 text-muted-foreground"
        aria-live={ariaLive}
        aria-atomic={ariaAtomic}
      >
        {t('prompt.quality.enterPrompt', 'Enter a prompt to see quality analysis')}
      </div>
    );
  }

  const getGaugeVariant = (value: number) => {
    if (value >= 8) return 'success';
    if (value >= 5) return 'warning';
    return 'destructive';
  };

  const getQualityLabel = (value: number) => {
    if (value >= 8) return t('prompt.quality.excellent', 'Excellent');
    if (value >= 6) return t('prompt.quality.good', 'Good');
    if (value >= 4) return t('prompt.quality.fair', 'Fair');
    return t('prompt.quality.needsWork', 'Needs Work');
  };

  const metrics = [
    { 
      key: 'clarity', 
      label: t('prompt.quality.clarity', 'Clarity'),
      description: t('prompt.quality.clarityDescription', 'How clear and understandable your prompt is')
    },
    { 
      key: 'specificity', 
      label: t('prompt.quality.specificity', 'Specificity'),
      description: t('prompt.quality.specificityDescription', 'How specific and detailed your prompt is')
    },
    { 
      key: 'effectiveness', 
      label: t('prompt.quality.effectiveness', 'Effectiveness'),
      description: t('prompt.quality.effectivenessDescription', 'How likely your prompt will produce good results')
    },
  ] as const;

  // Generate a unique ID for the alert region
  const alertId = React.useId();

  return (
    <div 
      className="space-y-4"
      aria-live={ariaLive}
      aria-atomic={ariaAtomic}
      aria-describedby={score.issues.suggestions.length > 0 ? alertId : undefined}
    >
      <h3 
        id="prompt-quality-heading"
        className="text-lg font-medium"
      >
        {t('prompt.quality.title', 'Prompt Quality')}
      </h3>
      
      <div 
        role="group" 
        aria-labelledby="prompt-quality-heading"
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {metrics.map(({ key, label, description }) => {
          const value = score[key];
          return (
            <div 
              key={key}
              className="flex flex-col items-center p-4 border rounded-lg"
              role="group"
              aria-label={`${label}: ${getQualityLabel(score[key])}`}
            >
              <p 
                className="text-sm font-medium text-center mb-2"
                id={`${key}-label`}
              >
                {label}
              </p>
              <div 
                className="relative w-32 h-32 mb-2"
                role="progressbar"
                aria-valuenow={score[key] * 10}
                aria-valuemin={0}
                aria-valuemax={10}
                aria-valuetext={`${score[key] * 10}% - ${getQualityLabel(score[key])}`}
                aria-labelledby={`${key}-label`}
              >
                <Gauge 
                  value={value * 10} 
                  size="lg" 
                  variant={getGaugeVariant(value)}
                  showValue={true}
                  className="w-full h-full"
                />
                <div className="absolute inset-0 flex items-center justify-center mt-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    {getQualityLabel(value)}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                {description}
              </p>
            </div>
          );
        })}
      </div>

      {score.issues.suggestions.length > 0 && (
        <Alert 
          id={alertId}
          className="mt-4"
          role="status"
          aria-live={ariaLive}
          aria-atomic={ariaAtomic}
        >
          <Info className="h-4 w-4" />
          <AlertTitle>{t('prompt.quality.suggestions', 'Suggestions for Improvement')}</AlertTitle>
          <AlertDescription className="mt-2 space-y-2">
            <ul className="list-disc pl-5 space-y-1">
              {score.issues.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
