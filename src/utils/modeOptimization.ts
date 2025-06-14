
import { PromptMode } from "@/components/ModeSelector";
import { PromptAnalysis, OptimizationOptions } from "./promptEngineering";

export class ModeOptimizer {
  static optimizeForSystemPrompt(
    prompt: string,
    domain: string,
    analysis: PromptAnalysis,
    options: OptimizationOptions
  ): string {
    let systemPrompt = "";
    
    // Start with role definition based on domain
    const roleDefinitions = {
      technology: "You are a senior software engineer and technical expert with extensive experience in programming, system architecture, and emerging technologies.",
      business: "You are a strategic business consultant with MBA-level expertise in business analysis, strategy development, and organizational management.",
      creative: "You are a creative professional with expertise in storytelling, content creation, and artistic expression.",
      academic: "You are a distinguished researcher and academic with expertise in scholarly analysis and research methodology.",
      medical: "You are a knowledgeable medical professional with expertise in healthcare and medical research. Always emphasize consulting qualified healthcare providers.",
      legal: "You are a legal expert with extensive knowledge of law and regulations. Always emphasize consulting qualified legal professionals.",
      general: "You are a knowledgeable and helpful assistant with broad expertise across multiple domains."
    };
    
    systemPrompt = roleDefinitions[domain as keyof typeof roleDefinitions] || roleDefinitions.general;
    
    // Add behavioral instructions
    systemPrompt += `\n\nCore Instructions:
- Provide accurate, well-researched, and comprehensive responses
- Use clear, professional language appropriate for the context
- Structure responses logically with proper formatting
- Include relevant examples and practical applications when helpful`;
    
    if (options.useChainOfThought) {
      systemPrompt += `\n- Think through problems step-by-step with clear reasoning`;
    }
    
    if (options.usePersona) {
      systemPrompt += `\n- Draw upon professional experience and industry best practices`;
    }
    
    // Add domain-specific instructions
    if (domain === "technology") {
      systemPrompt += `\n- Include code examples with proper syntax highlighting when relevant
- Explain technical concepts clearly for different skill levels
- Mention best practices, potential pitfalls, and optimization strategies`;
    } else if (domain === "business") {
      systemPrompt += `\n- Provide actionable business insights and strategic recommendations
- Include relevant market considerations and implementation guidance
- Use business frameworks and methodologies where appropriate`;
    } else if (domain === "creative") {
      systemPrompt += `\n- Encourage creativity while maintaining quality and coherence
- Provide constructive feedback and improvement suggestions
- Offer multiple creative approaches when possible`;
    }
    
    // Add the user's specific task/context
    systemPrompt += `\n\nCurrent Task Context: ${prompt}`;
    
    if (options.useConstraints) {
      systemPrompt += `\n\nResponse Guidelines:
- Maintain professional standards and accuracy
- Provide comprehensive yet concise information
- Include relevant disclaimers when appropriate
- Structure responses for clarity and readability`;
    }
    
    return systemPrompt;
  }
  
  static optimizeForNormalPrompt(
    prompt: string,
    domain: string,
    analysis: PromptAnalysis,
    options: OptimizationOptions
  ): string {
    let optimizedPrompt = "";
    
    // Add context and role if using persona
    if (options.usePersona || options.useRolePlay) {
      const roleIntros = {
        technology: "As a senior software engineer with 10+ years of experience in system architecture and modern development practices",
        business: "As a strategic business consultant who has advised C-level executives at Fortune 500 companies",
        creative: "As a professional creative director with extensive experience in content creation and storytelling",
        academic: "As a researcher and academic professional with expertise in scholarly analysis",
        medical: "As a healthcare professional with clinical and research experience (please note: always consult qualified medical professionals for health decisions)",
        legal: "As a legal professional with practical experience (please note: always consult qualified attorneys for legal matters)",
        general: "As an expert consultant with broad professional experience"
      };
      
      const roleIntro = roleIntros[domain as keyof typeof roleIntros] || roleIntros.general;
      optimizedPrompt = `${roleIntro}, please help me with the following:\n\n`;
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
    
    if (domain === "technology") {
      instructions.push("Include relevant code examples and technical best practices");
    } else if (domain === "business") {
      instructions.push("Include strategic recommendations and implementation considerations");
    } else if (domain === "creative") {
      instructions.push("Provide creative approaches with specific examples and techniques");
    }
    
    if (instructions.length > 0) {
      optimizedPrompt += `\n\nPlease:\n${instructions.map(inst => `• ${inst}`).join('\n')}`;
    }
    
    // Add output format expectations
    if (analysis.complexity === "expert" || analysis.complexity === "complex") {
      optimizedPrompt += `\n\nI'm looking for a detailed, professional response that covers key aspects comprehensively and provides actionable insights.`;
    }
    
    return optimizedPrompt;
  }
}
