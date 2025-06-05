
import { z } from 'zod';

// Define Zod schema for prompt analysis
export const PromptAnalysisSchema = z.object({
  complexity: z.enum(['simple', 'moderate', 'complex', 'expert']),
  length: z.enum(['short', 'medium', 'long']),
  intent: z.enum(['informational', 'creative', 'problem_solving', 'persuasive']),
  structure: z.enum(['unstructured', 'structured', 'highly_structured']),
  style: z.enum(['formal', 'semi_formal', 'informal']),
  domain: z.string(),
  confidence: z.number().min(0).max(100),
  estimatedTokens: z.number().min(0),
  suggestedTechniques: z.array(z.string()),
});

// Define TypeScript type from Zod schema
export type PromptAnalysis = z.infer<typeof PromptAnalysisSchema>;

// Define TypeScript type for optimization options
export type OptimizationOptions = {
  useChainOfThought: boolean;
  useFewShot: boolean;
  useReAct: boolean;
  usePersona: boolean;
  useConstraints: boolean;
  optimizeForTokens: boolean;
  useTreeOfThoughts: boolean;
  useSelfConsistency: boolean;
  useRolePlay: boolean;
};

export class PromptEngineer {
  static analyzePrompt(prompt: string): PromptAnalysis {
    // Basic analysis based on prompt characteristics
    const words = prompt.split(/\s+/);
    const wordCount = words.length;
    
    let complexity: PromptAnalysis['complexity'] = 'simple';
    if (wordCount > 150) complexity = 'expert';
    else if (wordCount > 75) complexity = 'complex';
    else if (wordCount > 25) complexity = 'moderate';
    
    let length: PromptAnalysis['length'] = 'short';
    if (wordCount > 200) length = 'long';
    else if (wordCount > 100) length = 'medium';
    
    let intent: PromptAnalysis['intent'] = 'informational';
    const lowerPrompt = prompt.toLowerCase();
    if (lowerPrompt.includes('create') || lowerPrompt.includes('imagine') || lowerPrompt.includes('write')) {
      intent = 'creative';
    } else if (lowerPrompt.includes('solve') || lowerPrompt.includes('problem') || lowerPrompt.includes('how to') || lowerPrompt.includes('best') || lowerPrompt.includes('recommend')) {
      intent = 'problem_solving';
    } else if (lowerPrompt.includes('persuade') || lowerPrompt.includes('convince') || lowerPrompt.includes('argue')) {
      intent = 'persuasive';
    }
    
    let structure: PromptAnalysis['structure'] = 'unstructured';
    if (prompt.includes('\n') || prompt.includes('.')) structure = 'structured';
    if (prompt.split('\n').length > 3 || prompt.split('.').length > 5) structure = 'highly_structured';
    
    let style: PromptAnalysis['style'] = 'informal';
    if (prompt.length > 200 && !lowerPrompt.includes('lol') && !lowerPrompt.includes('btw')) style = 'semi_formal';
    if (prompt.length > 300 && lowerPrompt.includes('please') && !lowerPrompt.includes('hey')) style = 'formal';

    // Determine domain based on keywords
    let domain = 'general';
    if (lowerPrompt.includes('code') || lowerPrompt.includes('programming') || lowerPrompt.includes('software') || lowerPrompt.includes('algorithm') || lowerPrompt.includes('ml') || lowerPrompt.includes('ai') || lowerPrompt.includes('cnn') || lowerPrompt.includes('neural')) {
      domain = 'technology';
    } else if (lowerPrompt.includes('creative') || lowerPrompt.includes('story') || lowerPrompt.includes('art') || lowerPrompt.includes('design')) {
      domain = 'creative';
    } else if (lowerPrompt.includes('business') || lowerPrompt.includes('marketing') || lowerPrompt.includes('sales') || lowerPrompt.includes('strategy')) {
      domain = 'business';
    } else if (lowerPrompt.includes('research') || lowerPrompt.includes('academic') || lowerPrompt.includes('study') || lowerPrompt.includes('analysis')) {
      domain = 'academic';
    }

    // Calculate estimated tokens (rough estimate)
    const estimatedTokens = Math.ceil(words.length * 1.3);

    // Suggest techniques based on analysis
    const suggestedTechniques: string[] = [];
    if (complexity === 'complex' || complexity === 'expert') {
      suggestedTechniques.push('chain_of_thought', 'tree_of_thoughts');
    }
    if (intent === 'problem_solving') {
      suggestedTechniques.push('react_pattern', 'self_consistency');
    }
    if (domain !== 'general') {
      suggestedTechniques.push('persona_injection', 'role_playing');
    }

    // Calculate confidence based on various factors
    let confidence = 70;
    if (wordCount > 50) confidence += 10;
    if (structure === 'structured') confidence += 10;
    if (domain !== 'general') confidence += 10;
    
    const analysisResult: PromptAnalysis = {
      complexity,
      length,
      intent,
      structure,
      style,
      domain,
      confidence: Math.min(confidence, 95),
      estimatedTokens,
      suggestedTechniques,
    };
    
    return analysisResult;
  }

  // Chain of Thought reasoning technique
  static applyChainOfThought(prompt: string): string {
    return `${prompt}

Please approach this systematically:
1. First, analyze what's being asked and break down the key components
2. Consider the relevant factors, constraints, and requirements
3. Work through the problem step-by-step with clear reasoning
4. Evaluate different approaches or solutions
5. Provide a comprehensive, well-reasoned response with actionable insights

Let's think through this methodically:`;
  }

  // Tree of Thoughts technique for complex reasoning
  static applyTreeOfThoughts(prompt: string): string {
    return `${prompt}

Please explore this from multiple angles:
- Consider 3-4 different approaches to this challenge
- For each approach, evaluate the advantages, disadvantages, and key considerations
- Compare the methodologies, implementation complexity, and expected outcomes
- Identify potential risks, dependencies, and success factors for each option
- Synthesize the best elements from different approaches
- Provide a final recommendation with clear justification

Let's examine this comprehensively from multiple perspectives:`;
  }

  // Self-consistency technique
  static applySelfConsistency(prompt: string): string {
    return `${prompt}

To ensure the most accurate and reliable response:
1. Generate and evaluate multiple potential solutions or approaches
2. Cross-validate each solution for consistency, feasibility, and accuracy
3. Identify any contradictions, gaps, or areas needing clarification
4. Consider edge cases and potential challenges
5. Provide the most robust and well-validated recommendation
6. Include confidence levels and any important caveats or assumptions

Please provide a thoroughly validated response:`;
  }

  // ReAct (Reasoning + Acting) pattern
  static applyReActPattern(prompt: string): string {
    return `${prompt}

Using a structured problem-solving approach:
1. ANALYZE: What information do we have and what do we need to determine?
2. PLAN: What are the key steps or actions required to address this?
3. EXECUTE: Work through each step systematically
4. EVALUATE: Assess the results and identify any issues or improvements
5. REFINE: Make necessary adjustments and optimizations
6. CONCLUDE: Provide final recommendations with implementation guidance

Let me work through this systematically:`;
  }

  // Enhanced persona injection based on domain
  static applyEnhancedPersonaInjection(prompt: string, domain: string): string {
    const personas = {
      'software-engineering': "As a senior software engineer with extensive experience in system architecture, best practices, and modern development methodologies",
      'machine-learning': "As a machine learning engineer and data scientist with deep expertise in neural networks, algorithms, and practical ML implementation",
      'data-science': "As a senior data scientist with expertise in statistical analysis, data visualization, and advanced analytics",
      'business-strategy': "As a strategic business consultant with extensive experience in corporate strategy, market analysis, and organizational transformation",
      'marketing': "As a digital marketing strategist with proven expertise in customer acquisition, brand building, and growth marketing",
      'finance': "As a financial analyst and investment professional with deep knowledge of markets, valuation, and financial modeling",
      'creative-writing': "As an experienced creative writer and content strategist with expertise in storytelling, narrative structure, and engaging content creation",
      'design': "As a senior UX/UI designer with extensive experience in user-centered design, design systems, and digital product development",
      'academic-research': "As a researcher and academic professional with expertise in research methodology, data analysis, and scholarly communication",
      'legal': "As a legal professional with practical experience in law practice and legal analysis (note: always consult qualified attorneys for specific legal matters)",
      'healthcare': "As a healthcare professional with clinical and systems experience (note: always consult qualified medical professionals for health decisions)",
      'general': "As a knowledgeable professional with broad expertise across multiple domains and practical problem-solving experience"
    };

    const persona = personas[domain as keyof typeof personas] || personas.general;
    
    return `${persona}, please provide comprehensive, actionable guidance on the following:

${prompt}

Please draw upon professional experience, industry best practices, proven methodologies, and practical insights to deliver detailed, well-structured, and immediately applicable recommendations.`;
  }

  // Role-playing technique
  static applyRolePlay(prompt: string, domain: string): string {
    const roles = {
      'software-engineering': "senior software architect with 10+ years of experience leading complex technical projects",
      'machine-learning': "principal ML engineer who has deployed dozens of production ML systems at scale",
      'data-science': "head of data science with expertise in translating business problems into analytical solutions",
      'business-strategy': "management consultant who has advised C-level executives across Fortune 500 companies",
      'marketing': "VP of Marketing who has scaled multiple companies from startup to IPO",
      'finance': "investment director with expertise in financial modeling and market analysis",
      'creative-writing': "award-winning author and creative director with published works and brand campaigns",
      'design': "design director who has led product design at major tech companies",
      'academic-research': "tenured professor and published researcher with extensive peer-review experience",
      'legal': "practicing attorney with courtroom and advisory experience (always consult qualified legal counsel)",
      'healthcare': "medical director with clinical practice and healthcare systems experience (always consult medical professionals)",
      'general': "seasoned expert consultant with cross-industry experience and proven problem-solving track record"
    };

    const role = roles[domain as keyof typeof roles] || roles.general;
    
    return `You are a ${role}. A colleague has approached you with this important question:

"${prompt}"

Please respond as this professional would, providing:
- Deep expertise and professional insights
- Practical, actionable recommendations
- Industry best practices and proven methodologies
- Real-world examples and case studies where relevant
- Potential challenges and how to overcome them
- Step-by-step implementation guidance
- Success metrics and evaluation criteria

Your response should be detailed, professional, and immediately actionable.`;
  }

  // Few-shot learning with domain-specific examples
  static applyFewShotLearning(prompt: string, examples: Array<{input: string, output: string}>): string {
    let fewShotPrompt = "Here are examples of similar questions and high-quality, detailed responses:\n\n";
    
    examples.forEach((example, index) => {
      fewShotPrompt += `Example ${index + 1}:\nQuestion: ${example.input}\nResponse: ${example.output}\n\n`;
    });
    
    fewShotPrompt += `Now, please provide a similarly detailed, professional, and comprehensive response to this question:\n${prompt}`;
    
    return fewShotPrompt;
  }

  // Token optimization
  static optimizeForTokens(prompt: string): string {
    return prompt
      .replace(/\b(please|kindly|if you could|would you mind|could you please)\b/gi, '')
      .replace(/\b(very|really|quite|extremely|absolutely)\b/gi, '')
      .replace(/\b(I think|I believe|in my opinion|it seems to me)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
