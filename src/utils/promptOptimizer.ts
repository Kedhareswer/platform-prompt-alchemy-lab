import { SystemPrompt, getSystemPromptByPlatform } from './systemPrompts';
import { PromptEngineer, PromptAnalysis, OptimizationOptions } from './promptEngineering';
import { ModeOptimizer } from './modeOptimization';

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
  domain: string;
}

export class PromptOptimizer {
  static async optimizePrompt(
    userPrompt: string,
    platform: string,
    domain: string,
    options: OptimizationOptions,
    mode: "system" | "normal" = "normal"
  ): Promise<OptimizationResult> {
    // Get system prompt for platform
    const systemPrompt = getSystemPromptByPlatform(platform);
    
    // Analyze the original prompt
    const analysis = PromptEngineer.analyzePrompt(userPrompt);
    
    let optimizedPrompt = "";
    const appliedTechniques: string[] = [];
    
    // Apply mode-specific optimization
    if (mode === "system") {
      optimizedPrompt = ModeOptimizer.optimizeForSystemPrompt(userPrompt, domain, analysis, options);
      appliedTechniques.push("System Prompt Optimization");
    } else {
      optimizedPrompt = ModeOptimizer.optimizeForNormalPrompt(userPrompt, domain, analysis, options);
      appliedTechniques.push("Normal Prompt Optimization");
    }
    
    // Apply additional optimization techniques based on options and analysis
    if (mode === "normal") {
      if (options.useTreeOfThoughts && analysis.complexity === 'expert') {
        optimizedPrompt = PromptEngineer.applyTreeOfThoughts(optimizedPrompt);
        appliedTechniques.push('Tree of Thoughts');
      } else if (options.useChainOfThought && analysis.complexity !== 'simple') {
        optimizedPrompt = PromptEngineer.applyChainOfThought(optimizedPrompt);
        appliedTechniques.push('Chain of Thought');
      }
      
      if (options.useSelfConsistency && analysis.intent === 'problem_solving') {
        optimizedPrompt = PromptEngineer.applySelfConsistency(optimizedPrompt);
        appliedTechniques.push('Self Consistency');
      }
      
      if (options.useReAct && analysis.intent === 'problem_solving') {
        optimizedPrompt = PromptEngineer.applyReActPattern(optimizedPrompt);
        appliedTechniques.push('ReAct Pattern');
      }
    }
    
    if (options.useFewShot && analysis.complexity === 'complex' && mode === "normal") {
      // Add few-shot examples based on domain
      const examples = this.getExamplesForDomain(domain);
      if (examples.length > 0) {
        optimizedPrompt = PromptEngineer.applyFewShotLearning(optimizedPrompt, examples);
        appliedTechniques.push('Few-Shot Learning');
      }
    }
    
    if (options.optimizeForTokens && mode === "normal") {
      optimizedPrompt = PromptEngineer.optimizeForTokens(optimizedPrompt);
      appliedTechniques.push('Token Optimization');
    }
    
    // Calculate token counts
    const originalTokens = this.estimateTokens(userPrompt);
    const optimizedTokens = this.estimateTokens(optimizedPrompt);
    
    // Estimate improvement score
    const estimatedImprovement = this.calculateImprovementScore(
      analysis,
      appliedTechniques.length,
      options,
      domain
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
      },
      domain
    };
  }
  
  private static getExamplesForDomain(domain: string): Array<{input: string, output: string}> {
    const exampleSets = {
      technology: [
        {
          input: "Write a function to sort an array",
          output: "```javascript\nfunction sortArray(arr) {\n  return arr.sort((a, b) => a - b);\n}\n```"
        },
        {
          input: "Explain REST API design",
          output: "REST APIs follow these principles:\n1. Stateless communication\n2. Resource-based URLs\n3. HTTP methods (GET, POST, PUT, DELETE)\n4. JSON data format"
        }
      ],
      creative: [
        {
          input: "Write a short story about time travel",
          output: "The pocket watch ticked backwards as Sarah realized she had exactly thirty minutes to prevent the accident that would change everything..."
        },
        {
          input: "Create a poem about nature",
          output: "Whispers of wind through ancient trees,\nDancing shadows, rustling leaves,\nNature's symphony plays for free,\nA masterpiece for all to see."
        }
      ],
      business: [
        {
          input: "Analyze market trends",
          output: "Market Analysis:\n1. Current trends\n2. Growth indicators\n3. Risk factors\n4. Recommendations"
        }
      ],
      academic: [
        {
          input: "Structure a research paper",
          output: "Research Paper Structure:\n1. Abstract\n2. Introduction\n3. Literature Review\n4. Methodology\n5. Results\n6. Discussion\n7. Conclusion"
        }
      ]
    };
    
    return exampleSets[domain as keyof typeof exampleSets] || [];
  }
  
  private static addAdvancedConstraints(prompt: string, analysis: PromptAnalysis, domain: string): string {
    const constraints = [];
    
    if (analysis.complexity === 'expert') {
      constraints.push("Provide detailed, expert-level explanations with technical depth");
    }
    
    if (analysis.intent === 'creative') {
      constraints.push("Be original and imaginative while maintaining coherence and quality");
    }
    
    if (domain === 'technology') {
      constraints.push("Include code examples, best practices, and technical considerations");
    }
    
    if (domain === 'medical') {
      constraints.push("Emphasize the importance of professional medical consultation");
    }
    
    if (domain === 'legal') {
      constraints.push("Include appropriate legal disclaimers and emphasize professional legal advice");
    }
    
    if (analysis.estimatedTokens > 100) {
      constraints.push("Structure the response with clear sections and headings");
    }
    
    if (constraints.length === 0) return prompt;
    
    return `${prompt}

Advanced Constraints:
${constraints.map(c => `• ${c}`).join('\n')}`;
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
    options: OptimizationOptions,
    domain: string
  ): number {
    let baseScore = 60;
    
    // Add points for complexity handling
    if (analysis.complexity === 'complex' || analysis.complexity === 'expert') {
      baseScore += 15;
    }
    
    // Add points for each technique applied
    baseScore += techniquesApplied * 4;
    
    // Add points for optimization options used
    if (options.useChainOfThought) baseScore += 8;
    if (options.usePersona) baseScore += 6;
    if (options.useReAct) baseScore += 10;
    if (options.useTreeOfThoughts) baseScore += 12;
    if (options.useSelfConsistency) baseScore += 9;
    if (options.useRolePlay) baseScore += 7;
    
    // Add points for domain-specific optimization
    if (domain !== 'general') baseScore += 5;
    
    return Math.min(baseScore, 95);
  }
}
