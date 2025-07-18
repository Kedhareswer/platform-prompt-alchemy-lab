
import { useToast } from "@/hooks/use-toast";

export interface AIProviderConfig {
  provider: string;
  apiKey: string;
  model?: string;
  baseUrl?: string;
  headers?: Record<string, string>;
}

export interface AIRequestOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export class AIProviderService {
  private static instance: AIProviderService;
  private config: AIProviderConfig | null = null;
  private rateLimitReset: number = 0;
  private requestsInWindow: number = 0;
  private readonly MAX_RETRIES = 3;
  
  private constructor() {}

  static getInstance(): AIProviderService {
    if (!AIProviderService.instance) {
      AIProviderService.instance = new AIProviderService();
    }
    return AIProviderService.instance;
  }

  setConfig(config: AIProviderConfig): void {
    this.config = config;
    this.requestsInWindow = 0;
    this.rateLimitReset = Date.now() + 60000; // Reset after 1 minute
  }

  getProvider(): string | null {
    return this.config?.provider || null;
  }

  async validateApiKey(): Promise<boolean> {
    if (!this.config || !this.config.apiKey) {
      return false;
    }

    try {
      const endpoint = this.getProviderEndpoint('validate');
      const headers = this.getRequestHeaders();
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers
      });

      return response.ok;
    } catch (error) {
      console.error("API key validation error:", error);
      return false;
    }
  }

  async analyzeText(text: string, options: AIRequestOptions = {}): Promise<any> {
    return this.executeWithRetry(() => this.executeAnalysisRequest(text, options));
  }

  async generateOptimizedText(
    text: string, 
    techniques: string[], 
    domain: string, 
    options: AIRequestOptions = {}
  ): Promise<any> {
    return this.executeWithRetry(() => this.executeOptimizationRequest(text, techniques, domain, options));
  }

  private async executeWithRetry<T>(fn: () => Promise<T>, retries = 0): Promise<T> {
    try {
      this.checkRateLimit();
      const result = await fn();
      this.requestsInWindow++;
      return result;
    } catch (error: any) {
      if (error.status === 429 && retries < this.MAX_RETRIES) {
        const delay = Math.pow(2, retries) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.executeWithRetry(fn, retries + 1);
      }
      throw error;
    }
  }

  private checkRateLimit(): void {
    const now = Date.now();
    if (now > this.rateLimitReset) {
      this.requestsInWindow = 0;
      this.rateLimitReset = now + 60000;
    }
    
    // Implement provider-specific rate limiting
    const maxRequestsPerMinute = this.getMaxRequestsPerMinute();
    if (this.requestsInWindow >= maxRequestsPerMinute) {
      throw new Error(`Rate limit exceeded for ${this.config?.provider}. Try again later.`);
    }
  }

  private getMaxRequestsPerMinute(): number {
    switch (this.config?.provider) {
      case 'openai': return 60;
      case 'cohere': return 40;
      case 'anthropic': return 50;
      case 'google': return 30;
      case 'mistral': return 40;
      case 'perplexity': return 35;
      default: return 20;
    }
  }

  private async executeAnalysisRequest(text: string, options: AIRequestOptions): Promise<any> {
    if (!this.config || !this.config.apiKey) {
      throw new Error("API provider not configured");
    }

    const endpoint = this.getProviderEndpoint('analyze');
    const headers = this.getRequestHeaders();
    const payload = this.createAnalysisPayload(text, options);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw {
        status: response.status,
        message: `Analysis request failed: ${response.statusText}`
      };
    }

    return response.json();
  }

  private async executeOptimizationRequest(
    text: string, 
    techniques: string[], 
    domain: string, 
    options: AIRequestOptions
  ): Promise<any> {
    if (!this.config || !this.config.apiKey) {
      throw new Error("API provider not configured");
    }

    const endpoint = this.getProviderEndpoint('optimize');
    const headers = this.getRequestHeaders();
    const payload = this.createOptimizationPayload(text, techniques, domain, options);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw {
        status: response.status,
        message: `Optimization request failed: ${response.statusText}`
      };
    }

    return response.json();
  }

  private getProviderEndpoint(operation: 'analyze' | 'optimize' | 'validate'): string {
    switch (this.config?.provider) {
      case 'openai':
        return operation === 'validate' 
          ? 'https://api.openai.com/v1/models'
          : 'https://api.openai.com/v1/chat/completions';
      
      case 'cohere':
        return operation === 'validate'
          ? 'https://api.cohere.ai/v1/models'
          : 'https://api.cohere.ai/v1/chat';
      
      case 'anthropic':
        return operation === 'validate'
          ? 'https://api.anthropic.com/v1/models'
          : 'https://api.anthropic.com/v1/messages';
        
      default:
        throw new Error(`Unsupported provider: ${this.config?.provider}`);
    }
  }

  private getRequestHeaders(): Record<string, string> {
    if (!this.config) {
      throw new Error("Provider not configured");
    }

    const commonHeaders = {
      'Content-Type': 'application/json',
    };

    switch (this.config.provider) {
      case 'openai':
        return {
          ...commonHeaders,
          'Authorization': `Bearer ${this.config.apiKey}`,
        };
      
      case 'cohere':
        return {
          ...commonHeaders,
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Cohere-Version': '2023-05-24'
        };
      
      case 'anthropic':
        return {
          ...commonHeaders,
          'x-api-key': this.config.apiKey,
          'anthropic-version': '2023-06-01'
        };
      
      default:
        return {
          ...commonHeaders,
          'Authorization': `Bearer ${this.config.apiKey}`,
          ...(this.config.headers || {})
        };
    }
  }

  private createAnalysisPayload(text: string, options: AIRequestOptions): any {
    const { temperature = 0.3, maxTokens = 1000 } = options;

    switch (this.config?.provider) {
      case 'openai':
        return {
          model: this.config.model || 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'You are a prompt analysis system. Analyze the provided text for clarity, specificity, effectiveness, and suggest improvements. Provide a structured JSON response.'
            },
            {
              role: 'user',
              content: `Analyze this prompt: "${text}"`
            }
          ],
          temperature,
          max_tokens: maxTokens,
          response_format: { type: "json_object" }
        };
      
      case 'cohere':
        return {
          model: this.config.model || 'command',
          message: `Analyze this prompt for quality: "${text}". Rate it on clarity (1-10), specificity (1-10), and effectiveness (1-10). Also identify if it's vague, overly broad, or lacks context. Provide 2-3 suggestions for improvement. Format your response as JSON.`,
          temperature,
          max_tokens: maxTokens
        };
      
      case 'anthropic':
        return {
          model: this.config.model || 'claude-3-5-sonnet-20240620',
          system: "You are a prompt analysis system. Analyze the provided text for clarity, specificity, effectiveness, and suggest improvements. Provide a structured JSON response.",
          messages: [
            {
              role: 'user',
              content: `Analyze this prompt: "${text}"`
            }
          ],
          temperature,
          max_tokens: maxTokens
        };
      
      default:
        throw new Error(`Payload creation not implemented for provider: ${this.config?.provider}`);
    }
  }

  private createOptimizationPayload(
    text: string, 
    techniques: string[], 
    domain: string, 
    options: AIRequestOptions
  ): any {
    const { temperature = 0.4, maxTokens = 1500 } = options;
    const techniquesString = techniques.join(', ');

    switch (this.config?.provider) {
      case 'openai':
        return {
          model: this.config.model || 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `You are an advanced prompt optimization system. Apply the following techniques to optimize the prompt: ${techniquesString}. Focus on the ${domain} domain. Return a JSON object with the optimized prompt and analysis.`
            },
            {
              role: 'user',
              content: `Optimize this prompt: "${text}"`
            }
          ],
          temperature,
          max_tokens: maxTokens,
          response_format: { type: "json_object" }
        };
      
      case 'cohere':
        return {
          model: this.config.model || 'command',
          message: `Optimize the following prompt for the ${domain} domain, applying these optimization techniques: ${techniquesString}.\n\nOriginal prompt: "${text}"\n\nProvide the optimized prompt and an analysis including strengths, weaknesses, and estimated improvement percentage. Format your response as JSON.`,
          temperature,
          max_tokens: maxTokens
        };
      
      case 'anthropic':
        return {
          model: this.config.model || 'claude-3-5-sonnet-20240620',
          system: `You are an advanced prompt optimization system. Apply the following techniques to optimize the prompt: ${techniquesString}. Focus on the ${domain} domain. Return a JSON object with the optimized prompt and analysis.`,
          messages: [
            {
              role: 'user',
              content: `Optimize this prompt: "${text}"`
            }
          ],
          temperature,
          max_tokens: maxTokens
        };
      
      default:
        throw new Error(`Payload creation not implemented for provider: ${this.config?.provider}`);
    }
  }
}
