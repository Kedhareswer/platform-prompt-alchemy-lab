
import { EnhancedPromptAnalysis, QualityPredictionModel, AdvancedOptimizationResult } from "@/hooks/useAdvancedOptimization";
import { DomainPatternService } from "@/services/domainPatterns";

// Mock analysis generator for when real API isn't available
export const generateMockAnalysis = (prompt: string): EnhancedPromptAnalysis => {
  // Basic text analysis
  const wordCount = prompt.split(/\s+/).length;
  const hasQuestion = prompt.includes('?');
  const hasActionVerbs = /(create|write|generate|analyze|compare|explain|list|summarize|evaluate|describe|outline|develop|design|implement|solve)/i.test(prompt);
  const hasConstraints = /(must|should|require|need|constrain|limit|only|at least|at most|no more than|less than|greater than|between|range|maximum|minimum)/i.test(prompt);
  const hasContext = /(context|background|given that|assuming|based on|considering)/i.test(prompt);
  const hasExamples = /(for example|e\.g\.|such as|like|including)/i.test(prompt);
  const hasSpecifics = /\d+|[A-Z][a-z]+[A-Z]|\b[A-Z]{2,}\b|\b\w+\d+\w*\b/.test(prompt);
  
  // Calculate mock quality scores
  const clarity = Math.min(10, 3 + (wordCount / 10)) * 10;
  let specificity = (hasSpecifics ? 7 : 4) * 10;
  let coherence = 6 * 10;
  
  if (hasConstraints) specificity += 20;
  if (hasContext) coherence += 20;
  
  // Calculate complexity
  let complexity: 'simple' | 'moderate' | 'complex' | 'expert';
  if (wordCount < 10) complexity = 'simple';
  else if (wordCount < 30) complexity = 'moderate';
  else if (wordCount < 60) complexity = 'complex';
  else complexity = 'expert';
  
  // Determine intent
  let intent;
  if (hasQuestion) intent = 'question';
  else if (/(create|write|generate|build|design)/i.test(prompt)) intent = 'creation';
  else if (/(analyze|evaluate|assess|compare)/i.test(prompt)) intent = 'analysis';
  else if (/(explain|describe|clarify|define)/i.test(prompt)) intent = 'explanation';
  else intent = 'instruction';
  
  // Domain detection
  const domain = DomainPatternService.detectDomain(prompt);
  
  // Generate issues
  const issues = [];
  
  if (wordCount < 15) {
    issues.push({
      type: 'specificity',
      description: 'The prompt is too short and lacks specific details',
      severity: 'high'
    });
  }
  
  if (!hasActionVerbs) {
    issues.push({
      type: 'goals',
      description: 'No clear action or goal specified in the prompt',
      severity: 'medium'
    });
  }
  
  if (!hasContext) {
    issues.push({
      type: 'context',
      description: 'Missing context or background information',
      severity: 'medium'
    });
  }
  
  if (!hasConstraints) {
    issues.push({
      type: 'constraints',
      description: 'No specific constraints or requirements provided',
      severity: 'low'
    });
  }
  
  // Recommended techniques based on analysis
  const recommendedTechniques = [];
  
  if (complexity === 'complex' || complexity === 'expert') {
    recommendedTechniques.push('meta_instruction');
    recommendedTechniques.push('multi_perspective');
  }
  
  if (domain !== 'general') {
    recommendedTechniques.push('expert_domain_injection');
  }
  
  if (intent === 'analysis' || intent === 'explanation') {
    recommendedTechniques.push('constitutional_ai');
  }
  
  if (!hasConstraints || !hasContext) {
    recommendedTechniques.push('quality_assurance');
  }

  // Create the mock analysis
  return {
    id: `analysis_${Date.now()}`,
    timestamp: new Date(),
    originalPrompt: prompt,
    semanticStructure: {
      clarity,
      specificity,
      coherence
    },
    contextFactors: {
      hasGoals: hasActionVerbs,
      hasBackground: hasContext,
      hasConstraints
    },
    complexity,
    intent,
    domain,
    identifiedIssues: issues,
    tokenEstimate: Math.ceil(wordCount * 1.3),
    recommendedTechniques: recommendedTechniques.length > 0 ? recommendedTechniques : ['meta_instruction', 'expert_domain_injection', 'constitutional_ai']
  };
};

// Mock quality prediction generator
export const generateMockQualityPrediction = (analysis: EnhancedPromptAnalysis): QualityPredictionModel => {
  // Base effectiveness based on semantic structure
  const baseEffectiveness = (
    analysis.semanticStructure.clarity + 
    analysis.semanticStructure.specificity + 
    analysis.semanticStructure.coherence
  ) / 30;
  
  // Success factors based on analysis
  const successFactors = [];
  
  if (analysis.semanticStructure.clarity >= 70) successFactors.push('Clear language');
  if (analysis.semanticStructure.specificity >= 70) successFactors.push('Good specificity');
  if (analysis.contextFactors.hasGoals) successFactors.push('Clear objectives');
  if (analysis.contextFactors.hasConstraints) successFactors.push('Well-defined constraints');
  if (analysis.contextFactors.hasBackground) successFactors.push('Sufficient context');
  
  // Risk factors based on issues
  const riskFactors = analysis.identifiedIssues.map(issue => issue.description);
  
  return {
    effectiveness: Math.min(95, Math.round(baseEffectiveness * 100)),
    successFactors: successFactors.length > 0 ? successFactors : ['Basic prompt structure'],
    riskFactors,
    confidenceScore: 0.8
  };
};

// Mock optimization generator
export const generateMockOptimization = (
  prompt: string,
  techniques: string[],
  analysis: EnhancedPromptAnalysis,
  prediction: QualityPredictionModel
): AdvancedOptimizationResult => {
  let optimizedPrompt = prompt;
  
  // Apply techniques to optimize the prompt
  if (techniques.includes('meta_instruction')) {
    if (!optimizedPrompt.toLowerCase().includes('step by step') && 
        !optimizedPrompt.toLowerCase().includes('step-by-step')) {
      optimizedPrompt = `I want you to respond to this step-by-step with clear reasoning:\n\n${optimizedPrompt}`;
    }
  }
  
  if (techniques.includes('expert_domain_injection')) {
    if (!optimizedPrompt.toLowerCase().includes('expert') && 
        !optimizedPrompt.toLowerCase().includes('specialist')) {
      optimizedPrompt = `As an expert in ${analysis.domain}, ${optimizedPrompt}`;
    }
  }
  
  if (techniques.includes('constitutional_ai')) {
    const constraints = [
      "Provide a comprehensive response with well-structured information.",
      "Ensure your answer is accurate, balanced, and objective.",
      "Include practical examples to illustrate key points."
    ];
    
    if (!optimizedPrompt.includes('\n\n')) {
      optimizedPrompt += '\n\n';
    }
    
    optimizedPrompt += constraints.join(' ');
  }
  
  if (techniques.includes('quality_assurance')) {
    if (!analysis.contextFactors.hasConstraints) {
      optimizedPrompt += '\n\nYour response should be well-organized, concise, and directly address the request.';
    }
  }
  
  if (techniques.includes('multi_perspective')) {
    optimizedPrompt += '\n\nConsider multiple perspectives and approaches when responding.';
  }
  
  if (techniques.includes('emotional_intelligence')) {
    optimizedPrompt += '\n\nRespond in a professional and supportive tone.';
  }
  
  // Generate result
  return {
    id: `opt_${Date.now()}`,
    originalPrompt: prompt,
    optimizedPrompt,
    analysis,
    qualityPrediction: {
      ...prediction,
      effectiveness: Math.min(95, prediction.effectiveness + techniques.length * 5)
    },
    appliedTechniques: techniques,
    timestamp: new Date()
  };
};
