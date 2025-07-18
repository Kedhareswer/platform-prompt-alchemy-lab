
import React from 'react';
import { Gauge } from '@/components/ui/gauge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, Sparkles, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface PromptQualityScore {
  clarity: number;       // 1-10 scale
  specificity: number;   // 1-10 scale
  effectiveness: number; // 1-10 scale
  issues: {
    isVague: boolean;
    isOverlyBroad: boolean;
    lacksContext: boolean;
    suggestions: string[];
  };
}

interface PromptQualityIndicatorProps {
  qualityScore: PromptQualityScore | null;
  isAnalyzing?: boolean;
}

export function PromptQualityIndicator({ 
  qualityScore, 
  isAnalyzing = false
}: PromptQualityIndicatorProps) {
  if (isAnalyzing) {
    return (
      <div className="space-y-4 animate-pulse" role="status" aria-label="Analyzing prompt quality">
        <div className="flex items-center gap-2">
          <div className="h-6 bg-muted rounded w-1/3" />
          <Badge variant="outline" className="animate-pulse">Analyzing...</Badge>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3 p-4 border rounded-lg">
              <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
              <div className="h-24 bg-muted rounded-full mx-auto" />
              <div className="h-3 bg-muted rounded w-3/4 mx-auto" />
            </div>
          ))}
        </div>
        <span className="sr-only">Analyzing prompt quality...</span>
      </div>
    );
  }

  if (!qualityScore) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium mb-2">Prompt Quality Analysis</h3>
        <p className="text-sm">Enter a prompt to see detailed quality metrics and improvement suggestions</p>
      </div>
    );
  }

  const getGaugeVariant = (value: number) => {
    if (value >= 8) return 'success';
    if (value >= 5) return 'warning';
    return 'destructive';
  };

  const getQualityLabel = (value: number) => {
    if (value >= 8) return 'Excellent';
    if (value >= 6) return 'Good';
    if (value >= 4) return 'Fair';
    return 'Needs Work';
  };

  const getQualityIcon = (value: number) => {
    if (value >= 8) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (value >= 6) return <CheckCircle className="w-4 h-4 text-blue-600" />;
    if (value >= 4) return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    return <XCircle className="w-4 h-4 text-red-600" />;
  };

  const getOverallScore = () => {
    const avg = (qualityScore.clarity + qualityScore.specificity + qualityScore.effectiveness) / 3;
    return Math.round(avg * 10) / 10;
  };

  const overallScore = getOverallScore();

  const metrics = [
    { 
      key: 'clarity', 
      label: 'Clarity',
      description: 'How clear and understandable your prompt is',
      tips: 'Use simple language and avoid ambiguity'
    },
    { 
      key: 'specificity', 
      label: 'Specificity',
      description: 'How specific and detailed your prompt is',
      tips: 'Add context, constraints, and examples'
    },
    { 
      key: 'effectiveness', 
      label: 'Effectiveness',
      description: 'How likely your prompt will produce good results',
      tips: 'Structure your request with clear objectives'
    },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-500" />
          Prompt Quality Analysis
        </h3>
        <div className="flex items-center gap-2">
          {getQualityIcon(overallScore)}
          <Badge variant={overallScore >= 7 ? "default" : overallScore >= 5 ? "secondary" : "destructive"}>
            {overallScore.toFixed(1)}/10
          </Badge>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="p-4 bg-muted/30 rounded-lg border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Overall Quality Score</span>
          <span className="text-sm text-muted-foreground">{overallScore.toFixed(1)}/10</span>
        </div>
        <Progress value={overallScore * 10} className="h-2" />
        <p className="text-xs text-muted-foreground mt-1">
          {getQualityLabel(overallScore)} - {
            overallScore >= 8 ? "Your prompt is well-structured and clear!" :
            overallScore >= 6 ? "Good prompt with room for minor improvements." :
            overallScore >= 4 ? "Decent prompt that could benefit from more detail." :
            "Consider adding more specificity and clarity."
          }
        </p>
      </div>
      
      {/* Individual Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map(({ key, label, description, tips }) => {
          const value = qualityScore[key];
          
          return (
            <div 
              key={key}
              className="flex flex-col p-4 border rounded-lg hover:shadow-md transition-shadow"
              role="region"
              aria-labelledby={`${key}-label`}
            >
              <div className="text-center">
                <h4 id={`${key}-label`} className="text-sm font-medium mb-3">{label}</h4>
                
                <div className="relative w-24 h-24 mx-auto mb-3">
                  <Gauge 
                    value={value * 10} 
                    size="lg" 
                    variant={getGaugeVariant(value)}
                    showValue={false}
                    className="w-full h-full"
                    aria-label={`${label}: ${value} out of 10`}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold">{value}</span>
                    <span className="text-xs text-muted-foreground">/10</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Badge 
                    variant={value >= 8 ? "default" : value >= 6 ? "secondary" : value >= 4 ? "outline" : "destructive"}
                    className="text-xs"
                  >
                    {getQualityLabel(value)}
                  </Badge>
                  
                  <p className="text-xs text-muted-foreground">
                    {description}
                  </p>
                  
                  {value < 7 && (
                    <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded border">
                      💡 {tips}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Improvement Suggestions */}
      {qualityScore.issues.suggestions.length > 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Suggestions for Improvement</AlertTitle>
          <AlertDescription className="mt-2">
            <ul className="space-y-2">
              {qualityScore.issues.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span className="text-sm">{suggestion}</span>
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Quick Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Quick Tips for Better Prompts</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Start with action verbs (Create, Analyze, Write, Design)</li>
          <li>• Include specific details about format, length, and style</li>
          <li>• Provide context and background information</li>
          <li>• Add constraints or requirements to guide the response</li>
          <li>• Use examples to clarify your expectations</li>
        </ul>
      </div>
    </div>
  );
}
