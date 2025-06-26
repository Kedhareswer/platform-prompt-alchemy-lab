export interface PromptQualityScore {
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

export class SemanticAnalyzer {
  /**
   * Analyze prompt quality using a rule-based approach
   */
  static async analyzePromptQuality(prompt: string): Promise<PromptQualityScore> {
    // Basic analysis (rule-based)
    return this.basicPromptAnalysis(prompt);
  }

  /**
   * Basic rule-based prompt analysis
   */
  private static basicPromptAnalysis(prompt: string): PromptQualityScore {
    // Handle empty or whitespace-only prompts
    if (this.isEmpty(prompt)) {
      return {
        clarity: 1,
        specificity: 1,
        effectiveness: 1,
        issues: {
          isVague: true,
          isOverlyBroad: true,
          lacksContext: true,
          suggestions: ['Please enter a prompt to analyze.']
        }
      };
    }

    // Count various elements for analysis
    const wordCount = prompt.split(/\s+/).length;
    const sentenceCount = prompt.split(/[.!?]+/).filter(Boolean).length;
    const avgWordsPerSentence = wordCount / Math.max(1, sentenceCount);
    
    // Check for key elements
    const hasQuestionMark = prompt.includes('?');
    const hasExclamation = prompt.includes('!');
    const hasActionVerbs = /(create|write|generate|analyze|compare|explain|list|summarize|evaluate|describe|outline|develop|design|implement|solve)/i.test(prompt);
    const hasContextWords = /(context|background|given that|assuming|based on|considering)/i.test(prompt);
    const hasConstraints = /(must|should|require|need|constrain|limit|only|at least|at most|no more than|less than|greater than|between|range|maximum|minimum)/i.test(prompt);
    const hasExamples = /(for example|e\.g\.|such as|like|including|such as)/i.test(prompt);
    const hasSpecificTerms = /\d+|[A-Z][a-z]+[A-Z]|\b[A-Z]{2,}\b|\b\w+\d+\w*\b/.test(prompt);
    
    // Calculate quality metrics
    let clarity = 5; // Base score
    let specificity = 5; // Base score
    let effectiveness = 5; // Base score
    
    // Adjust scores based on prompt characteristics
    clarity += Math.min(3, wordCount / 10); // Longer prompts tend to be clearer
    specificity += hasSpecificTerms ? 2 : 0;
    specificity += hasConstraints ? 2 : 0;
    specificity += hasExamples ? 1 : 0;
    effectiveness += hasActionVerbs ? 2 : 0;
    effectiveness += hasContextWords ? 1 : 0;
    
    // Check for common issues
    const issues = {
      isVague: wordCount < 10 || !hasSpecificTerms,
      isOverlyBroad: !hasActionVerbs || !hasConstraints,
      lacksContext: !hasContextWords || wordCount < 15,
      suggestions: [] as string[]
    };

    // Generate specific suggestions
    if (wordCount < 10) {
      issues.suggestions.push("Your prompt is too short. Try to be more specific and provide more details.");
    }
    
    if (!hasActionVerbs) {
      issues.suggestions.push("Start your prompt with an action verb (e.g., 'Create', 'Write', 'Analyze') to make it more directive.");
    }
    
    if (!hasSpecificTerms) {
      issues.suggestions.push("Include specific terms, numbers, or proper nouns to make your prompt more precise.");
    }
    
    if (!hasConstraints) {
      issues.suggestions.push("Add constraints or requirements to guide the response (e.g., 'in 3 bullet points', 'in 100 words').");
    }
    
    if (!hasContextWords) {
      issues.suggestions.push("Provide more context or background information to get a more relevant response.");
    }
    
    if (!hasExamples && wordCount > 15) {
      issues.suggestions.push("Consider adding examples to clarify your request.");
    }
    
    if (avgWordsPerSentence > 20) {
      issues.suggestions.push("Your prompt contains long sentences. Try breaking them into shorter, clearer sentences.");
    }
    
    // Ensure scores are within bounds
    clarity = Math.min(10, Math.max(1, Math.round(clarity)));
    specificity = Math.min(10, Math.max(1, Math.round(specificity)));
    effectiveness = Math.min(10, Math.max(1, Math.round(effectiveness)));
    
    // If it's a question, adjust effectiveness
    if (hasQuestionMark) {
      effectiveness = Math.min(10, effectiveness + 1);
    }

    return {
      clarity,
      specificity,
      effectiveness,
      issues
    };
  }

  // Simple helper to check if a string is empty or whitespace
  private static isEmpty(str: string): boolean {
    return !str || str.trim().length === 0;
  }
}