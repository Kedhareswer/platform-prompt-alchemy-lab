import { useState, useCallback, useRef } from 'react';
import { AdvancedPromptEngine, EnhancedPromptAnalysis } from '@/services/advancedPromptEngine';
import { QualityPredictor, QualityPredictionModel, FeedbackData } from '@/services/qualityPredictor';
import { DomainSpecificOptimizer, DomainPattern } from '@/services/domainSpecificOptimizer';
import { useApp } from '@/contexts/AppContext';

export interface AdvancedOptimizationResult {
  id: string;
  originalPrompt: string;
  optimizedPrompt: string;
  analysis: EnhancedPromptAnalysis;
  qualityPrediction: QualityPredictionModel;
  appliedTechniques: string[];
  domainOptimizations: string[];
  timestamp: Date;
  feedback?: {
    userSatisfaction: number;
    actualEffectiveness: number;
    comments?: string;
  };
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
  const { state, actions } = useApp();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<EnhancedPromptAnalysis | null>(null);
  const [currentQualityPrediction, setCurrentQualityPrediction] = useState<QualityPredictionModel | null>(null);
  const [optimizationHistory, setOptimizationHistory] = useState<AdvancedOptimizationResult[]>([]);
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([]);
  
  const cacheRef = useRef(new Map<string, any>());

  // Comprehensive prompt analysis
  const analyzePrompt = useCallback(async (
    prompt: string,
    domain: string = 'general'
  ): Promise<{ analysis: EnhancedPromptAnalysis; prediction: QualityPredictionModel } | null> => {
    if (!prompt.trim()) {
      actions.addError({
        code: 'EMPTY_PROMPT',
        message: 'Please enter a prompt to analyze',
        recovered: false
      });
      return null;
    }

    setIsAnalyzing(true);
    actions.setLoading(true);

    try {
      // Check cache first
      const cacheKey = `analysis_${domain}_${prompt}`;
      const cached = cacheRef.current.get(cacheKey);
      if (cached) {
        setCurrentAnalysis(cached.analysis);
        setCurrentQualityPrediction(cached.prediction);
        return cached;
      }

      // Perform advanced analysis
      const analysis = await AdvancedPromptEngine.analyzePrompt(prompt, domain);
      const prediction = QualityPredictor.predictQuality(analysis);
      
      // Get personalized recommendations if user has feedback history
      if (state.user) {
        const personalizedRecommendations = QualityPredictor.getPersonalizedRecommendations(analysis);
        if (personalizedRecommendations.length > 0) {
          analysis.recommendedTechniques.push(...personalizedRecommendations);
        }
      }

      const result = { analysis, prediction };
      
      // Cache the result
      cacheRef.current.set(cacheKey, result);
      
      setCurrentAnalysis(analysis);
      setCurrentQualityPrediction(prediction);
      setSelectedTechniques(analysis.recommendedTechniques.slice(0, 3)); // Auto-select top 3
      actions.clearErrors();
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
      actions.addError({
        code: 'ANALYSIS_FAILED',
        message: errorMessage,
        context: { prompt, domain },
        recovered: false
      });
      return null;
    } finally {
      setIsAnalyzing(false);
      actions.setLoading(false);
    }
  }, [actions, state.user]);

  // Advanced prompt optimization
  const optimizePrompt = useCallback(async (
    prompt: string,
    options: OptimizationOptions
  ): Promise<AdvancedOptimizationResult | null> => {
    if (!prompt.trim()) {
      actions.addError({
        code: 'EMPTY_PROMPT',
        message: 'Please enter a prompt to optimize',
        recovered: false
      });
      return null;
    }

    setIsOptimizing(true);
    actions.setLoading(true);

    try {
      // Check cache first
      const cacheKey = `optimization_${JSON.stringify(options)}_${prompt}`;
      const cached = cacheRef.current.get(cacheKey);
      if (cached) {
        setOptimizationHistory(prev => [cached, ...prev.slice(0, 9)]);
        return cached;
      }

      // Get analysis if not already available
      let analysis = currentAnalysis;
      let prediction = currentQualityPrediction;
      
      if (!analysis || !prediction) {
        const result = await analyzePrompt(prompt, options.domain);
        if (!result) return null;
        analysis = result.analysis;
        prediction = result.prediction;
      }

      // Apply selected optimization techniques
      let optimizedPrompt = AdvancedPromptEngine.applyOptimization(
        prompt, 
        options.techniques.length > 0 ? options.techniques : selectedTechniques,
        { domain: options.domain, intent: options.intent }
      );

      // Apply domain-specific optimizations if requested
      const domainOptimizations: string[] = [];
      if (options.applyDomainSpecific) {
        const domainOptimized = DomainSpecificOptimizer.optimizeForDomain(
          optimizedPrompt, 
          options.domain, 
          options.intent
        );
        if (domainOptimized !== optimizedPrompt) {
          optimizedPrompt = domainOptimized;
          domainOptimizations.push('Domain-specific pattern applied');
        }

        const suggestions = DomainSpecificOptimizer.getDomainSuggestions(prompt, options.domain);
        domainOptimizations.push(...suggestions.slice(0, 2));
      }

      // Create optimization result
      const result: AdvancedOptimizationResult = {
        id: `opt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        originalPrompt: prompt,
        optimizedPrompt,
        analysis,
        qualityPrediction: prediction,
        appliedTechniques: options.techniques.length > 0 ? options.techniques : selectedTechniques,
        domainOptimizations,
        timestamp: new Date()
      };

      // Cache the result
      cacheRef.current.set(cacheKey, result);
      
      // Update history
      setOptimizationHistory(prev => [result, ...prev.slice(0, 9)]); // Keep last 10
      
      // Update user usage
      if (state.user) {
        actions.incrementUsage(true, prediction.effectiveness);
      }
      
      actions.clearErrors();
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Optimization failed';
      actions.addError({
        code: 'OPTIMIZATION_FAILED',
        message: errorMessage,
        context: { prompt, options },
        recovered: false
      });
      
      if (state.user) {
        actions.incrementUsage(false);
      }
      return null;
    } finally {
      setIsOptimizing(false);
      actions.setLoading(false);
    }
  }, [actions, analyzePrompt, currentAnalysis, currentQualityPrediction, selectedTechniques, state.user]);

  // Record user feedback for learning
  const recordFeedback = useCallback((
    optimizationId: string,
    userSatisfaction: number,
    actualEffectiveness: number,
    comments?: string
  ) => {
    const optimization = optimizationHistory.find(opt => opt.id === optimizationId);
    if (!optimization) return;

    const feedbackData: FeedbackData = {
      promptId: optimizationId,
      originalPrediction: optimization.qualityPrediction,
      actualOutcome: {
        userSatisfaction,
        actualEffectiveness,
        comments
      },
      timestamp: new Date()
    };

    QualityPredictor.recordFeedback(feedbackData);

    // Update optimization history with feedback
    setOptimizationHistory(prev => 
      prev.map(opt => 
        opt.id === optimizationId 
          ? { ...opt, feedback: feedbackData.actualOutcome }
          : opt
      )
    );
  }, [optimizationHistory]);

  // Get domain patterns
  const getDomainPatterns = useCallback((domain: string): DomainPattern[] => {
    return DomainSpecificOptimizer.getPatternsForDomain(domain);
  }, []);

  // Apply specific domain pattern
  const applyDomainPattern = useCallback((
    prompt: string,
    patternId: string,
    variables: Record<string, string>
  ): string => {
    return DomainSpecificOptimizer.applyPattern(prompt, patternId, variables);
  }, []);

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

  // Clear optimization cache
  const clearCache = useCallback(() => {
    cacheRef.current.clear();
    setOptimizationHistory([]);
    setCurrentAnalysis(null);
    setCurrentQualityPrediction(null);
    setSelectedTechniques([]);
  }, []);

  // Export optimization data
  const exportData = useCallback(() => {
    const data = {
      optimizationHistory,
      currentAnalysis,
      currentQualityPrediction,
      exportedAt: new Date(),
      version: '2.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `advanced-prompt-optimization-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
  }, [optimizationHistory, currentAnalysis, currentQualityPrediction]);

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
    recordFeedback,
    getDomainPatterns,
    applyDomainPattern,
    clearCache,
    exportData,
    
    // Selectors
    setSelectedTechniques,
    
    // Computed values
    optimizationSuggestions: getOptimizationSuggestions(),
    hasHistory: optimizationHistory.length > 0,
    canOptimize: !isAnalyzing && !isOptimizing,
    lastOptimization: optimizationHistory[0] || null,
    
    // Analytics
    averageImprovement: optimizationHistory.length > 0 
      ? optimizationHistory.reduce((sum, opt) => sum + opt.qualityPrediction.effectiveness, 0) / optimizationHistory.length
      : 0,
    
    userSatisfactionAverage: optimizationHistory.filter(opt => opt.feedback).length > 0
      ? optimizationHistory
          .filter(opt => opt.feedback)
          .reduce((sum, opt) => sum + (opt.feedback?.userSatisfaction || 0), 0) / 
        optimizationHistory.filter(opt => opt.feedback).length
      : 0
  };
};