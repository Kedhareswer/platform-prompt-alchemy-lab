import { CohereClient } from 'cohere-ai';
import { PromptMode } from "@/components/ModeSelector";
import { OptimizationOptions } from "./promptEngineering";

// Initialize Cohere client
// Note: API key will be provided by the user through the UI or from environment variables
let cohereClient: CohereClient | null = null;

export interface OptimizationResult {
  originalPrompt: string;
  optimizedPrompt: string;
  systemPrompt: any | null;
  analysis: {
    complexity: string;
    intent: string;
    domain: string;
    estimatedResponseTime?: number;
    strengths?: string[];
    weaknesses?: string[];
  };
  appliedTechniques: string[];
  estimatedImprovement: number;
  tokenCount: {
    original: number;
    optimized: number;
  };
  domain: string;
  mode: "system" | "normal";
}

export class PromptOptimizer {
  /**
   * Initialize the Cohere client with the provided API key or environment variable
   */
  static initializeClient(apiKey: string): void {
    // If apiKey is empty, try to use the environment variable
    const key = apiKey || import.meta.env.VITE_COHERE_API_KEY;
    
    if (key) {
      cohereClient = new CohereClient({ 
        token: key 
      });
    } else {
      console.warn("No Cohere API key provided. Using mock optimization.");
      cohereClient = null;
    }
  }

  static async optimizePrompt(
    userPrompt: string,
    platform: string,
    domain: string,
    options: OptimizationOptions,
    mode: "system" | "normal" = "normal"
  ): Promise<OptimizationResult> {
    // Calculate token counts (rough estimate)
    const originalTokens = this.estimateTokens(userPrompt);
    
    // If no API key has been provided yet, use a basic optimization
    if (!cohereClient) {
      return this.createMockOptimizationResult(userPrompt, platform, domain, options, mode);
    }

    try {
      // Prepare the optimization techniques as a string
      const techniquesString = Object.entries(options)
        .filter(([_, enabled]) => enabled)
        .map(([technique]) => {
          // Convert camelCase to readable format
          return technique
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase())
            .replace('Use ', '');
        })
        .join(', ');

      // Prepare the prompt for Cohere
      const promptForCohere = `
        Optimize the following prompt for the ${platform} AI platform, focusing on the ${domain} domain.
        
        Original prompt: "${userPrompt}"
        
        Mode: ${mode === "system" ? "System prompt (instructions for the AI)" : "Normal prompt (direct user query)"}
        
        Apply these optimization techniques: ${techniquesString}
        
        Provide the optimized prompt and an analysis including:
        - Complexity assessment (simple, moderate, complex, expert)
        - Intent classification
        - Estimated response time
        - Strengths and weaknesses of the original prompt
        - Estimated improvement percentage
        
        Format your response as JSON with the following structure:
        {
          "optimizedPrompt": "string",
          "analysis": {
            "complexity": "string",
            "intent": "string",
            "domain": "string",
            "estimatedResponseTime": number,
            "strengths": ["string"],
            "weaknesses": ["string"]
          },
          "appliedTechniques": ["string"],
          "estimatedImprovement": number
        }
      `;

      // Call Cohere API
      const response = await cohereClient.chat({
        message: promptForCohere,
        model: "command",
        temperature: 0.4
      });

      // Parse the response to extract the optimization result
      try {
        // The response might be in the text or in a structured format
        const responseText = response.text;
        // Try to extract JSON from the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const cohereResult = JSON.parse(jsonMatch[0]);
          
          // Calculate optimized token count
          const optimizedTokens = this.estimateTokens(cohereResult.optimizedPrompt);
          
          // Construct the final result
          return {
            originalPrompt: userPrompt,
            optimizedPrompt: cohereResult.optimizedPrompt,
            systemPrompt: null, // We're not using system prompts directly
            analysis: cohereResult.analysis,
            appliedTechniques: cohereResult.appliedTechniques || [],
            estimatedImprovement: cohereResult.estimatedImprovement || 0,
            tokenCount: {
              original: originalTokens,
              optimized: optimizedTokens
            },
            domain,
            mode
          };
        }
      } catch (parseError) {
        console.error("Error parsing Cohere response:", parseError);
      }

      // Fallback to mock result if parsing fails
      return this.createMockOptimizationResult(userPrompt, platform, domain, options, mode);
    } catch (error) {
      console.error("Error calling Cohere API:", error);
      // Fallback to mock result if API call fails
      return this.createMockOptimizationResult(userPrompt, platform, domain, options, mode);
    }
  }

  /**
   * Create a mock optimization result for testing or when API is unavailable
   */
  private static createMockOptimizationResult(
    userPrompt: string,
    platform: string,
    domain: string,
    options: OptimizationOptions,
    mode: "system" | "normal"
  ): OptimizationResult {
    // Simple enhancement of the prompt based on selected options
    let optimizedPrompt = userPrompt;
    const appliedTechniques: string[] = [];
    
    // Apply selected techniques (simplified mock implementation)
    if (options.usePersona) {
      optimizedPrompt = `As an expert in ${domain}, ${optimizedPrompt}`;
      appliedTechniques.push('Expert Persona');
    }
    
    if (options.useChainOfThought) {
      optimizedPrompt = `${optimizedPrompt}\n\nPlease think through this step-by-step with clear reasoning.`;
      appliedTechniques.push('Chain of Thought');
    }
    
    if (options.useConstraints) {
      optimizedPrompt = `${optimizedPrompt}\n\nProvide a comprehensive, well-structured response with practical examples.`;
      appliedTechniques.push('Advanced Constraints');
    }
    
    if (mode === "system") {
      optimizedPrompt = `# ${platform} System Instructions\n\n${optimizedPrompt}\n\nRespond in a helpful, accurate, and engaging manner.`;
      appliedTechniques.push('System Prompt Optimization');
    }
    
    // Calculate token counts
    const originalTokens = this.estimateTokens(userPrompt);
    const optimizedTokens = this.estimateTokens(optimizedPrompt);
    
    // Calculate improvement score (mock implementation)
    const estimatedImprovement = Math.min(70 + appliedTechniques.length * 5, 95);
    
    return {
      originalPrompt: userPrompt,
      optimizedPrompt,
      systemPrompt: null,
      analysis: {
        complexity: userPrompt.length > 100 ? "complex" : "moderate",
        intent: userPrompt.includes("?") ? "question" : "instruction",
        domain,
        estimatedResponseTime: Math.ceil(optimizedTokens / 20),
        strengths: ["Clear objective"],
        weaknesses: ["Could be more specific"]
      },
      appliedTechniques,
      estimatedImprovement,
      tokenCount: {
        original: originalTokens,
        optimized: optimizedTokens
      },
      domain,
      mode
    };
  }
  
  /**
   * Estimate token count from text (simple approximation)
   */
  private static estimateTokens(text: string): number {
    return Math.ceil(text.split(/\s+/).length * 1.3);
  }
}