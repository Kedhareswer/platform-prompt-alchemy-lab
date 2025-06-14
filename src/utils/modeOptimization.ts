
import { PromptMode } from "@/components/ModeSelector";
import { PromptAnalysis, OptimizationOptions } from "./promptEngineering";

interface PlatformConfig {
  name: string;
  systemPromptFormat: {
    maxLength: number;
    supportsMarkdown: boolean;
    supportsRoleDefinition: boolean;
    recommendedStructure: string[];
  };
  normalPromptFormat: {
    preferredStyle: 'conversational' | 'formal' | 'technical';
    supportsPersona: boolean;
    maxContextLength: number;
  };
}

const PLATFORM_CONFIGS: Record<string, PlatformConfig> = {
  'gpt-4.1-2025-04-14': {
    name: 'GPT-4.1',
    systemPromptFormat: {
      maxLength: 8000,
      supportsMarkdown: true,
      supportsRoleDefinition: true,
      recommendedStructure: ['role', 'capabilities', 'instructions', 'constraints']
    },
    normalPromptFormat: {
      preferredStyle: 'conversational',
      supportsPersona: true,
      maxContextLength: 32000
    }
  },
  'claude-3.5-sonnet': {
    name: 'Claude 3.5 Sonnet',
    systemPromptFormat: {
      maxLength: 10000,
      supportsMarkdown: true,
      supportsRoleDefinition: true,
      recommendedStructure: ['identity', 'thinking_process', 'output_format', 'guidelines']
    },
    normalPromptFormat: {
      preferredStyle: 'formal',
      supportsPersona: true,
      maxContextLength: 200000
    }
  },
  'gemini-pro': {
    name: 'Gemini Pro',
    systemPromptFormat: {
      maxLength: 6000,
      supportsMarkdown: true,
      supportsRoleDefinition: true,
      recommendedStructure: ['role', 'objectives', 'methods', 'constraints']
    },
    normalPromptFormat: {
      preferredStyle: 'technical',
      supportsPersona: true,
      maxContextLength: 30000
    }
  }
};

export class ModeOptimizer {
  static optimizeForSystemPrompt(
    prompt: string,
    domain: string,
    analysis: PromptAnalysis,
    options: OptimizationOptions,
    platform: string = 'gpt-4.1-2025-04-14'
  ): string {
    const config = PLATFORM_CONFIGS[platform] || PLATFORM_CONFIGS['gpt-4.1-2025-04-14'];
    let systemPrompt = "";
    
    // Platform-specific header
    systemPrompt += `# ${config.name} System Instructions\n\n`;
    
    // Role definition based on domain
    const roleDefinitions = {
      technology: "You are a senior software engineer and technical expert with 15+ years of experience in programming, system architecture, and emerging technologies.",
      business: "You are a strategic business consultant with MBA-level expertise and Fortune 500 consulting experience.",
      creative: "You are a creative professional and storytelling expert with extensive experience in content creation and artistic expression.",
      academic: "You are a distinguished researcher and academic with expertise in scholarly analysis and research methodology.",
      medical: "You are a knowledgeable medical professional with clinical and research experience. Always emphasize consulting qualified healthcare providers for medical decisions.",
      legal: "You are a legal expert with extensive knowledge of law and regulations. Always emphasize consulting qualified legal professionals for legal matters.",
      finance: "You are a financial analyst with expertise in markets, investment analysis, and financial planning.",
      design: "You are a creative design expert with extensive experience in visual design, user experience, and design principles.",
      general: "You are a knowledgeable and helpful assistant with broad expertise across multiple domains."
    };
    
    systemPrompt += `## Core Identity\n${roleDefinitions[domain as keyof typeof roleDefinitions] || roleDefinitions.general}\n\n`;
    
    // Thinking process (Claude-style structured thinking)
    if (config.systemPromptFormat.recommendedStructure.includes('thinking_process')) {
      systemPrompt += `## Thinking Process\nApproach problems systematically:\n1. Break down complex questions into manageable components\n2. Consider multiple perspectives and potential counterarguments\n3. Think step-by-step through reasoning chains\n4. Acknowledge uncertainty when appropriate\n\n`;
    }
    
    // Core instructions
    systemPrompt += `## Core Instructions\n`;
    systemPrompt += `- Provide accurate, well-researched, and comprehensive responses\n`;
    systemPrompt += `- Use clear, professional language appropriate for the context\n`;
    systemPrompt += `- Structure responses logically with proper formatting\n`;
    systemPrompt += `- Include relevant examples and practical applications when helpful\n`;
    
    if (options.useChainOfThought) {
      systemPrompt += `- Think through problems step-by-step with clear reasoning\n`;
    }
    
    if (options.usePersona) {
      systemPrompt += `- Draw upon professional experience and industry best practices\n`;
    }
    
    // Domain-specific instructions
    if (domain === "technology") {
      systemPrompt += `\n## Technical Guidelines\n- Include code examples with proper syntax highlighting when relevant\n- Explain technical concepts clearly for different skill levels\n- Mention best practices, potential pitfalls, and optimization strategies\n- Consider security, performance, and maintainability implications\n`;
    } else if (domain === "business") {
      systemPrompt += `\n## Business Guidelines\n- Provide actionable business insights and strategic recommendations\n- Include relevant market considerations and implementation guidance\n- Use business frameworks and methodologies where appropriate\n- Consider financial implications and ROI\n`;
    } else if (domain === "creative") {
      systemPrompt += `\n## Creative Guidelines\n- Encourage creativity while maintaining quality and coherence\n- Provide constructive feedback and improvement suggestions\n- Offer multiple creative approaches when possible\n- Balance originality with practical constraints\n`;
    }
    
    // Current task context
    systemPrompt += `\n## Current Task\n${prompt}\n`;
    
    // Output format constraints
    if (options.useConstraints) {
      systemPrompt += `\n## Response Format\n- Maintain professional standards and accuracy\n- Provide comprehensive yet concise information\n- Include relevant disclaimers when appropriate\n- Structure responses for clarity and readability\n- Use markdown formatting for better organization\n`;
    }
    
    // Platform-specific constraints
    if (config.systemPromptFormat.maxLength < systemPrompt.length) {
      console.warn(`System prompt exceeds recommended length for ${config.name}`);
    }
    
    return systemPrompt;
  }
  
  static optimizeForNormalPrompt(
    prompt: string,
    domain: string,
    analysis: PromptAnalysis,
    options: OptimizationOptions,
    platform: string = 'gpt-4.1-2025-04-14'
  ): string {
    const config = PLATFORM_CONFIGS[platform] || PLATFORM_CONFIGS['gpt-4.1-2025-04-14'];
    let optimizedPrompt = "";
    
    // Add context and role if using persona
    if (options.usePersona || options.useRolePlay) {
      const roleIntros = {
        technology: "As a senior software engineer with 15+ years of experience in system architecture and modern development practices",
        business: "As a strategic business consultant who has advised C-level executives at Fortune 500 companies",
        creative: "As a professional creative director with extensive experience in content creation and storytelling",
        academic: "As a researcher and academic professional with expertise in scholarly analysis",
        medical: "As a healthcare professional with clinical and research experience (note: always consult qualified medical professionals for health decisions)",
        legal: "As a legal professional with practical experience (note: always consult qualified attorneys for legal matters)",
        finance: "As a financial analyst with expertise in markets and investment strategy",
        design: "As a creative design expert with extensive experience in visual design and user experience",
        general: "As an expert consultant with broad professional experience"
      };
      
      const roleIntro = roleIntros[domain as keyof typeof roleIntros] || roleIntros.general;
      optimizedPrompt = `${roleIntro}, please help me with the following:\n\n`;
    }
    
    // Add conversation context for better engagement
    if (config.normalPromptFormat.preferredStyle === 'conversational') {
      optimizedPrompt += "I'm looking for your expert guidance on this topic. ";
    } else if (config.normalPromptFormat.preferredStyle === 'formal') {
      optimizedPrompt += "I would appreciate your professional analysis of the following matter. ";
    }
    
    // Add the main prompt with enhancement
    optimizedPrompt += prompt;
    
    // Add specific instructions based on options
    const instructions = [];
    
    if (options.useChainOfThought) {
      instructions.push("Please think through this step-by-step with clear reasoning");
    }
    
    if (options.useSelfConsistency) {
      instructions.push("Consider multiple approaches and provide the most reliable solution");
    }
    
    if (options.useConstraints) {
      instructions.push("Provide comprehensive, actionable guidance with practical examples");
      instructions.push("Structure your response clearly with headings and bullet points where helpful");
    }
    
    // Domain-specific instructions
    if (domain === "technology") {
      instructions.push("Include relevant code examples and technical best practices");
      instructions.push("Explain any technical concepts clearly and mention potential gotchas");
    } else if (domain === "business") {
      instructions.push("Include strategic recommendations and implementation considerations");
      instructions.push("Consider market dynamics and business impact");
    } else if (domain === "creative") {
      instructions.push("Provide creative approaches with specific examples and techniques");
      instructions.push("Suggest multiple creative directions if applicable");
    } else if (domain === "academic") {
      instructions.push("Include scholarly perspective and research considerations");
      instructions.push("Mention relevant methodologies or frameworks");
    }
    
    if (instructions.length > 0) {
      optimizedPrompt += `\n\nPlease:\n${instructions.map(inst => `• ${inst}`).join('\n')}`;
    }
    
    // Add output format expectations based on complexity
    if (analysis.complexity === "expert" || analysis.complexity === "complex") {
      optimizedPrompt += `\n\nI'm looking for a detailed, professional response that covers key aspects comprehensively and provides actionable insights. Please structure your response for clarity and include relevant examples where helpful.`;
    }
    
    // Add conversation context hint
    if (config.normalPromptFormat.supportsPersona) {
      optimizedPrompt += `\n\nFeel free to ask clarifying questions if you need more context to provide the best possible guidance.`;
    }
    
    return optimizedPrompt;
  }
  
  static generatePlatformSpecificExport(prompt: string, platform: string, mode: PromptMode): { format: string; instructions: string } {
    const config = PLATFORM_CONFIGS[platform] || PLATFORM_CONFIGS['gpt-4.1-2025-04-14'];
    
    if (mode === 'system') {
      return {
        format: 'system_prompt',
        instructions: `Copy this system prompt to your ${config.name} platform:\n\n• For ChatGPT: Go to Settings → Personalization → Custom Instructions → "How would you like ChatGPT to respond?"\n• For Claude: Create a new Project and paste this in the Project Instructions\n• For API: Use this as the 'system' message in your API calls`
      };
    } else {
      return {
        format: 'chat_prompt',
        instructions: `This optimized prompt is ready to paste directly into your ${config.name} chat interface. Simply copy and paste to start your conversation with enhanced context and guidance.`
      };
    }
  }
}
