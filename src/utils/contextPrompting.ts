
import { z } from 'zod';

// Context types and schemas
export const ContextTypeSchema = z.enum([
  'situational',
  'background', 
  'domain',
  'temporal',
  'audience'
]);

export const ContextDepthSchema = z.enum(['basic', 'detailed', 'comprehensive']);

export type ContextType = z.infer<typeof ContextTypeSchema>;
export type ContextDepth = z.infer<typeof ContextDepthSchema>;

export interface ContextInfo {
  type: ContextType;
  content: string;
  relevance: number;
  priority: 'low' | 'medium' | 'high';
}

export interface ContextAnalysis {
  missingContext: ContextType[];
  suggestions: ContextInfo[];
  completenessScore: number;
  contextGaps: string[];
}

export class ContextPrompting {
  /**
   * Analyze prompt for missing context
   */
  static analyzeContext(prompt: string, domain: string): ContextAnalysis {
    const lowerPrompt = prompt.toLowerCase();
    const missingContext: ContextType[] = [];
    const suggestions: ContextInfo[] = [];
    const contextGaps: string[] = [];

    // Check for situational context
    if (!this.hasSituationalContext(lowerPrompt)) {
      missingContext.push('situational');
      suggestions.push({
        type: 'situational',
        content: 'Add information about the current situation, environment, or circumstances',
        relevance: 0.8,
        priority: 'medium'
      });
      contextGaps.push('Missing situational context - what\'s the current scenario?');
    }

    // Check for background context
    if (!this.hasBackgroundContext(lowerPrompt)) {
      missingContext.push('background');
      suggestions.push({
        type: 'background',
        content: 'Include relevant background information, history, or previous context',
        relevance: 0.7,
        priority: 'medium'
      });
      contextGaps.push('Missing background - what led to this need?');
    }

    // Check for audience context
    if (!this.hasAudienceContext(lowerPrompt)) {
      missingContext.push('audience');
      suggestions.push({
        type: 'audience',
        content: 'Specify who the response is for and their expertise level',
        relevance: 0.9,
        priority: 'high'
      });
      contextGaps.push('Missing audience context - who is this for?');
    }

    // Check for temporal context
    if (!this.hasTemporalContext(lowerPrompt)) {
      missingContext.push('temporal');
      suggestions.push({
        type: 'temporal',
        content: 'Add time-related context like deadlines, timeframes, or urgency',
        relevance: 0.6,
        priority: 'low'
      });
    }

    // Check for domain-specific context
    if (!this.hasDomainContext(lowerPrompt, domain)) {
      missingContext.push('domain');
      suggestions.push({
        type: 'domain',
        content: `Add ${domain}-specific context, constraints, or requirements`,
        relevance: 0.8,
        priority: 'high'
      });
      contextGaps.push(`Missing ${domain} context - what are the specific requirements?`);
    }

    const completenessScore = Math.max(0, 100 - (missingContext.length * 15));

    return {
      missingContext,
      suggestions,
      completenessScore,
      contextGaps
    };
  }

  /**
   * Apply context enhancement to prompt
   */
  static applyContextEnhancement(
    prompt: string,
    contextInfo: ContextInfo[],
    depth: ContextDepth = 'detailed'
  ): string {
    if (contextInfo.length === 0) return prompt;

    const contextSections = this.organizeContextByType(contextInfo);
    let enhancedPrompt = prompt;

    // Add context header based on depth
    if (depth === 'comprehensive') {
      enhancedPrompt = this.addComprehensiveContext(enhancedPrompt, contextSections);
    } else if (depth === 'detailed') {
      enhancedPrompt = this.addDetailedContext(enhancedPrompt, contextSections);
    } else {
      enhancedPrompt = this.addBasicContext(enhancedPrompt, contextSections);
    }

    return enhancedPrompt;
  }

  private static hasSituationalContext(prompt: string): boolean {
    const situationalKeywords = [
      'currently', 'situation', 'environment', 'context', 'scenario',
      'circumstances', 'setting', 'conditions', 'state'
    ];
    return situationalKeywords.some(keyword => prompt.includes(keyword));
  }

  private static hasBackgroundContext(prompt: string): boolean {
    const backgroundKeywords = [
      'background', 'history', 'previously', 'before', 'past',
      'experience', 'prior', 'already', 'existing'
    ];
    return backgroundKeywords.some(keyword => prompt.includes(keyword));
  }

  private static hasAudienceContext(prompt: string): boolean {
    const audienceKeywords = [
      'audience', 'for', 'users', 'customers', 'team', 'client',
      'beginner', 'expert', 'students', 'professionals'
    ];
    return audienceKeywords.some(keyword => prompt.includes(keyword));
  }

  private static hasTemporalContext(prompt: string): boolean {
    const temporalKeywords = [
      'deadline', 'urgent', 'quickly', 'asap', 'timeline',
      'schedule', 'time', 'date', 'when', 'by'
    ];
    return temporalKeywords.some(keyword => prompt.includes(keyword));
  }

  private static hasDomainContext(prompt: string, domain: string): boolean {
    if (domain === 'general') return true;
    
    const domainKeywords = {
      'technology': ['code', 'programming', 'software', 'technical', 'api'],
      'business': ['revenue', 'strategy', 'market', 'customers', 'roi'],
      'creative': ['design', 'creative', 'artistic', 'visual', 'brand'],
      'academic': ['research', 'study', 'analysis', 'methodology', 'theory']
    };

    const keywords = domainKeywords[domain as keyof typeof domainKeywords] || [];
    return keywords.some(keyword => prompt.includes(keyword));
  }

  private static organizeContextByType(contextInfo: ContextInfo[]): Record<ContextType, ContextInfo[]> {
    const organized: Record<ContextType, ContextInfo[]> = {
      situational: [],
      background: [],
      domain: [],
      temporal: [],
      audience: []
    };

    contextInfo.forEach(info => {
      organized[info.type].push(info);
    });

    return organized;
  }

  private static addComprehensiveContext(prompt: string, contexts: Record<ContextType, ContextInfo[]>): string {
    let enhanced = "## Context & Background\n\n";

    Object.entries(contexts).forEach(([type, infos]) => {
      if (infos.length > 0) {
        enhanced += `### ${type.charAt(0).toUpperCase() + type.slice(1)} Context:\n`;
        infos.forEach(info => {
          enhanced += `- ${info.content}\n`;
        });
        enhanced += "\n";
      }
    });

    enhanced += `## Request\n\n${prompt}`;
    return enhanced;
  }

  private static addDetailedContext(prompt: string, contexts: Record<ContextType, ContextInfo[]>): string {
    const contextStrings: string[] = [];

    Object.entries(contexts).forEach(([type, infos]) => {
      if (infos.length > 0) {
        const contextContent = infos.map(info => info.content).join(', ');
        contextStrings.push(`${type}: ${contextContent}`);
      }
    });

    if (contextStrings.length > 0) {
      return `Context: ${contextStrings.join('; ')}\n\n${prompt}`;
    }

    return prompt;
  }

  private static addBasicContext(prompt: string, contexts: Record<ContextType, ContextInfo[]>): string {
    const allContexts = Object.values(contexts).flat();
    if (allContexts.length === 0) return prompt;

    const contextContent = allContexts
      .filter(info => info.priority !== 'low')
      .map(info => info.content)
      .join(', ');

    return contextContent ? `Given that ${contextContent}, ${prompt}` : prompt;
  }
}
