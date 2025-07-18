import { useState, useCallback, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { AIProviderService } from '@/services/aiProviderService';

// Type definitions
export interface PromptQualityScore {
  clarity: number;
  specificity: number;
  effectiveness: number;
  issues: {
    isVague: boolean;
    isOverlyBroad: boolean;
    lacksContext: boolean;
    suggestions: string[];
  };
}

export interface EnhancedPromptAnalysis {
  id: string;
  timestamp: Date;
  originalPrompt: string;
  semanticStructure: {
    clarity: number;
    specificity: number;
    coherence: number;
  };
  contextFactors: {
    hasGoals: boolean;
    hasBackground: boolean;
    hasConstraints: boolean;
  };
  complexity: 'simple' | 'moderate' | 'complex' | 'expert';
  intent: string;
  domain: string;
  identifiedIssues: Array<{
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }>;
  tokenEstimate: number;
  recommendedTechniques: string[];
}

export interface QualityPredictionModel {
  effectiveness: number;
  successFactors: string[];
  riskFactors: string[];
  confidenceScore: number;
}

export interface AdvancedOptimizationResult {
  id: string;
  originalPrompt: string;
  optimizedPrompt: string;
  analysis: EnhancedPromptAnalysis;
  qualityPrediction: QualityPredictionModel;
  appliedTechniques: string[];
  timestamp: Date;
}

export interface OptimizationOptions {
  techniques: string[];
  domain: string;
  intent: string;
  applyDomainSpecific: boolean;
  useQualityPrediction: boolean;
  personalized: boolean;
}

export const useAdvancedOptimization = () => {
  const { toast } = useToast();
  const aiService = useRef(AIProviderService.getInstance());
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<EnhancedPromptAnalysis | null>(null);
  const [currentQualityPrediction, setCurrentQualityPrediction] = useState<QualityPredictionModel | null>(null);
  const [optimizationHistory, setOptimizationHistory] = useState<AdvancedOptimizationResult[]>([]);
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([
    'meta_instruction', 
    'constitutional_ai', 
    'expert_domain_injection'
  ]);
  
  const cacheRef = useRef(new Map<string, any>());

  // Parse AI analysis response to our standard format
  const parseAnalysisResponse = (response: any, prompt: string): EnhancedPromptAnalysis => {
    try {
      // Handle different response formats from different providers
      let analysis: any = response;
      
      // If we get raw JSON text from certain providers
      if (typeof response === 'string') {
        try {
          analysis = JSON.parse(response);
        } catch (e) {
          console.error('Failed to parse analysis response', e);
        }
      }
      
      // If the response is wrapped in a content/message property (like OpenAI)
      if (response.choices?.[0]?.message?.content) {
        try {
          analysis = JSON.parse(response.choices[0].message.content);
        } catch (e) {
          console.error('Failed to parse OpenAI response', e);
        }
      }
      
      // If the response is in Cohere's format
      if (response.text) {
        try {
          // Try to extract JSON from text response
          const jsonMatch = response.text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            analysis = JSON.parse(jsonMatch[0]);
          }
        } catch (e) {
          console.error('Failed to parse Cohere response', e);
        }
      }
      
      // Convert to our standard format
      return {
        id: `analysis_${Date.now()}`,
        timestamp: new Date(),
        originalPrompt: prompt,
        semanticStructure: {
          clarity: analysis.clarity * 10 || 50,
          specificity: analysis.specificity * 10 || 50,
          coherence: analysis.coherence * 10 || 50
        },
        contextFactors: {
          hasGoals: !analysis.issues?.isOverlyBroad,
          hasBackground: !analysis.issues?.lacksContext,
          hasConstraints: analysis.constraints || false
        },
        complexity: analysis.complexity || 'moderate',
        intent: analysis.intent || 'general',
        domain: analysis.domain || 'general',
        identifiedIssues: (analysis.issues?.suggestions || []).map((suggestion: string) => ({
          type: suggestion.includes('specific') ? 'specificity' : 
                suggestion.includes('context') ? 'context' : 
                suggestion.includes('goals') ? 'goals' : 'other',
          description: suggestion,
          severity: suggestion.includes('too') ? 'high' : 'medium'
        })),
        tokenEstimate: prompt.split(/\s+/).length * 1.3,
        recommendedTechniques: analysis.recommendedTechniques || [
          'meta_instruction', 
          'constitutional_ai', 
          'expert_domain_injection'
        ]
      };
    } catch (error) {
      console.error('Error parsing analysis response:', error);
      // Return a fallback analysis
      return createFallbackAnalysis(prompt);
    }
  };

  // Create a fallback analysis when parsing fails
  const createFallbackAnalysis = (prompt: string): EnhancedPromptAnalysis => {
    const wordCount = prompt.split(/\s+/).length;
    const hasQuestion = prompt.includes('?');
    const hasSpecifics = /\d+|[A-Z][a-z]+[A-Z]|\b[A-Z]{2,}\b|\b\w+\d+\w*\b/.test(prompt);
    
    return {
      id: `fallback_${Date.now()}`,
      timestamp: new Date(),
      originalPrompt: prompt,
      semanticStructure: {
        clarity: 60,
        specificity: hasSpecifics ? 70 : 40,
        coherence: 60
      },
      contextFactors: {
        hasGoals: true,
        hasBackground: wordCount > 20,
        hasConstraints: prompt.includes('must') || prompt.includes('should')
      },
      complexity: wordCount > 30 ? 'complex' : wordCount > 15 ? 'moderate' : 'simple',
      intent: hasQuestion ? 'question' : 'instruction',
      domain: 'general',
      identifiedIssues: [
        {
          type: 'specificity',
          description: 'Consider adding more specific details',
          severity: 'medium'
        }
      ],
      tokenEstimate: Math.ceil(wordCount * 1.3),
      recommendedTechniques: [
        'meta_instruction', 
        'constitutional_ai', 
        'expert_domain_injection'
      ]
    };
  };

  // Parse optimization response to our standard format
  const parseOptimizationResponse = (
    response: any, 
    originalPrompt: string,
    techniques: string[],
    analysis: EnhancedPromptAnalysis
  ): AdvancedOptimizationResult => {
    try {
      // Handle different response formats
      let optimization: any = response;
      
      // Handle OpenAI format
      if (response.choices?.[0]?.message?.content) {
        try {
          optimization = JSON.parse(response.choices[0].message.content);
        } catch (e) {
          console.error('Failed to parse OpenAI optimization response', e);
        }
      }
      
      // Handle Cohere format
      if (response.text) {
        try {
          const jsonMatch = response.text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            optimization = JSON.parse(jsonMatch[0]);
          }
        } catch (e) {
          console.error('Failed to parse Cohere optimization response', e);
        }
      }
      
      // Convert to our standard format
      return {
        id: `opt_${Date.now()}`,
        originalPrompt,
        optimizedPrompt: optimization.optimizedPrompt || response.optimizedPrompt || originalPrompt,
        analysis,
        qualityPrediction: {
          effectiveness: optimization.estimatedImprovement || 75,
          successFactors: optimization.analysis?.strengths || [],
          riskFactors: optimization.analysis?.weaknesses || [],
          confidenceScore: optimization.confidenceScore || 0.8
        },
        appliedTechniques: techniques,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error parsing optimization response:', error);
      // Return a fallback optimization result
      return {
        id: `opt_fallback_${Date.now()}`,
        originalPrompt,
        optimizedPrompt: enhancePromptFallback(originalPrompt, techniques),
        analysis,
        qualityPrediction: {
          effectiveness: 65,
          successFactors: ['Basic optimization applied'],
          riskFactors: ['Limited optimization due to parsing error'],
          confidenceScore: 0.5
        },
        appliedTechniques: techniques,
        timestamp: new Date()
      };
    }
  };

  // Fallback prompt enhancement when parsing fails
  const enhancePromptFallback = (prompt: string, techniques: string[]): string => {
    let enhanced = prompt;
    
    if (techniques.includes('meta_instruction')) {
      enhanced = `I want you to respond to the following prompt using step-by-step reasoning:\n\n${enhanced}`;
    }
    
    if (techniques.includes('expert_domain_injection')) {
      enhanced = `As an expert, ${enhanced}`;
    }
    
    if (techniques.includes('constitutional_ai')) {
      enhanced += "\n\nPlease provide a comprehensive, well-reasoned response.";
    }
    
    return enhanced;
  };

  // Analyze prompt quality
  const analyzePrompt = useCallback(async (
    prompt: string,
    domain: string = 'general'
  ): Promise<EnhancedPromptAnalysis | null> => {
    if (!prompt.trim()) {
      toast({
        title: "Empty Prompt",
        description: "Please enter a prompt to analyze",
        variant: "destructive"
      });
      return null;
    }

    setIsAnalyzing(true);

    try {
      // Check cache first
      const cacheKey = `analysis_${domain}_${prompt}`;
      const cached = cacheRef.current.get(cacheKey);
      if (cached) {
        setCurrentAnalysis(cached.analysis);
        setCurrentQualityPrediction(cached.prediction);
        return cached.analysis;
      }

      const provider = aiService.current.getProvider();
      
      // Only work with real API - require provider configuration
      if (!provider) {
        throw new Error("AI provider not configured. Please set up your API key in the API Key Manager.");
      }

      const analysisResponse = await aiService.current.analyzeText(prompt, {
        temperature: 0.3,
        maxTokens: 1000
      });
      
      // Parse the response
      const analysis = parseAnalysisResponse(analysisResponse, prompt);
      
      // Generate quality prediction
      const prediction: QualityPredictionModel = {
        effectiveness: Math.min(90, 50 + analysis.semanticStructure.clarity / 10 + analysis.semanticStructure.specificity / 10),
        successFactors: [
          analysis.semanticStructure.clarity > 70 ? 'High clarity' : 'Moderate clarity',
          analysis.semanticStructure.specificity > 70 ? 'Good specificity' : 'Adequate detail'
        ],
        riskFactors: analysis.identifiedIssues.map(issue => issue.description),
        confidenceScore: 0.85
      };

      // Set state and cache results
      setCurrentAnalysis(analysis);
      setCurrentQualityPrediction(prediction);
      
      const result = { analysis, prediction };
      cacheRef.current.set(cacheKey, result);
      
      // Select recommended techniques
      setSelectedTechniques(analysis.recommendedTechniques.slice(0, 3));
      
      return analysis;
    } catch (error) {
      console.error('Error analyzing prompt:', error);
      toast({
        title: "Analysis Error",
        description: "Failed to analyze your prompt. Please try again or check your API key.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [toast]);

  // Optimize prompt
  const optimizePrompt = useCallback(async (
    prompt: string,
    options: OptimizationOptions
  ): Promise<AdvancedOptimizationResult | null> => {
    if (!prompt.trim()) {
      toast({
        title: "Empty Prompt",
        description: "Please enter a prompt to optimize",
        variant: "destructive"
      });
      return null;
    }

    setIsOptimizing(true);

    try {
      // If we don't have an analysis yet, get one
      let analysis = currentAnalysis;
      let prediction = currentQualityPrediction;
      
      if (!analysis) {
        analysis = await analyzePrompt(prompt, options.domain);
        if (!analysis) return null;
      }
      
      if (!prediction) {
        throw new Error("Quality prediction not available. Please analyze the prompt first.");
      }

      // Use selected techniques or options.techniques
      const techniques = options.techniques.length > 0 
        ? options.techniques 
        : selectedTechniques;

      // Check cache for optimization
      const cacheKey = `optimization_${options.domain}_${prompt}_${techniques.join('_')}`;
      const cached = cacheRef.current.get(cacheKey);
      if (cached) {
        setOptimizationHistory(prev => [cached, ...prev.filter(item => item.id !== cached.id)]);
        return cached;
      }

      const provider = aiService.current.getProvider();
      
      // Only work with real API - require provider configuration
      if (!provider) {
        throw new Error("AI provider not configured. Please set up your API key in the API Key Manager.");
      }

      const optimizationResponse = await aiService.current.generateOptimizedText(
        prompt,
        techniques,
        options.domain,
        { temperature: 0.4 }
      );
      
      // Parse the response
      const result = parseOptimizationResponse(
        optimizationResponse,
        prompt,
        techniques,
        analysis
      );

      // Cache and update history
      cacheRef.current.set(cacheKey, result);
      setOptimizationHistory(prev => [result, ...prev.slice(0, 9)]);
      
      toast({
        title: "Optimization Complete",
        description: `Applied ${techniques.length} techniques with ${Math.round(result.qualityPrediction.effectiveness)}% predicted effectiveness`
      });
      
      return result;
    } catch (error) {
      console.error('Error optimizing prompt:', error);
      toast({
        title: "Optimization Error",
        description: "Failed to optimize your prompt. Please try again or check your API key.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsOptimizing(false);
    }
  }, [analyzePrompt, currentAnalysis, currentQualityPrediction, selectedTechniques, toast]);

  // Get optimization suggestions based on current analysis
  const getOptimizationSuggestions = useCallback(() => {
    if (!currentAnalysis) return [];
    
    const suggestions = [];
    
    // Quality-based suggestions
    if (currentAnalysis.semanticStructure.clarity < 70) {
      suggestions.push('Improve clarity by simplifying language and structure');
    }
    
    if (currentAnalysis.semanticStructure.specificity < 60) {
      suggestions.push('Add more specific details and concrete examples');
    }
    
    if (!currentAnalysis.contextFactors.hasGoals) {
      suggestions.push('Clearly define your objectives and desired outcomes');
    }
    
    // Technique-based suggestions
    if (currentAnalysis.complexity === 'complex' || currentAnalysis.complexity === 'expert') {
      suggestions.push('Consider using Chain of Thought or Tree of Thoughts techniques');
    }
    
    if (currentAnalysis.intent === 'problem_solving') {
      suggestions.push('Apply structured problem-solving frameworks');
    }
    
    return suggestions.slice(0, 5); // Return top 5 suggestions
  }, [currentAnalysis]);

  // Configure the AI provider
  const configureProvider = useCallback((provider: string, apiKey: string, model?: string) => {
    aiService.current.setConfig({
      provider,
      apiKey,
      model
    });
    
    // Clear cache when changing providers
    cacheRef.current.clear();
    
    // Validate the API key
    aiService.current.validateApiKey()
      .then(isValid => {
        if (isValid) {
          toast({
            title: "API Key Valid",
            description: `Successfully connected to ${provider}`,
            variant: "default"
          });
        } else {
          toast({
            title: "API Key Invalid",
            description: `Unable to validate your ${provider} API key. Using fallback mode.`,
            variant: "destructive"
          });
        }
      })
      .catch(() => {
        toast({
          title: "API Validation Error",
          description: `Couldn't connect to ${provider}. Using fallback mode.`,
          variant: "destructive"
        });
      });
  }, [toast]);

  return {
    // State
    isAnalyzing,
    isOptimizing,
    currentAnalysis,
    currentQualityPrediction,
    optimizationHistory,
    selectedTechniques,
    
    // Actions
    analyzePrompt,
    optimizePrompt,
    configureProvider,
    
    // Setters
    setSelectedTechniques,
    
    // Computed values
    optimizationSuggestions: getOptimizationSuggestions(),
    canOptimize: !isAnalyzing && !isOptimizing,
    
    // Utilities
    clearCache: () => cacheRef.current.clear()
  };
};
