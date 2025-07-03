import { useState, useCallback, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import { AdvancedOptimizationEngine } from '@/services/optimizationEngine';
import { 
  OptimizationResult, 
  OptimizationMode, 
  OptimizationOptions, 
  PromptAnalysis,
  APIConfiguration 
} from '@/types';

export const useOptimization = () => {
  const { state, actions } = useApp();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<PromptAnalysis | null>(null);
  const [optimizationHistory, setOptimizationHistory] = useState<OptimizationResult[]>([]);
  
  const engineRef = useRef(AdvancedOptimizationEngine.getInstance());

  // Configure API
  const configureAPI = useCallback((config: APIConfiguration) => {
    engineRef.current.setAPIConfiguration(config);
  }, []);

  // Analyze prompt
  const analyzePrompt = useCallback(async (
    prompt: string, 
    mode: OptimizationMode
  ): Promise<PromptAnalysis | null> => {
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
      const cacheKey = `analysis_${mode}_${prompt}`;
      const cached = actions.cacheGet(cacheKey);
      if (cached) {
        setCurrentAnalysis(cached);
        return cached;
      }

      const analysis = await engineRef.current.analyzePrompt(prompt, mode);
      
      // Cache the result
      actions.cacheSet(cacheKey, analysis, 300000); // 5 minutes
      
      setCurrentAnalysis(analysis);
      actions.clearErrors();
      
      return analysis;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
      actions.addError({
        code: 'ANALYSIS_FAILED',
        message: errorMessage,
        context: { prompt, mode },
        recovered: false
      });
      return null;
    } finally {
      setIsAnalyzing(false);
      actions.setLoading(false);
    }
  }, [actions]);

  // Optimize prompt
  const optimizePrompt = useCallback(async (
    prompt: string,
    mode: OptimizationMode,
    options: OptimizationOptions,
    domain: string = 'general'
  ): Promise<OptimizationResult | null> => {
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
      const cacheKey = `optimization_${mode}_${prompt}_${JSON.stringify(options)}`;
      const cached = actions.cacheGet(cacheKey);
      if (cached) {
        setOptimizationHistory(prev => [cached, ...prev.slice(0, 9)]);
        actions.incrementUsage(true, cached.analysis.estimatedImprovement);
        return cached;
      }

      const result = await engineRef.current.optimizePrompt(prompt, mode, options, domain);
      
      // Cache the result
      actions.cacheSet(cacheKey, result, 600000); // 10 minutes
      
      // Update history
      setOptimizationHistory(prev => [result, ...prev.slice(0, 9)]); // Keep last 10
      
      // Update user usage
      actions.incrementUsage(true, result.analysis.estimatedImprovement);
      
      actions.clearErrors();
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Optimization failed';
      actions.addError({
        code: 'OPTIMIZATION_FAILED',
        message: errorMessage,
        context: { prompt, mode, options, domain },
        recovered: false
      });
      
      actions.incrementUsage(false);
      return null;
    } finally {
      setIsOptimizing(false);
      actions.setLoading(false);
    }
  }, [actions]);

  // Get optimization suggestions
  const getOptimizationSuggestions = useCallback((analysis: PromptAnalysis) => {
    return analysis.suggestions.filter(s => s.impact === 'high').slice(0, 3);
  }, []);

  // Apply suggestion
  const applySuggestion = useCallback(async (
    originalPrompt: string,
    suggestion: any,
    mode: OptimizationMode
  ): Promise<string> => {
    // Simple suggestion application logic
    let modifiedPrompt = originalPrompt;
    
    switch (suggestion.type) {
      case 'structure':
        if (!originalPrompt.includes('.')) {
          modifiedPrompt += '.';
        }
        break;
      case 'context':
        modifiedPrompt = `Given the context, ${modifiedPrompt}`;
        break;
      case 'emotional':
        modifiedPrompt += ' Please respond in a professional manner.';
        break;
    }
    
    return modifiedPrompt;
  }, []);

  // Clear history
  const clearHistory = useCallback(() => {
    setOptimizationHistory([]);
    setCurrentAnalysis(null);
    actions.cacheClear();
  }, [actions]);

  // Get performance stats
  const getPerformanceStats = useCallback(() => {
    if (!state.user) return null;
    
    const { usage } = state.user;
    const recentResults = optimizationHistory.slice(0, 5);
    
    return {
      totalOptimizations: usage.totalOptimizations,
      successRate: usage.totalOptimizations > 0 
        ? (usage.successfulOptimizations / usage.totalOptimizations) * 100 
        : 0,
      averageImprovement: usage.averageImprovement,
      recentAverageImprovement: recentResults.length > 0
        ? recentResults.reduce((sum, r) => sum + r.analysis.estimatedImprovement, 0) / recentResults.length
        : 0,
      favoriteMode: usage.favoriteMode,
      lastUsed: usage.lastUsed
    };
  }, [state.user, optimizationHistory]);

  // Export data
  const exportData = useCallback(() => {
    const data = {
      user: state.user,
      currentAnalysis,
      optimizationHistory,
      exportedAt: new Date()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-optimizer-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
  }, [state.user, currentAnalysis, optimizationHistory]);

  return {
    // State
    isAnalyzing,
    isOptimizing,
    currentAnalysis,
    optimizationHistory,
    performanceStats: getPerformanceStats(),
    
    // Actions
    configureAPI,
    analyzePrompt,
    optimizePrompt,
    getOptimizationSuggestions,
    applySuggestion,
    clearHistory,
    exportData,
    
    // Computed values
    hasHistory: optimizationHistory.length > 0,
    canOptimize: !isAnalyzing && !isOptimizing,
    lastOptimization: optimizationHistory[0] || null
  };
};