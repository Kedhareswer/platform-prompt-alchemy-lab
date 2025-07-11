import { z } from 'zod';

// Enhanced prompt analysis schema
export const EnhancedPromptAnalysisSchema = z.object({
  // Core analysis
  complexity: z.enum(['simple', 'moderate', 'complex', 'expert']),
  intent: z.enum(['informational', 'creative', 'problem_solving', 'persuasive', 'analytical', 'instructional']),
  domain: z.string(),
  
  // Semantic analysis
  semanticStructure: z.object({
    coherence: z.number().min(0).max(100),
    clarity: z.number().min(0).max(100),
    completeness: z.number().min(0).max(100),
    specificity: z.number().min(0).max(100)
  }),
  
  // Context analysis
  contextFactors: z.object({
    hasBackground: z.boolean(),
    hasConstraints: z.boolean(),
    hasExamples: z.boolean(),
    hasGoals: z.boolean(),
    emotionalTone: z.enum(['neutral', 'positive', 'negative', 'professional', 'casual', 'urgent'])
  }),
  
  // Quality prediction
  qualityPrediction: z.object({
    estimatedEffectiveness: z.number().min(0).max(100),
    improvementPotential: z.number().min(0).max(100),
    confidenceScore: z.number().min(0).max(100)
  }),
  
  // Recommendations
  recommendedTechniques: z.array(z.string()),
  optimizationPriority: z.enum(['low', 'medium', 'high', 'critical']),
  
  // Meta information
  tokenEstimate: z.number(),
  readabilityScore: z.number().min(0).max(100),
  
  // Issues and improvements
  identifiedIssues: z.array(z.object({
    type: z.string(),
    severity: z.enum(['low', 'medium', 'high']),
    description: z.string(),
    solution: z.string()
  }))
});

export type EnhancedPromptAnalysis = z.infer<typeof EnhancedPromptAnalysisSchema>;

// Advanced optimization technique definitions
export interface OptimizationTechnique {
  id: string;
  name: string;
  category: 'structure' | 'context' | 'reasoning' | 'emotional' | 'domain' | 'meta';
  description: string;
  applicability: {
    complexity: Array<'simple' | 'moderate' | 'complex' | 'expert'>;
    intent: Array<'informational' | 'creative' | 'problem_solving' | 'persuasive' | 'analytical' | 'instructional'>;
    domains: string[];
  };
  implementation: (prompt: string, context?: any) => string;
  effectiveness: number; // 1-100 score
}

export class AdvancedPromptEngine {
  private static techniques: OptimizationTechnique[] = [
    // Meta-prompting techniques
    {
      id: 'meta_instruction',
      name: 'Meta-Instruction Enhancement',
      category: 'meta',
      description: 'Add meta-instructions about how to approach the task',
      applicability: {
        complexity: ['complex', 'expert'],
        intent: ['problem_solving', 'analytical', 'instructional'],
        domains: ['technology', 'academic', 'business']
      },
      implementation: (prompt: string) => `${prompt}

Please approach this task with the following meta-instructions:
1. Break down complex problems into manageable components
2. Provide step-by-step reasoning for your approach
3. Consider multiple perspectives and potential solutions
4. Validate your reasoning and check for logical consistency
5. Provide practical, actionable recommendations`,
      effectiveness: 85
    },

    // Constitutional AI approach
    {
      id: 'constitutional_ai',
      name: 'Constitutional AI Principles',
      category: 'meta',
      description: 'Apply constitutional AI principles for better alignment',
      applicability: {
        complexity: ['moderate', 'complex', 'expert'],
        intent: ['problem_solving', 'analytical', 'persuasive'],
        domains: ['business', 'legal', 'academic']
      },
      implementation: (prompt: string) => `${prompt}

Please adhere to these constitutional principles in your response:
- Be helpful, harmless, and honest
- Provide balanced perspectives and acknowledge limitations
- Consider ethical implications and potential consequences
- Ensure accuracy and cite uncertainties
- Respect diverse viewpoints and cultural sensitivities`,
      effectiveness: 80
    },

    // Advanced STAR framework
    {
      id: 'star_framework',
      name: 'STAR Framework (Situation-Task-Action-Result)',
      category: 'structure',
      description: 'Structure responses using STAR methodology',
      applicability: {
        complexity: ['moderate', 'complex'],
        intent: ['problem_solving', 'instructional'],
        domains: ['business', 'technology', 'academic']
      },
      implementation: (prompt: string) => `${prompt}

Please structure your response using the STAR framework:
- SITUATION: Describe the context and background
- TASK: Define what needs to be accomplished
- ACTION: Detail the specific steps and methodology
- RESULT: Explain expected outcomes and success metrics`,
      effectiveness: 78
    },

    // Problem-solution-benefit structure
    {
      id: 'problem_solution_benefit',
      name: 'Problem-Solution-Benefit Structure',
      category: 'structure',
      description: 'Organize content around problems, solutions, and benefits',
      applicability: {
        complexity: ['moderate', 'complex'],
        intent: ['problem_solving', 'persuasive'],
        domains: ['business', 'technology']
      },
      implementation: (prompt: string) => `${prompt}

Please organize your response as follows:
1. PROBLEM: Clearly identify and define the core challenges
2. SOLUTION: Provide detailed, actionable solutions
3. BENEFITS: Explain the advantages and positive outcomes
4. IMPLEMENTATION: Include practical next steps`,
      effectiveness: 82
    },

    // Advanced emotional intelligence
    {
      id: 'emotional_intelligence',
      name: 'Emotional Intelligence Enhancement',
      category: 'emotional',
      description: 'Incorporate emotional awareness and empathy',
      applicability: {
        complexity: ['simple', 'moderate', 'complex'],
        intent: ['creative', 'persuasive'],
        domains: ['creative', 'business', 'education']
      },
      implementation: (prompt: string) => `${prompt}

Please incorporate emotional intelligence in your response:
- Acknowledge the emotional context and human perspective
- Use empathetic language and tone appropriate to the situation
- Consider the emotional impact of recommendations
- Provide supportive and encouraging guidance
- Address potential concerns or anxieties`,
      effectiveness: 75
    },

    // Multi-perspective analysis
    {
      id: 'multi_perspective',
      name: 'Multi-Perspective Analysis',
      category: 'reasoning',
      description: 'Analyze from multiple stakeholder perspectives',
      applicability: {
        complexity: ['complex', 'expert'],
        intent: ['analytical', 'problem_solving'],
        domains: ['business', 'academic', 'legal']
      },
      implementation: (prompt: string) => `${prompt}

Please analyze this from multiple perspectives:
1. Stakeholder Analysis: Consider different parties affected
2. Short-term vs Long-term: Evaluate immediate and future implications
3. Risk vs Reward: Assess potential benefits and drawbacks
4. Alternative Viewpoints: Present contrasting but valid perspectives
5. Synthesis: Integrate insights from different angles`,
      effectiveness: 88
    },

    // Domain-specific expertise injection
    {
      id: 'expert_domain_injection',
      name: 'Expert Domain Knowledge Injection',
      category: 'domain',
      description: 'Apply deep domain-specific expertise and terminology',
      applicability: {
        complexity: ['complex', 'expert'],
        intent: ['instructional', 'analytical'],
        domains: ['technology', 'medical', 'legal', 'finance']
      },
      implementation: (prompt: string, context?: { domain?: string }) => {
        const domain = context?.domain || 'general';
        return `As a recognized expert in ${domain} with deep domain knowledge and practical experience, ${prompt}

Please incorporate:
- Industry-specific terminology and concepts
- Current best practices and standards
- Real-world case studies and examples
- Potential challenges and solutions specific to this domain
- Latest developments and trends in the field`;
      },
      effectiveness: 90
    },

    // Quality assurance prompting
    {
      id: 'quality_assurance',
      name: 'Quality Assurance Framework',
      category: 'meta',
      description: 'Add quality checks and validation steps',
      applicability: {
        complexity: ['moderate', 'complex', 'expert'],
        intent: ['analytical', 'instructional'],
        domains: ['technology', 'academic', 'business']
      },
      implementation: (prompt: string) => `${prompt}

Please apply this quality assurance framework:
1. Accuracy Check: Verify all facts and claims
2. Completeness Review: Ensure all aspects are covered
3. Consistency Validation: Check for logical coherence
4. Clarity Assessment: Ensure clear communication
5. Actionability Test: Confirm recommendations are practical
6. Risk Evaluation: Identify potential issues or limitations`,
      effectiveness: 83
    }
  ];

  // Advanced semantic analysis using multiple NLP techniques
  static analyzeSemanticStructure(prompt: string): EnhancedPromptAnalysis['semanticStructure'] {
    const words = prompt.split(/\s+/);
    const sentences = prompt.split(/[.!?]+/).filter(Boolean);
    
    // Coherence analysis
    const hasLogicalFlow = this.hasLogicalFlow(prompt);
    const hasConnectors = /\b(therefore|however|furthermore|moreover|consequently|additionally|meanwhile)\b/i.test(prompt);
    const coherence = (hasLogicalFlow ? 40 : 0) + (hasConnectors ? 30 : 0) + Math.min(30, sentences.length * 5);
    
    // Clarity analysis
    const avgWordsPerSentence = words.length / Math.max(1, sentences.length);
    const complexWords = words.filter(word => word.length > 8).length;
    const clarityScore = Math.max(0, 100 - (avgWordsPerSentence > 20 ? 30 : 0) - (complexWords / words.length > 0.3 ? 25 : 0));
    
    // Completeness analysis
    const hasContext = /\b(context|background|given|assuming|considering)\b/i.test(prompt);
    const hasGoals = /\b(goal|objective|aim|purpose|want|need)\b/i.test(prompt);
    const hasConstraints = /\b(must|should|require|within|limit|constraint)\b/i.test(prompt);
    const completeness = (hasContext ? 30 : 0) + (hasGoals ? 35 : 0) + (hasConstraints ? 35 : 0);
    
    // Specificity analysis
    const hasNumbers = /\d/.test(prompt);
    const hasProperNouns = /\b[A-Z][a-z]+\b/.test(prompt);
    const hasSpecificTerms = /\b(specific|exactly|precisely|detailed)\b/i.test(prompt);
    const specificity = (hasNumbers ? 25 : 0) + (hasProperNouns ? 30 : 0) + (hasSpecificTerms ? 25 : 0) + Math.min(20, words.length / 10);
    
    return {
      coherence: Math.min(100, Math.max(0, coherence)),
      clarity: Math.min(100, Math.max(0, clarityScore)),
      completeness: Math.min(100, Math.max(0, completeness)),
      specificity: Math.min(100, Math.max(0, specificity))
    };
  }

  // Analyze context factors
  static analyzeContextFactors(prompt: string): EnhancedPromptAnalysis['contextFactors'] {
    const lowerPrompt = prompt.toLowerCase();
    
    return {
      hasBackground: /\b(background|context|given|assuming|based on|considering)\b/i.test(prompt),
      hasConstraints: /\b(must|should|require|within|limit|constraint|no more than|at least)\b/i.test(prompt),
      hasExamples: /\b(example|for instance|such as|like|including|e\.g\.)\b/i.test(prompt),
      hasGoals: /\b(goal|objective|aim|purpose|want|need|achieve|accomplish)\b/i.test(prompt),
      emotionalTone: this.detectEmotionalTone(prompt)
    };
  }

  // Predict quality and improvement potential
  static predictQuality(prompt: string, semanticStructure: any, contextFactors: any): EnhancedPromptAnalysis['qualityPrediction'] {
    const avgSemantic = (semanticStructure.coherence + semanticStructure.clarity + semanticStructure.completeness + semanticStructure.specificity) / 4;
    const contextScore = Object.values(contextFactors).filter(v => typeof v === 'boolean' ? v : true).length * 20;
    
    const estimatedEffectiveness = Math.min(100, (avgSemantic * 0.6) + (contextScore * 0.4));
    const improvementPotential = Math.max(0, 100 - estimatedEffectiveness);
    const confidenceScore = Math.min(100, 60 + (prompt.split(/\s+/).length > 20 ? 20 : 0) + (avgSemantic > 70 ? 20 : 0));
    
    return {
      estimatedEffectiveness: Math.round(estimatedEffectiveness),
      improvementPotential: Math.round(improvementPotential),
      confidenceScore: Math.round(confidenceScore)
    };
  }

  // Intelligent technique selection based on prompt characteristics
  static selectOptimalTechniques(analysis: EnhancedPromptAnalysis): OptimizationTechnique[] {
    const selectedTechniques = this.techniques.filter(technique => {
      // Check complexity match
      const complexityMatch = technique.applicability.complexity.includes(analysis.complexity);
      
      // Check intent match
      const intentMatch = technique.applicability.intent.includes(analysis.intent);
      
      // Check domain relevance (if specific domain techniques exist)
      const domainMatch = technique.applicability.domains.length === 0 || 
                         technique.applicability.domains.includes(analysis.domain) ||
                         technique.applicability.domains.includes('general');
      
      // Quality-based selection
      const needsImprovement = analysis.qualityPrediction.improvementPotential > 30;
      
      return complexityMatch && intentMatch && domainMatch && needsImprovement;
    });

    // Sort by effectiveness and return top techniques
    return selectedTechniques
      .sort((a, b) => b.effectiveness - a.effectiveness)
      .slice(0, 3); // Return top 3 techniques
  }

  // Comprehensive prompt analysis
  static async analyzePrompt(prompt: string, domain: string = 'general'): Promise<EnhancedPromptAnalysis> {
    // Basic classification
    const complexity = this.classifyComplexity(prompt);
    const intent = this.classifyIntent(prompt);
    
    // Advanced analysis
    const semanticStructure = this.analyzeSemanticStructure(prompt);
    const contextFactors = this.analyzeContextFactors(prompt);
    const qualityPrediction = this.predictQuality(prompt, semanticStructure, contextFactors);
    
    // Generate issues and recommendations
    const identifiedIssues = this.identifyIssues(prompt, semanticStructure, contextFactors);
    
    // Create preliminary analysis for technique selection
    const preliminaryAnalysis = {
      complexity,
      intent,
      domain,
      semanticStructure,
      contextFactors,
      qualityPrediction,
      recommendedTechniques: [],
      optimizationPriority: 'medium' as const,
      tokenEstimate: this.estimateTokens(prompt),
      readabilityScore: this.calculateReadabilityScore(prompt),
      identifiedIssues
    };
    
    // Select optimal techniques
    const optimalTechniques = this.selectOptimalTechniques(preliminaryAnalysis);
    const recommendedTechniques = optimalTechniques.map(t => t.id);
    
    // Determine optimization priority
    const optimizationPriority = qualityPrediction.improvementPotential > 60 ? 'high' : 
                                qualityPrediction.improvementPotential > 30 ? 'medium' : 'low';
    
    return {
      ...preliminaryAnalysis,
      recommendedTechniques,
      optimizationPriority: optimizationPriority as 'low' | 'medium' | 'high' | 'critical'
    };
  }

  // Apply selected optimization techniques
  static applyOptimization(prompt: string, techniqueIds: string[], context?: any): string {
    let optimizedPrompt = prompt;
    
    for (const techniqueId of techniqueIds) {
      const technique = this.techniques.find(t => t.id === techniqueId);
      if (technique) {
        optimizedPrompt = technique.implementation(optimizedPrompt, context);
      }
    }
    
    return optimizedPrompt;
  }

  // Helper methods
  private static classifyComplexity(prompt: string): 'simple' | 'moderate' | 'complex' | 'expert' {
    const wordCount = prompt.split(/\s+/).length;
    const sentenceCount = prompt.split(/[.!?]+/).filter(Boolean).length;
    const avgWordsPerSentence = wordCount / Math.max(1, sentenceCount);
    
    if (wordCount > 200 || avgWordsPerSentence > 25) return 'expert';
    if (wordCount > 100 || avgWordsPerSentence > 20) return 'complex';
    if (wordCount > 30) return 'moderate';
    return 'simple';
  }

  private static classifyIntent(prompt: string): 'informational' | 'creative' | 'problem_solving' | 'persuasive' | 'analytical' | 'instructional' {
    const lowerPrompt = prompt.toLowerCase();
    
    if (/\b(create|write|imagine|story|design|artistic)\b/i.test(prompt)) return 'creative';
    if (/\b(analyze|compare|evaluate|assess|examine|study)\b/i.test(prompt)) return 'analytical';
    if (/\b(solve|fix|resolve|address|tackle|overcome)\b/i.test(prompt)) return 'problem_solving';
    if (/\b(convince|persuade|argue|prove|justify)\b/i.test(prompt)) return 'persuasive';
    if (/\b(how to|teach|explain|instruct|guide|steps)\b/i.test(prompt)) return 'instructional';
    
    return 'informational';
  }

  private static hasLogicalFlow(prompt: string): boolean {
    const sentences = prompt.split(/[.!?]+/).filter(Boolean);
    if (sentences.length < 2) return true;
    
    // Check for logical connectors and structure
    const hasSequence = /\b(first|second|then|next|finally|lastly)\b/i.test(prompt);
    const hasCausality = /\b(because|since|therefore|thus|consequently)\b/i.test(prompt);
    const hasComparison = /\b(however|but|although|while|whereas)\b/i.test(prompt);
    
    return hasSequence || hasCausality || hasComparison;
  }

  private static detectEmotionalTone(prompt: string): 'neutral' | 'positive' | 'negative' | 'professional' | 'casual' | 'urgent' {
    const lowerPrompt = prompt.toLowerCase();
    
    if (/\b(urgent|asap|immediately|quickly|rush|emergency)\b/i.test(prompt)) return 'urgent';
    if (/\b(please|thank you|appreciate|kindly|would you mind)\b/i.test(prompt)) return 'professional';
    if (/\b(hey|hi|lol|btw|awesome|cool)\b/i.test(prompt)) return 'casual';
    if (/\b(problem|issue|wrong|error|failed|disappointed)\b/i.test(prompt)) return 'negative';
    if (/\b(great|excellent|amazing|wonderful|fantastic)\b/i.test(prompt)) return 'positive';
    
    return 'neutral';
  }

  private static identifyIssues(prompt: string, semanticStructure: any, contextFactors: any): Array<{ type: string; severity: 'low' | 'medium' | 'high'; description: string; solution: string }> {
    const issues = [];
    
    if (semanticStructure.clarity < 60) {
      issues.push({
        type: 'clarity',
        severity: 'medium' as const,
        description: 'Prompt lacks clarity and may be difficult to understand',
        solution: 'Simplify sentence structure and use clearer language'
      });
    }
    
    if (semanticStructure.specificity < 50) {
      issues.push({
        type: 'specificity',
        severity: 'high' as const,
        description: 'Prompt is too vague and lacks specific details',
        solution: 'Add specific examples, constraints, and detailed requirements'
      });
    }
    
    if (!contextFactors.hasGoals) {
      issues.push({
        type: 'goals',
        severity: 'medium' as const,
        description: 'No clear goals or objectives specified',
        solution: 'Clearly state what you want to achieve or accomplish'
      });
    }
    
    return issues;
  }

  private static estimateTokens(text: string): number {
    return Math.ceil(text.split(/\s+/).length * 1.3);
  }

  private static calculateReadabilityScore(text: string): number {
    const words = text.split(/\s+/);
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    const avgWordsPerSentence = words.length / Math.max(1, sentences.length);
    
    // Simple readability calculation (lower is better, but we invert for score)
    const baseScore = Math.max(0, 100 - (avgWordsPerSentence > 20 ? 30 : 0));
    return Math.min(100, baseScore);
  }
}