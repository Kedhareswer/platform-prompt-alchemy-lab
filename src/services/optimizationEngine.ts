import { 
  OptimizationResult, 
  OptimizationMode, 
  OptimizationOptions, 
  PromptAnalysis,
  ContextAnalysis,
  EmotionalAnalysis,
  OptimizationSuggestion,
  PerformanceMetrics,
  APIConfiguration
} from '@/types';

export class AdvancedOptimizationEngine {
  private static instance: AdvancedOptimizationEngine;
  private apiConfig: APIConfiguration | null = null;
  private cache: Map<string, any> = new Map();

  private constructor() {}

  static getInstance(): AdvancedOptimizationEngine {
    if (!AdvancedOptimizationEngine.instance) {
      AdvancedOptimizationEngine.instance = new AdvancedOptimizationEngine();
    }
    return AdvancedOptimizationEngine.instance;
  }

  setAPIConfiguration(config: APIConfiguration) {
    this.apiConfig = config;
  }

  async analyzePrompt(prompt: string, mode: OptimizationMode): Promise<PromptAnalysis> {
    const cacheKey = `analysis_${mode}_${this.hashString(prompt)}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const startTime = Date.now();
    
    try {
      const [quality, context, emotional] = await Promise.all([
        this.analyzeQuality(prompt),
        this.analyzeContext(prompt, mode),
        this.analyzeEmotional(prompt, mode)
      ]);

      const suggestions = this.generateSuggestions(quality, context, emotional, mode);

      const analysis: PromptAnalysis = {
        id: Date.now().toString(),
        timestamp: new Date(),
        originalPrompt: prompt,
        quality,
        suggestions,
        context,
        emotional
      };

      // Cache for 5 minutes
      this.cache.set(cacheKey, analysis);
      setTimeout(() => this.cache.delete(cacheKey), 300000);

      return analysis;
    } catch (error) {
      throw new Error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async optimizePrompt(
    prompt: string, 
    mode: OptimizationMode,
    options: OptimizationOptions,
    domain: string = 'general'
  ): Promise<OptimizationResult> {
    const startTime = Date.now();
    const cacheKey = `optimization_${mode}_${this.hashString(prompt + JSON.stringify(options))}`;
    
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    try {
      const analysis = await this.analyzePrompt(prompt, mode);
      
      let optimizedPrompt = prompt;
      const appliedTechniques: string[] = [];

      // Apply mode-specific optimizations
      switch (mode) {
        case 'context':
          optimizedPrompt = await this.applyContextOptimization(prompt, options, analysis.context, domain);
          break;
        case 'emotional':
          optimizedPrompt = await this.applyEmotionalOptimization(prompt, options, analysis.emotional, domain);
          break;
        default:
          optimizedPrompt = await this.applyNormalOptimization(prompt, options, domain);
      }

      // Apply selected techniques
      for (const [technique, enabled] of Object.entries(options)) {
        if (enabled) {
          const { newPrompt, applied } = await this.applyTechnique(optimizedPrompt, technique, mode, domain);
          if (applied) {
            optimizedPrompt = newPrompt;
            appliedTechniques.push(this.formatTechniqueName(technique));
          }
        }
      }

      const processingTime = Date.now() - startTime;
      const originalTokens = this.estimateTokens(prompt);
      const optimizedTokens = this.estimateTokens(optimizedPrompt);

      const result: OptimizationResult = {
        id: Date.now().toString(),
        timestamp: new Date(),
        originalPrompt: prompt,
        optimizedPrompt,
        mode,
        appliedTechniques,
        analysis: {
          complexity: this.assessComplexity(optimizedPrompt),
          intent: this.classifyIntent(optimizedPrompt),
          domain,
          estimatedImprovement: this.calculateImprovement(analysis.quality, appliedTechniques.length),
          strengths: this.identifyStrengths(optimizedPrompt),
          weaknesses: this.identifyWeaknesses(optimizedPrompt),
          recommendedFollowUp: this.generateFollowUpSuggestions(optimizedPrompt, mode)
        },
        tokenCount: {
          original: originalTokens,
          optimized: optimizedTokens,
          saved: Math.max(0, originalTokens - optimizedTokens),
          efficiency: optimizedTokens > 0 ? (originalTokens / optimizedTokens) : 1
        },
        performance: {
          processingTime,
          apiCalls: this.apiConfig ? 1 : 0,
          cacheHits: 0,
          successRate: 1
        }
      };

      // Cache for 10 minutes
      this.cache.set(cacheKey, result);
      setTimeout(() => this.cache.delete(cacheKey), 600000);

      return result;
    } catch (error) {
      throw new Error(`Optimization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async analyzeQuality(prompt: string) {
    const wordCount = prompt.split(/\s+/).length;
    const sentenceCount = prompt.split(/[.!?]+/).filter(Boolean).length;
    
    // Enhanced quality analysis
    const hasActionVerbs = /(create|write|generate|analyze|compare|explain|list|summarize|evaluate|describe|outline|develop|design|implement|solve|provide|build|craft|formulate)/i.test(prompt);
    const hasSpecificTerms = /\d+|[A-Z][a-z]+[A-Z]|\b[A-Z]{2,}\b|\b\w+\d+\w*\b/.test(prompt);
    const hasConstraints = /(must|should|require|need|constrain|limit|only|at least|at most|no more than|less than|greater than|between|range|maximum|minimum)/i.test(prompt);
    const hasContext = /(context|background|given that|assuming|based on|considering)/i.test(prompt);
    const hasExamples = /(for example|e\.g\.|such as|like|including)/i.test(prompt);

    let clarity = Math.min(10, 3 + (wordCount / 10));
    let specificity = hasSpecificTerms ? 7 : 4;
    let effectiveness = hasActionVerbs ? 7 : 4;

    if (hasConstraints) specificity += 2;
    if (hasContext) effectiveness += 2;
    if (hasExamples) clarity += 1;

    clarity = Math.min(10, Math.max(1, Math.round(clarity)));
    specificity = Math.min(10, Math.max(1, Math.round(specificity)));
    effectiveness = Math.min(10, Math.max(1, Math.round(effectiveness)));

    return {
      clarity,
      specificity,
      effectiveness,
      overall: Math.round((clarity + specificity + effectiveness) / 3),
      issues: {
        isVague: wordCount < 10 || !hasSpecificTerms,
        isOverlyBroad: !hasActionVerbs || !hasConstraints,
        lacksContext: !hasContext || wordCount < 15,
        hasAmbiguity: sentenceCount > 0 && (wordCount / sentenceCount) > 25,
        suggestions: this.generateQualitySuggestions(prompt, { hasActionVerbs, hasSpecificTerms, hasConstraints, hasContext, hasExamples })
      }
    };
  }

  private async analyzeContext(prompt: string, mode: OptimizationMode): Promise<ContextAnalysis> {
    const domain = this.detectDomain(prompt);
    const intent = this.classifyIntent(prompt);
    const audience = this.detectAudience(prompt);
    const complexity = this.assessComplexity(prompt);
    const scope = this.assessScope(prompt);

    const detected = { domain, intent, audience, complexity, scope };
    const missing = this.identifyMissingContext(prompt);
    const relevance = this.calculateContextRelevance(detected, missing);
    const suggestions = this.generateContextSuggestions(detected, missing);

    return {
      detected,
      missing,
      relevance,
      suggestions
    };
  }

  private async analyzeEmotional(prompt: string, mode: OptimizationMode): Promise<EmotionalAnalysis> {
    const tone = this.detectEmotionalTone(prompt);
    const intensity = this.detectEmotionalIntensity(prompt);
    const appropriateness = this.assessEmotionalAppropriateness(prompt, tone);
    const effectiveness = this.estimateEmotionalEffectiveness(tone, intensity);
    const warnings = this.generateEmotionalWarnings(prompt, tone, intensity);
    const suggestions = this.suggestAlternativeTones(prompt, tone);

    return {
      tone,
      intensity,
      appropriateness,
      effectiveness,
      warnings,
      suggestions
    };
  }

  private generateSuggestions(quality: any, context: ContextAnalysis, emotional: EmotionalAnalysis, mode: OptimizationMode): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];

    // Quality-based suggestions
    if (quality.clarity < 7) {
      suggestions.push({
        type: 'structure',
        title: 'Improve Clarity',
        description: 'Break down complex sentences and use clearer language',
        impact: 'high',
        effort: 'low',
        category: 'clarity'
      });
    }

    // Context-based suggestions
    if (context.relevance < 70) {
      suggestions.push({
        type: 'context',
        title: 'Add Context',
        description: 'Provide more background information and constraints',
        impact: 'high',
        effort: 'medium',
        category: 'context'
      });
    }

    // Emotional suggestions
    if (emotional.appropriateness < 80) {
      suggestions.push({
        type: 'emotional',
        title: 'Adjust Tone',
        description: 'Consider a more appropriate emotional tone for your domain',
        impact: 'medium',
        effort: 'low',
        category: 'emotion'
      });
    }

    return suggestions;
  }

  private async applyContextOptimization(prompt: string, options: OptimizationOptions, context: ContextAnalysis, domain: string): Promise<string> {
    let optimized = prompt;

    // Add domain-specific context
    if (context.missing.some(m => m.type === 'background')) {
      optimized = `In the context of ${domain}, ${optimized}`;
    }

    // Add audience specification
    if (context.detected.audience === 'general') {
      optimized = `For a professional audience, ${optimized}`;
    }

    // Add constraints if missing
    if (context.missing.some(m => m.type === 'constraints')) {
      optimized += '\n\nPlease provide a comprehensive response with practical examples and clear structure.';
    }

    return optimized;
  }

  private async applyEmotionalOptimization(prompt: string, options: OptimizationOptions, emotional: EmotionalAnalysis, domain: string): Promise<string> {
    let optimized = prompt;

    // Apply tone adjustments
    const toneModifiers = {
      'professional': 'in a professional and respectful manner',
      'encouraging': 'with encouragement and positive reinforcement',
      'empathetic': 'with understanding and compassion',
      'confident': 'with confidence and authority',
      'enthusiastic': 'with enthusiasm and energy'
    };

    const modifier = toneModifiers[emotional.tone as keyof typeof toneModifiers];
    if (modifier && !prompt.includes(modifier)) {
      optimized += ` Please respond ${modifier}.`;
    }

    return optimized;
  }

  private async applyNormalOptimization(prompt: string, options: OptimizationOptions, domain: string): Promise<string> {
    let optimized = prompt;

    // Standard optimization techniques
    if (!prompt.match(/^(create|write|generate|analyze|explain|provide)/i)) {
      optimized = `Please ${optimized.toLowerCase()}`;
    }

    return optimized;
  }

  private async applyTechnique(prompt: string, technique: string, mode: OptimizationMode, domain: string): Promise<{ newPrompt: string; applied: boolean }> {
    let newPrompt = prompt;
    let applied = false;

    switch (technique) {
      case 'useChainOfThought':
        if (!prompt.includes('step-by-step')) {
          newPrompt += '\n\nPlease think through this step-by-step with clear reasoning.';
          applied = true;
        }
        break;

      case 'usePersona':
        if (!prompt.includes('expert') && !prompt.includes('specialist')) {
          newPrompt = `As an expert in ${domain}, ${newPrompt}`;
          applied = true;
        }
        break;

      case 'useConstraints':
        if (!prompt.includes('format') && !prompt.includes('structure')) {
          newPrompt += '\n\nProvide a well-structured response with clear formatting.';
          applied = true;
        }
        break;

      // Add more techniques...
    }

    return { newPrompt, applied };
  }

  // Utility methods
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  }

  private estimateTokens(text: string): number {
    return Math.ceil(text.split(/\s+/).length * 1.3);
  }

  private formatTechniqueName(technique: string): string {
    return technique
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .replace('Use ', '');
  }

  private detectDomain(prompt: string): string {
    const domains = {
      'technology': /(software|code|programming|tech|AI|algorithm|data|computer)/i,
      'business': /(business|marketing|sales|finance|strategy|management)/i,
      'education': /(teach|learn|study|education|academic|school|university)/i,
      'creative': /(creative|art|design|writing|story|music|video)/i,
      'science': /(research|experiment|hypothesis|theory|scientific|analysis)/i
    };

    for (const [domain, regex] of Object.entries(domains)) {
      if (regex.test(prompt)) return domain;
    }
    return 'general';
  }

  private classifyIntent(prompt: string): string {
    if (prompt.includes('?')) return 'question';
    if (/(create|generate|write|build|make)/i.test(prompt)) return 'creation';
    if (/(analyze|evaluate|compare|assess)/i.test(prompt)) return 'analysis';
    if (/(explain|describe|define|clarify)/i.test(prompt)) return 'explanation';
    return 'instruction';
  }

  private detectAudience(prompt: string): string {
    if (/(beginner|new|simple|basic)/i.test(prompt)) return 'beginner';
    if (/(expert|advanced|professional|technical)/i.test(prompt)) return 'expert';
    if (/(student|learn|education)/i.test(prompt)) return 'student';
    return 'general';
  }

  private assessComplexity(prompt: string): 'simple' | 'moderate' | 'complex' | 'expert' {
    const wordCount = prompt.split(/\s+/).length;
    const technicalTerms = (prompt.match(/\b[A-Z][a-z]*[A-Z]\w*\b/g) || []).length;
    
    if (wordCount < 10 && technicalTerms === 0) return 'simple';
    if (wordCount < 20 && technicalTerms < 3) return 'moderate';
    if (wordCount < 50 && technicalTerms < 5) return 'complex';
    return 'expert';
  }

  private assessScope(prompt: string): 'narrow' | 'broad' | 'comprehensive' {
    const wordCount = prompt.split(/\s+/).length;
    const hasMultipleRequests = (prompt.match(/and|also|additionally|furthermore/gi) || []).length;
    
    if (wordCount < 15 && hasMultipleRequests === 0) return 'narrow';
    if (wordCount < 30 && hasMultipleRequests < 3) return 'broad';
    return 'comprehensive';
  }

  private identifyMissingContext(prompt: string) {
    const missing = [];
    
    if (!/(context|background|given|assuming)/i.test(prompt)) {
      missing.push({
        type: 'background' as const,
        description: 'Missing background context',
        priority: 'medium' as const
      });
    }
    
    if (!/(must|should|require|format|structure)/i.test(prompt)) {
      missing.push({
        type: 'constraints' as const,
        description: 'Missing constraints or requirements',
        priority: 'high' as const
      });
    }
    
    return missing;
  }

  private calculateContextRelevance(detected: any, missing: any[]): number {
    let relevance = 70; // Base score
    
    if (detected.domain !== 'general') relevance += 10;
    if (detected.audience !== 'general') relevance += 10;
    if (detected.complexity !== 'simple') relevance += 5;
    
    relevance -= missing.length * 10;
    
    return Math.max(0, Math.min(100, relevance));
  }

  private generateContextSuggestions(detected: any, missing: any[]) {
    return missing.map(m => ({
      type: m.type,
      content: `Add ${m.type} information to improve context`,
      reasoning: `This will help clarify the ${m.type} for better results`
    }));
  }

  private detectEmotionalTone(prompt: string): any {
    // Simplified emotion detection
    if (/(urgent|immediately|asap|quickly)/i.test(prompt)) return 'urgent';
    if (/(please|kindly|would you)/i.test(prompt)) return 'professional';
    if (/(help|support|assist)/i.test(prompt)) return 'supportive';
    return 'neutral';
  }

  private detectEmotionalIntensity(prompt: string): any {
    const intensityMarkers = (prompt.match(/[!]{1,}/g) || []).length;
    const urgentWords = (prompt.match(/(very|extremely|absolutely|definitely|critically)/gi) || []).length;
    
    if (intensityMarkers > 1 || urgentWords > 2) return 'strong';
    if (intensityMarkers > 0 || urgentWords > 0) return 'moderate';
    return 'subtle';
  }

  private assessEmotionalAppropriateness(prompt: string, tone: any): number {
    // Simplified appropriateness assessment
    return 85; // Default high appropriateness
  }

  private estimateEmotionalEffectiveness(tone: any, intensity: any): number {
    // Simplified effectiveness estimation
    const baseEffectiveness = 75;
    if (tone === 'professional') return baseEffectiveness + 10;
    if (tone === 'encouraging') return baseEffectiveness + 15;
    return baseEffectiveness;
  }

  private generateEmotionalWarnings(prompt: string, tone: any, intensity: any): string[] {
    const warnings = [];
    if (intensity === 'strong' && tone === 'urgent') {
      warnings.push('High intensity and urgent tone may come across as demanding');
    }
    return warnings;
  }

  private suggestAlternativeTones(prompt: string, currentTone: any): any[] {
    return ['professional', 'encouraging', 'supportive'].filter(t => t !== currentTone);
  }

  private calculateImprovement(quality: any, techniquesCount: number): number {
    const baseImprovement = (10 - quality.overall) * 5;
    const techniqueBonus = techniquesCount * 8;
    return Math.min(95, baseImprovement + techniqueBonus);
  }

  private identifyStrengths(prompt: string): string[] {
    const strengths = [];
    if (prompt.includes('?')) strengths.push('Clear question format');
    if (/(create|generate|analyze)/i.test(prompt)) strengths.push('Clear action directive');
    if (prompt.length > 50) strengths.push('Detailed description');
    return strengths;
  }

  private identifyWeaknesses(prompt: string): string[] {
    const weaknesses = [];
    if (prompt.length < 20) weaknesses.push('Could be more detailed');
    if (!/[.!?]$/.test(prompt)) weaknesses.push('Missing punctuation');
    return weaknesses;
  }

  private generateFollowUpSuggestions(prompt: string, mode: OptimizationMode): string[] {
    return [
      'Consider adding specific examples',
      'Try testing with different parameters',
      'Refine based on initial results'
    ];
  }

  private generateQualitySuggestions(prompt: string, analysis: any): string[] {
    const suggestions = [];
    if (!analysis.hasActionVerbs) suggestions.push('Start with an action verb');
    if (!analysis.hasSpecificTerms) suggestions.push('Add specific terms or numbers');
    if (!analysis.hasConstraints) suggestions.push('Include constraints or requirements');
    return suggestions;
  }
}