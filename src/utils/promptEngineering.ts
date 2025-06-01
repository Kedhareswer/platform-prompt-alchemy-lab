
export interface PromptAnalysis {
  intent: 'creative' | 'analytical' | 'informational' | 'problem_solving' | 'code' | 'conversation';
  complexity: 'simple' | 'moderate' | 'complex' | 'expert';
  domain: string;
  suggestedTechniques: string[];
  estimatedTokens: number;
}

export interface OptimizationOptions {
  useChainOfThought: boolean;
  useFewShot: boolean;
  useReAct: boolean;
  usePersona: boolean;
  useConstraints: boolean;
  optimizeForTokens: boolean;
}

export class PromptEngineer {
  static analyzePrompt(prompt: string): PromptAnalysis {
    const wordCount = prompt.split(' ').length;
    const estimatedTokens = Math.ceil(wordCount * 1.3);
    
    // Intent detection
    let intent: PromptAnalysis['intent'] = 'informational';
    if (prompt.match(/write|create|generate|compose/i)) intent = 'creative';
    if (prompt.match(/analyze|compare|evaluate|explain/i)) intent = 'analytical';
    if (prompt.match(/solve|calculate|debug|fix/i)) intent = 'problem_solving';
    if (prompt.match(/code|program|function|algorithm/i)) intent = 'code';
    if (prompt.match(/chat|discuss|talk|conversation/i)) intent = 'conversation';
    
    // Complexity assessment
    let complexity: PromptAnalysis['complexity'] = 'simple';
    if (wordCount > 20) complexity = 'moderate';
    if (wordCount > 50) complexity = 'complex';
    if (prompt.match(/complex|advanced|expert|sophisticated/i)) complexity = 'expert';
    
    // Domain detection
    let domain = 'general';
    if (prompt.match(/code|programming|software|development/i)) domain = 'technology';
    if (prompt.match(/write|story|creative|poetry|literature/i)) domain = 'creative';
    if (prompt.match(/business|marketing|strategy|analysis/i)) domain = 'business';
    if (prompt.match(/science|research|academic|study/i)) domain = 'academic';
    
    // Suggest techniques based on analysis
    const suggestedTechniques = [];
    if (complexity === 'complex' || complexity === 'expert') {
      suggestedTechniques.push('chain_of_thought');
    }
    if (intent === 'problem_solving') {
      suggestedTechniques.push('react_pattern');
    }
    if (domain === 'creative') {
      suggestedTechniques.push('persona_injection');
    }
    if (wordCount > 30) {
      suggestedTechniques.push('structured_output');
    }
    
    return {
      intent,
      complexity,
      domain,
      suggestedTechniques,
      estimatedTokens
    };
  }
  
  static applyChainOfThought(prompt: string): string {
    return `Let me think through this step by step:

${prompt}

I'll approach this systematically:
1. First, I'll understand what's being asked
2. Then I'll break down the problem into components  
3. I'll work through each part methodically
4. Finally, I'll synthesize a comprehensive response

Let me begin:`;
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
  
  static applyPersonaInjection(prompt: string, domain: string): string {
    const personas = {
      technology: "You are a senior software engineer with 10+ years of experience in full-stack development.",
      creative: "You are a renowned creative writer and storyteller with expertise in various literary forms.",
      business: "You are a strategic business consultant with MBA-level expertise in analysis and planning.",
      academic: "You are a distinguished professor and researcher with deep expertise in your field.",
      general: "You are a knowledgeable expert with broad expertise across multiple domains."
    };
    
    const persona = personas[domain as keyof typeof personas] || personas.general;
    
    return `${persona}

Your task: ${prompt}

Please provide a response that leverages your expertise and experience:`;
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
