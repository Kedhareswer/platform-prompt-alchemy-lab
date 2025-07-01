
import { z } from 'zod';

// Emotional prompting types and schemas
export const EmotionalToneSchema = z.enum([
  'neutral',
  'encouraging', 
  'urgent',
  'empathetic',
  'confident',
  'professional',
  'enthusiastic',
  'supportive'
]);

export const EmotionalIntensitySchema = z.enum(['subtle', 'moderate', 'strong']);

export type EmotionalTone = z.infer<typeof EmotionalToneSchema>;
export type EmotionalIntensity = z.infer<typeof EmotionalIntensitySchema>;

export interface EmotionalContext {
  tone: EmotionalTone;
  intensity: EmotionalIntensity;
  domain: string;
  appropriateness: number;
  suggestions: string[];
}

export interface EmotionalAnalysis {
  currentTone: EmotionalTone;
  appropriateness: number;
  suggestions: EmotionalTone[];
  warnings: string[];
  effectiveness: number;
}

export class EmotionalPrompting {
  /**
   * Analyze emotional appropriateness for domain and context
   */
  static analyzeEmotionalAppropriateness(
    prompt: string,
    domain: string,
    tone: EmotionalTone
  ): EmotionalAnalysis {
    const currentTone = this.detectCurrentTone(prompt);
    const appropriateness = this.calculateAppropriateness(tone, domain);
    const suggestions = this.getSuggestedTones(domain);
    const warnings = this.getWarnings(tone, domain);
    const effectiveness = this.calculateEffectiveness(tone, domain, prompt);

    return {
      currentTone,
      appropriateness,
      suggestions,
      warnings,
      effectiveness
    };
  }

  /**
   * Apply emotional enhancement to prompt
   */
  static applyEmotionalEnhancement(
    prompt: string,
    tone: EmotionalTone,
    intensity: EmotionalIntensity,
    domain: string
  ): string {
    // Check if emotional prompting is appropriate for this domain
    if (!this.isEmotionallyAppropriate(tone, domain)) {
      return prompt; // Return unchanged if not appropriate
    }

    const emotionalElements = this.getEmotionalElements(tone, intensity);
    return this.weaveEmotionalElements(prompt, emotionalElements, intensity);
  }

  /**
   * Get emotional context for UI display
   */
  static getEmotionalContext(tone: EmotionalTone, domain: string): EmotionalContext {
    const appropriateness = this.calculateAppropriateness(tone, domain);
    const suggestions = this.getEmotionalSuggestions(tone, domain);

    return {
      tone,
      intensity: 'moderate', // default
      domain,
      appropriateness,
      suggestions
    };
  }

  private static detectCurrentTone(prompt: string): EmotionalTone {
    const lowerPrompt = prompt.toLowerCase();
    
    // Detection patterns for different tones
    const tonePatterns = {
      urgent: ['urgent', 'asap', 'immediately', 'quickly', 'deadline', 'rush'],
      encouraging: ['please', 'help', 'support', 'guide', 'assist'],
      empathetic: ['understand', 'feel', 'appreciate', 'consider'],
      confident: ['will', 'must', 'should', 'expect', 'require'],
      enthusiastic: ['excited', 'amazing', 'fantastic', 'great', 'awesome'],
      professional: ['accordingly', 'therefore', 'consequently', 'furthermore']
    };

    for (const [tone, patterns] of Object.entries(tonePatterns)) {
      if (patterns.some(pattern => lowerPrompt.includes(pattern))) {
        return tone as EmotionalTone;
      }
    }

    return 'neutral';
  }

  private static calculateAppropriateness(tone: EmotionalTone, domain: string): number {
    const appropriatenessMatrix: Record<string, Record<EmotionalTone, number>> = {
      'technology': {
        neutral: 90,
        professional: 95,
        confident: 85,
        encouraging: 70,
        urgent: 60,
        empathetic: 40,
        enthusiastic: 30,
        supportive: 75
      },
      'business': {
        neutral: 85,
        professional: 95,
        confident: 90,
        encouraging: 80,
        urgent: 85,
        empathetic: 70,
        enthusiastic: 60,
        supportive: 75
      },
      'creative': {
        neutral: 70,
        professional: 80,
        confident: 75,
        encouraging: 90,
        urgent: 50,
        empathetic: 85,
        enthusiastic: 95,
        supportive: 90
      },
      'academic': {
        neutral: 95,
        professional: 90,
        confident: 80,
        encouraging: 60,
        urgent: 40,
        empathetic: 70,
        enthusiastic: 30,
        supportive: 65
      },
      'general': {
        neutral: 80,
        professional: 85,
        confident: 80,
        encouraging: 85,
        urgent: 70,
        empathetic: 80,
        enthusiastic: 75,
        supportive: 85
      }
    };

    return appropriatenessMatrix[domain]?.[tone] || 70;
  }

  private static getSuggestedTones(domain: string): EmotionalTone[] {
    const suggestions: Record<string, EmotionalTone[]> = {
      'technology': ['professional', 'neutral', 'confident'],
      'business': ['professional', 'confident', 'urgent'],
      'creative': ['enthusiastic', 'encouraging', 'supportive'],
      'academic': ['neutral', 'professional', 'confident'],
      'general': ['encouraging', 'professional', 'supportive']
    };

    return suggestions[domain] || ['neutral', 'professional'];
  }

  private static getWarnings(tone: EmotionalTone, domain: string): string[] {
    const warnings: string[] = [];
    const appropriateness = this.calculateAppropriateness(tone, domain);

    if (appropriateness < 50) {
      warnings.push(`${tone} tone may not be appropriate for ${domain} domain`);
    }

    if (domain === 'academic' && ['enthusiastic', 'urgent'].includes(tone)) {
      warnings.push('Academic contexts typically require neutral or professional tones');
    }

    if (domain === 'technology' && tone === 'empathetic') {
      warnings.push('Technical contexts may benefit from more direct, solution-focused language');
    }

    return warnings;
  }

  private static calculateEffectiveness(tone: EmotionalTone, domain: string, prompt: string): number {
    const baseAppropriateness = this.calculateAppropriateness(tone, domain);
    const promptLength = prompt.length;
    const complexityBonus = promptLength > 200 ? 10 : 0;
    
    return Math.min(95, baseAppropriateness + complexityBonus);
  }

  private static isEmotionallyAppropriate(tone: EmotionalTone, domain: string): boolean {
    return this.calculateAppropriateness(tone, domain) >= 60;
  }

  private static getEmotionalElements(tone: EmotionalTone, intensity: EmotionalIntensity): Record<string, string[]> {
    const elements: Record<EmotionalTone, Record<EmotionalIntensity, string[]>> = {
      encouraging: {
        subtle: ['please help', 'I would appreciate'],
        moderate: ['please provide guidance', 'I would be grateful for your help'],
        strong: ['I really need your expertise', 'Your guidance would be incredibly valuable']
      },
      urgent: {
        subtle: ['when convenient', 'at your earliest opportunity'],
        moderate: ['as soon as possible', 'this is time-sensitive'],
        strong: ['urgently needed', 'immediate attention required']
      },
      empathetic: {
        subtle: ['understanding that', 'considering the situation'],
        moderate: ['I understand this may be complex', 'recognizing the challenges'],
        strong: ['I deeply appreciate the complexity', 'fully understanding the difficulties']
      },
      confident: {
        subtle: ['I expect', 'should provide'],
        moderate: ['I need a comprehensive solution', 'must deliver results'],
        strong: ['I require definitive answers', 'must provide expert-level guidance']
      },
      professional: {
        subtle: ['accordingly', 'as requested'],
        moderate: ['in accordance with best practices', 'following professional standards'],
        strong: ['adhering to industry standards', 'meeting professional excellence criteria']
      },
      enthusiastic: {
        subtle: ['this is interesting', 'I look forward to'],
        moderate: ['this is exciting', 'I am eager to explore'],
        strong: ['this is incredibly exciting', 'I am thrilled to dive into']
      },
      supportive: {
        subtle: ['to help with', 'in support of'],
        moderate: ['to provide comprehensive support', 'to fully assist with'],
        strong: ['to provide exceptional support', 'to go above and beyond in helping']
      },
      neutral: {
        subtle: [''],
        moderate: [''],
        strong: ['']
      }
    };

    return { [tone]: elements[tone][intensity] };
  }

  private static weaveEmotionalElements(
    prompt: string,
    emotionalElements: Record<string, string[]>,
    intensity: EmotionalIntensity
  ): string {
    const elements = Object.values(emotionalElements).flat().filter(el => el.length > 0);
    if (elements.length === 0) return prompt;

    const element = elements[0];
    
    if (intensity === 'subtle') {
      return `${element}, ${prompt}`;
    } else if (intensity === 'moderate') {
      return `${element}: ${prompt}`;
    } else {
      return `${element}:\n\n${prompt}`;
    }
  }

  private static getEmotionalSuggestions(tone: EmotionalTone, domain: string): string[] {
    const suggestions: Record<string, string[]> = {
      'technology': [
        'Use professional language',
        'Focus on technical accuracy',
        'Provide clear, actionable steps'
      ],
      'business': [
        'Emphasize business value',
        'Include ROI considerations',
        'Use confident, decisive language'
      ],
      'creative': [
        'Encourage exploration',
        'Use inspiring language',
        'Foster creativity and innovation'
      ],
      'academic': [
        'Maintain objectivity',
        'Use precise terminology',
        'Include evidence-based reasoning'
      ]
    };

    return suggestions[domain] || ['Use appropriate tone for context'];
  }
}
