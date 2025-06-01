import { DOMAIN_PERSONAS } from './systemPrompts';

export interface PromptAnalysis {
  intent: 'creative' | 'analytical' | 'informational' | 'problem_solving' | 'code' | 'conversation' | 'educational' | 'research';
  complexity: 'simple' | 'moderate' | 'complex' | 'expert';
  domain: string;
  suggestedTechniques: string[];
  estimatedTokens: number;
  confidence: number;
}

export interface OptimizationOptions {
  useChainOfThought: boolean;
  useFewShot: boolean;
  useReAct: boolean;
  usePersona: boolean;
  useConstraints: boolean;
  optimizeForTokens: boolean;
  useTreeOfThoughts: boolean;
  useSelfConsistency: boolean;
  useRolePlay: boolean;
}

export class PromptEngineer {
  static analyzePrompt(prompt: string): PromptAnalysis {
    const wordCount = prompt.split(' ').length;
    const estimatedTokens = Math.ceil(wordCount * 1.3);
    
    // Enhanced intent detection with confidence scoring
    const intentPatterns = {
      creative: /write|create|generate|compose|story|poem|creative|imagine|design/i,
      analytical: /analyze|compare|evaluate|explain|examine|assess|review|critique/i,
      informational: /what|how|when|where|who|explain|tell me|describe|define/i,
      problem_solving: /solve|calculate|debug|fix|resolve|troubleshoot|optimize/i,
      code: /code|program|function|algorithm|debug|script|API|framework/i,
      conversation: /chat|discuss|talk|conversation|opinion|think|feel/i,
      educational: /learn|teach|explain|tutorial|guide|lesson|course/i,
      research: /research|study|investigate|survey|literature|academic/i
    };
    
    let intent: PromptAnalysis['intent'] = 'informational';
    let maxScore = 0;
    
    Object.entries(intentPatterns).forEach(([key, pattern]) => {
      const matches = prompt.match(pattern);
      const score = matches ? matches.length : 0;
      if (score > maxScore) {
        maxScore = score;
        intent = key as PromptAnalysis['intent'];
      }
    });
    
    // Enhanced complexity assessment
    let complexity: PromptAnalysis['complexity'] = 'simple';
    let complexityScore = 0;
    
    if (wordCount > 20) complexityScore += 1;
    if (wordCount > 50) complexityScore += 1;
    if (wordCount > 100) complexityScore += 1;
    if (prompt.match(/complex|advanced|expert|sophisticated|detailed|comprehensive/i)) complexityScore += 2;
    if (prompt.match(/multiple|various|several|different|compare|contrast/i)) complexityScore += 1;
    
    if (complexityScore >= 4) complexity = 'expert';
    else if (complexityScore >= 2) complexity = 'complex';
    else if (complexityScore >= 1) complexity = 'moderate';
    
    // Enhanced domain detection
    const domainPatterns = {
      technology: /code|programming|software|development|tech|computer|algorithm|API|database/i,
      creative: /write|story|creative|poetry|literature|art|design|music|novel/i,
      business: /business|marketing|strategy|analysis|revenue|profit|market|sales/i,
      academic: /research|study|academic|thesis|paper|journal|scientific|scholarly/i,
      medical: /medical|health|doctor|patient|diagnosis|treatment|medicine|clinical/i,
      legal: /legal|law|court|contract|regulation|compliance|attorney|judge/i,
      finance: /finance|investment|money|trading|economy|financial|bank|stock/i,
      education: /teach|learn|education|student|curriculum|lesson|training|course/i
    };
    
    let domain = 'general';
    let maxDomainScore = 0;
    
    Object.entries(domainPatterns).forEach(([key, pattern]) => {
      const matches = prompt.match(pattern);
      const score = matches ? matches.length : 0;
      if (score > maxDomainScore) {
        maxDomainScore = score;
        domain = key;
      }
    });
    
    // Suggest techniques based on analysis
    const suggestedTechniques = [];
    if (complexity === 'complex' || complexity === 'expert') {
      suggestedTechniques.push('chain_of_thought', 'tree_of_thoughts');
    }
    if (intent === 'problem_solving') {
      suggestedTechniques.push('react_pattern', 'self_consistency');
    }
    if (domain !== 'general') {
      suggestedTechniques.push('persona_injection', 'role_play');
    }
    if (wordCount > 30) {
      suggestedTechniques.push('structured_output');
    }
    if (intent === 'creative') {
      suggestedTechniques.push('few_shot', 'creative_constraints');
    }
    
    const confidence = Math.min(90, 60 + maxScore * 10 + maxDomainScore * 5);
    
    return {
      intent,
      complexity,
      domain,
      suggestedTechniques,
      estimatedTokens,
      confidence
    };
  }
  
  static applyChainOfThought(prompt: string): string {
    return `I need to think through this step by step to provide the best possible response.

Task: ${prompt}

Let me break this down systematically:

Step 1: Understanding the request
- What exactly is being asked?
- What are the key components?
- What context is important?

Step 2: Planning my approach
- What information do I need to consider?
- What methodology should I use?
- What potential challenges might arise?

Step 3: Executing the solution
- Let me work through this methodically
- I'll consider multiple angles
- I'll build my response logically

Step 4: Verification and refinement
- Does my response fully address the request?
- Are there any gaps or improvements needed?
- Is my reasoning sound?

Let me begin:`;
  }
  
  static applyTreeOfThoughts(prompt: string): string {
    return `I'll explore multiple reasoning paths to find the best solution.

Problem: ${prompt}

Let me consider different approaches:

🌳 Thought Tree Analysis:

Branch A: Direct approach
- Immediate solution path
- Pros and cons
- Expected outcome

Branch B: Alternative perspective  
- Different angle of analysis
- Unique considerations
- Potential advantages

Branch C: Comprehensive approach
- Multi-faceted solution
- Integration of ideas
- Holistic view

I'll evaluate each branch and synthesize the best elements:`;
  }
  
  static applySelfConsistency(prompt: string): string {
    return `I'll generate multiple reasoning paths and synthesize the most consistent answer.

Query: ${prompt}

Reasoning Path 1:
[First approach to the problem]

Reasoning Path 2:
[Alternative approach]

Reasoning Path 3:
[Third perspective]

Consistency Check:
- Common elements across all paths
- Areas of agreement
- Conflicting viewpoints to resolve

Final Synthesized Answer:`;
  }
  
  static applyEnhancedPersonaInjection(prompt: string, domain: string): string {
    const domainInfo = DOMAIN_PERSONAS[domain as keyof typeof DOMAIN_PERSONAS] || DOMAIN_PERSONAS.general;
    
    return `${domainInfo.persona}

Areas of expertise: ${domainInfo.expertise.join(', ')}

Task: ${prompt}

As a ${domainInfo.name}, I'll leverage my specialized knowledge and experience to provide you with expert-level insights and practical solutions. Let me apply my domain expertise to address your request comprehensively:`;
  }
  
  static applyRolePlay(prompt: string, domain: string): string {
    const roleInstructions = {
      technology: "I'm putting on my senior developer hat and approaching this from a technical architecture perspective.",
      creative: "I'm channeling my inner storyteller and creative mind for this task.",
      business: "I'm switching to my strategic consultant mindset to analyze this business challenge.",
      academic: "I'm approaching this with my researcher's lens and academic rigor.",
      medical: "I'm applying my medical knowledge while emphasizing professional consultation.",
      legal: "I'm considering this from a legal perspective with appropriate disclaimers.",
      finance: "I'm analyzing this through my financial analyst expertise.",
      education: "I'm using my educational specialist approach to make this accessible and comprehensive."
    };
    
    const instruction = roleInstructions[domain as keyof typeof roleInstructions] || "I'm approaching this with my broad expertise.";
    
    return `${instruction}

${prompt}

Let me fully embody this role to give you the most authentic and valuable response:`;
  }
  
  static applyFewShotLearning(prompt: string, examples: Array<{input: string, output: string}>): string {
    const exampleText = examples.map((ex, i) => 
      `Example ${i + 1}:
Input: ${ex.input}
Output: ${ex.output}`
    ).join('\n\n');
    
    return `Here are some examples of the desired format:

${exampleText}

Now, please follow the same pattern for:
${prompt}`;
  }
  
  static applyReActPattern(prompt: string): string {
    return `I need to approach this using reasoning and action steps:

Task: ${prompt}

Thought: Let me analyze what needs to be done here.
Action: I'll break this down into logical steps.
Observation: [I'll note what I discover]
Thought: Based on my observations, I'll determine the next step.
Action: [I'll take the appropriate action]

Let me start:`;
  }
  
  static optimizeForTokens(prompt: string): string {
    return prompt
      .replace(/\s+/g, ' ')
      .replace(/\b(please|kindly|if you could|would you mind)\b/gi, '')
      .replace(/\b(very|really|quite|extremely)\b/gi, '')
      .trim();
  }
  
  static addStructuredOutput(prompt: string, format: 'json' | 'markdown' | 'list' | 'steps'): string {
    const formatInstructions = {
      json: "Please provide your response in valid JSON format with appropriate key-value pairs.",
      markdown: "Please format your response using proper Markdown syntax with headers, lists, and emphasis.",
      list: "Please structure your response as a numbered or bulleted list for clarity.",
      steps: "Please break down your response into clear, sequential steps."
    };
    
    return `${prompt}

Output Format: ${formatInstructions[format]}`;
  }
}
