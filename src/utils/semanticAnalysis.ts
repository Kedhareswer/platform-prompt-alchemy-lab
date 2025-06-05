import { HfInference } from '@huggingface/inference';

// Initialize Hugging Face Inference with environment variable for API key
// Note: Vite uses import.meta.env instead of process.env
const hf = import.meta.env.VITE_HF_ACCESS_TOKEN ? new HfInference(import.meta.env.VITE_HF_ACCESS_TOKEN) : null;

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
   * Analyze prompt quality using a combination of rule-based and ML-based approaches
   */
  static async analyzePromptQuality(prompt: string): Promise<PromptQualityScore> {
    // Basic analysis (fast, rule-based)
    const basicAnalysis = this.basicPromptAnalysis(prompt);
    
    try {
      // Enhanced analysis with ML (slower, requires API)
      const mlAnalysis = await this.mlPromptAnalysis(prompt);
      
      // Combine results with ML analysis having higher weight
      return {
        clarity: Math.round((mlAnalysis.clarity * 0.7) + (basicAnalysis.clarity * 0.3)),
        specificity: Math.round((mlAnalysis.specificity * 0.7) + (basicAnalysis.specificity * 0.3)),
        effectiveness: Math.round((mlAnalysis.effectiveness * 0.7) + (basicAnalysis.effectiveness * 0.3)),
        issues: basicAnalysis.issues // Use issues from basic analysis
      };
    } catch (error) {
      console.warn('Falling back to basic analysis due to ML error:', error);
      return basicAnalysis;
    }
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

  /**
   * Enhanced ML-based prompt analysis using Hugging Face
   */
  private static async mlPromptAnalysis(prompt: string): Promise<Omit<PromptQualityScore, 'issues'>> {
    if (!hf) {
      console.warn('Hugging Face client not initialized. Using basic analysis only.');
      const basic = this.basicPromptAnalysis(prompt);
      return {
        clarity: basic.clarity,
        specificity: basic.specificity,
        effectiveness: basic.effectiveness
      };
    }
    
    try {
      // First, get sentiment analysis
      const sentimentResult = await hf.textClassification({
        model: 'distilbert-base-uncased-finetuned-sst-2-english',
        inputs: prompt
      });

      // Get sentiment score (0-1 where higher is more positive)
      const sentimentScore = sentimentResult?.[0]?.score || 0.5;
      
      // Calculate metrics based on prompt analysis
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
      
      // Calculate base scores (0-10 scale)
      let clarity = 5; // Base score
      let specificity = 5; // Base score
      let effectiveness = 5; // Base score
      
      // Adjust scores based on prompt characteristics
      clarity += Math.min(3, wordCount / 10); // Longer prompts tend to be clearer
      clarity += sentimentScore * 2; // Sentiment contributes to clarity
      
      specificity += hasSpecificTerms ? 2 : 0;
      specificity += hasConstraints ? 2 : 0;
      specificity += hasExamples ? 1 : 0;
      specificity += Math.min(2, wordCount / 25); // Longer prompts tend to be more specific
      
      effectiveness += hasActionVerbs ? 2 : 0;
      effectiveness += hasContextWords ? 1 : 0;
      effectiveness += sentimentScore * 1.5; // Positive sentiment helps effectiveness
      
      // Adjust based on prompt structure
      if (hasQuestionMark) {
        effectiveness = Math.min(10, effectiveness + 1);
      }
      
      if (hasActionVerbs) {
        effectiveness = Math.min(10, effectiveness + 1);
      }
      
      // Ensure scores are within bounds and round to nearest integer
      clarity = Math.min(10, Math.max(1, Math.round(clarity)));
      specificity = Math.min(10, Math.max(1, Math.round(specificity)));
      effectiveness = Math.min(10, Math.max(1, Math.round(effectiveness)));
      
      return { clarity, specificity, effectiveness };
      
    } catch (error) {
      console.warn('ML analysis failed, falling back to basic analysis:', error);
      const basic = this.basicPromptAnalysis(prompt);
      return {
        clarity: basic.clarity,
        specificity: basic.specificity,
        effectiveness: basic.effectiveness
      };
    }
  }

  // Simple helper to check if a string is empty or whitespace
  private static isEmpty(str: string): boolean {
    return !str || str.trim().length === 0;
  }
}
