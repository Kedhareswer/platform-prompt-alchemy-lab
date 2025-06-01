
import { SystemPrompt, getSystemPromptByPlatform } from './systemPrompts';
import { PromptEngineer, PromptAnalysis, OptimizationOptions } from './promptEngineering';

export interface OptimizationResult {
  originalPrompt: string;
  optimizedPrompt: string;
  systemPrompt: SystemPrompt | null;
  analysis: PromptAnalysis;
  appliedTechniques: string[];
  estimatedImprovement: number;
  tokenCount: {
    original: number;
    optimized: number;
  };
}

export class PromptOptimizer {
  static async optimizePrompt(
    userPrompt: string,
    platform: string,
    options: OptimizationOptions
  ): Promise<OptimizationResult> {
    // Get system prompt for platform
    const systemPrompt = getSystemPromptByPlatform(platform);
    
    // Analyze the original prompt
    const analysis = PromptEngineer.analyzePrompt(userPrompt);
    
    let optimizedPrompt = userPrompt;
    const appliedTechniques: string[] = [];
    
    // Apply optimization techniques based on options and analysis
    if (options.useChainOfThought && analysis.complexity !== 'simple') {
      optimizedPrompt = PromptEngineer.applyChainOfThought(optimizedPrompt);
      appliedTechniques.push('Chain of Thought');
    }
    
    if (options.useReAct && analysis.intent === 'problem_solving') {
      optimizedPrompt = PromptEngineer.applyReActPattern(optimizedPrompt);
      appliedTechniques.push('ReAct Pattern');
    }
    
    if (options.usePersona) {
      optimizedPrompt = PromptEngineer.applyPersonaInjection(optimizedPrompt, analysis.domain);
      appliedTechniques.push('Persona Injection');
    }
    
    if (options.useFewShot && analysis.complexity === 'complex') {
      // Add few-shot examples based on domain
      const examples = this.getExamplesForDomain(analysis.domain);
      if (examples.length > 0) {
        optimizedPrompt = PromptEngineer.applyFewShotLearning(optimizedPrompt, examples);
        appliedTechniques.push('Few-Shot Learning');
      }
    }
    
    if (options.useConstraints) {
      optimizedPrompt = this.addConstraints(optimizedPrompt, analysis);
      appliedTechniques.push('Constraint Integration');
    }
    
    if (options.optimizeForTokens) {
      optimizedPrompt = PromptEngineer.optimizeForTokens(optimizedPrompt);
      appliedTechniques.push('Token Optimization');
    }
    
    // Integrate with system prompt if available
    if (systemPrompt) {
      optimizedPrompt = this.integrateSystemPrompt(optimizedPrompt, systemPrompt);
      appliedTechniques.push('System Prompt Integration');
    }
    
    // Calculate token counts
    const originalTokens = this.estimateTokens(userPrompt);
    const optimizedTokens = this.estimateTokens(optimizedPrompt);
    
    // Estimate improvement score
    const estimatedImprovement = this.calculateImprovementScore(
      analysis,
      appliedTechniques.length,
      options
    );
    
    return {
      originalPrompt: userPrompt,
      optimizedPrompt,
      systemPrompt,
      analysis,
      appliedTechniques,
      estimatedImprovement,
      tokenCount: {
        original: originalTokens,
        optimized: optimizedTokens
      }
    };
  }
  
  private static getExamplesForDomain(domain: string): Array<{input: string, output: string}> {
    const exampleSets = {
      technology: [
        {
          input: "Write a function to sort an array",
          output: "```javascript\nfunction sortArray(arr) {\n  return arr.sort((a, b) => a - b);\n}\n```"
        }
      ],
      creative: [
        {
          input: "Write a short story about time travel",
          output: "The pocket watch ticked backwards as Sarah realized she had exactly thirty minutes to prevent the accident that would change everything..."
        }
      ],
      business: [
        {
          input: "Analyze market trends",
          output: "Market Analysis:\n1. Current trends\n2. Growth indicators\n3. Risk factors\n4. Recommendations"
        }
      ]
    };
    
    return exampleSets[domain as keyof typeof exampleSets] || [];
  }
  
  private static addConstraints(prompt: string, analysis: PromptAnalysis): string {
    const constraints = [];
    
    if (analysis.complexity === 'expert') {
      constraints.push("Provide detailed, expert-level explanations");
    }
    
    if (analysis.intent === 'creative') {
      constraints.push("Be original and imaginative while maintaining coherence");
    }
    
    if (analysis.domain === 'technology') {
      constraints.push("Include code examples where relevant");
    }
    
    if (constraints.length === 0) return prompt;
    
    return `${prompt}

Constraints:
${constraints.map(c => `- ${c}`).join('\n')}`;
  }
  
  private static integrateSystemPrompt(userPrompt: string, systemPrompt: SystemPrompt): string {
    return systemPrompt.template
      .replace('{user_prompt}', userPrompt)
      .replace('{current_date}', new Date().toISOString().split('T')[0])
      .replace('{tools_available}', 'web_search, code_execution, image_analysis')
      .replace('{context}', 'User interaction')
      .replace('{programming_language}', 'JavaScript/TypeScript');
  }
  
  private static estimateTokens(text: string): number {
    return Math.ceil(text.split(' ').length * 1.3);
  }
  
  private static calculateImprovementScore(
    analysis: PromptAnalysis,
    techniquesApplied: number,
    options: OptimizationOptions
  ): number {
    let baseScore = 60;
    
    // Add points for complexity handling
    if (analysis.complexity === 'complex' || analysis.complexity === 'expert') {
      baseScore += 15;
    }
    
    // Add points for each technique applied
    baseScore += techniquesApplied * 5;
    
    // Add points for optimization options used
    if (options.useChainOfThought) baseScore += 8;
    if (options.usePersona) baseScore += 6;
    if (options.useReAct) baseScore += 10;
    
    return Math.min(baseScore, 95);
  }
}
