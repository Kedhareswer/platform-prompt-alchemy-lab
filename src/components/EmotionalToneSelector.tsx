
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Heart, AlertTriangle, Zap, Users, Briefcase, Smile, Shield, MessageCircle } from "lucide-react";
import { EmotionalTone, EmotionalIntensity, EmotionalAnalysis } from "@/utils/emotionalPrompting";

interface EmotionalToneSelectorProps {
  tone: EmotionalTone;
  intensity: EmotionalIntensity;
  domain: string;
  analysis: EmotionalAnalysis | null;
  onToneChange: (tone: EmotionalTone) => void;
  onIntensityChange: (intensity: EmotionalIntensity) => void;
}

export const EmotionalToneSelector = ({
  tone,
  intensity,
  domain,
  analysis,
  onToneChange,
  onIntensityChange
}: EmotionalToneSelectorProps) => {
  const toneOptions: Array<{
    value: EmotionalTone;
    label: string;
    description: string;
    icon: React.ElementType;
    color: string;
  }> = [
    {
      value: 'neutral',
      label: 'Neutral',
      description: 'Objective and balanced approach',
      icon: MessageCircle,
      color: 'text-gray-600'
    },
    {
      value: 'professional',
      label: 'Professional',
      description: 'Formal business communication',
      icon: Briefcase,
      color: 'text-blue-600'
    },
    {
      value: 'encouraging',
      label: 'Encouraging',
      description: 'Supportive and motivating',
      icon: Heart,
      color: 'text-green-600'
    },
    {
      value: 'confident',
      label: 'Confident',
      description: 'Assertive and decisive',
      icon: Shield,
      color: 'text-purple-600'
    },
    {
      value: 'urgent',
      label: 'Urgent',
      description: 'Time-sensitive and pressing',
      icon: Zap,
      color: 'text-red-600'
    },
    {
      value: 'empathetic',
      label: 'Empathetic',
      description: 'Understanding and compassionate',
      icon: Users,
      color: 'text-pink-600'
    },
    {
      value: 'enthusiastic',
      label: 'Enthusiastic',
      description: 'Energetic and passionate',
      icon: Smile,
      color: 'text-orange-600'
    },
    {
      value: 'supportive',
      label: 'Supportive',
      description: 'Helpful and accommodating',
      icon: Heart,
      color: 'text-teal-600'
    }
  ];

  const intensityLabels: Record<EmotionalIntensity, string> = {
    subtle: 'Subtle',
    moderate: 'Moderate', 
    strong: 'Strong'
  };

  const getIntensityValue = (intensity: EmotionalIntensity): number => {
    const map = { subtle: 1, moderate: 2, strong: 3 };
    return map[intensity];
  };

  const getIntensityFromValue = (value: number): EmotionalIntensity => {
    const map: Record<number, EmotionalIntensity> = { 1: 'subtle', 2: 'moderate', 3: 'strong' };
    return map[value] || 'moderate';
  };

  const selectedToneOption = toneOptions.find(option => option.value === tone);

  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-600" />
          Emotional Tone
          {analysis && (
            <Badge variant={analysis.appropriateness > 70 ? "default" : "secondary"}>
              {analysis.appropriateness}% Appropriate
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Warnings */}
        {analysis && analysis.warnings.length > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <ul className="space-y-1">
                {analysis.warnings.map((warning, index) => (
                  <li key={index} className="text-sm">{warning}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Tone Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Emotional Tone</Label>
          <Select value={tone} onValueChange={onToneChange}>
            <SelectTrigger>
              <SelectValue>
                {selectedToneOption && (
                  <div className="flex items-center gap-2">
                    <selectedToneOption.icon className={`w-4 h-4 ${selectedToneOption.color}`} />
                    {selectedToneOption.label}
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {toneOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <option.icon className={`w-4 h-4 ${option.color}`} />
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-gray-500">{option.description}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Intensity Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Emotional Intensity</Label>
            <Badge variant="outline">{intensityLabels[intensity]}</Badge>
          </div>
          
          <div className="px-2">
            <Slider
              value={[getIntensityValue(intensity)]}
              onValueChange={([value]) => onIntensityChange(getIntensityFromValue(value))}
              min={1}
              max={3}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Subtle</span>
              <span>Moderate</span>
              <span>Strong</span>
            </div>
          </div>
        </div>

        {/* Domain Compatibility */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Domain Compatibility</Label>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{domain}</Badge>
            {analysis && (
              <Badge variant={analysis.appropriateness > 70 ? "default" : "destructive"}>
                {analysis.appropriateness}% Compatible
              </Badge>
            )}
          </div>
          {analysis && analysis.effectiveness && (
            <div className="text-sm text-gray-600">
              Estimated effectiveness: {analysis.effectiveness}%
            </div>
          )}
        </div>

        {/* Suggestions */}
        {analysis && analysis.suggestions.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Suggested Tones for {domain}</Label>
            <div className="flex flex-wrap gap-2">
              {analysis.suggestions.map((suggestedTone) => {
                const option = toneOptions.find(opt => opt.value === suggestedTone);
                return option ? (
                  <Button
                    key={suggestedTone}
                    variant="outline"
                    size="sm"
                    onClick={() => onToneChange(suggestedTone)}
                    className="flex items-center gap-1"
                  >
                    <option.icon className={`w-3 h-3 ${option.color}`} />
                    {option.label}
                  </Button>
                ) : null;
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
