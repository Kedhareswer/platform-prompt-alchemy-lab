import React, { useState, useEffect, useCallback } from "react";
import { SimplifiedHeader } from "@/components/SimplifiedHeader";
import { PromptInput } from "@/components/PromptInput";
import { PlatformSelector } from "@/components/PlatformSelector";
import { DomainSelector } from "@/components/DomainSelector";
import { ProviderSelector } from "@/components/ProviderSelector";
import { ApiKeyManager } from "@/components/ApiKeyManager";
import { AdvancedOptimizer } from "@/components/AdvancedOptimizer";
import { OptimizationResults } from "@/components/OptimizationResults";
import { PromptQualityIndicator } from "@/components/PromptQualityIndicator";
import { ModeSelector, PromptMode } from "@/components/ModeSelector";
import { ExportPrompt } from "@/components/ExportPrompt";
import { useToast } from "@/hooks/use-toast";
import { OptimizationOptions } from "@/utils/promptEngineering";
import { PromptOptimizer, OptimizationResult } from "@/utils/promptOptimizer";
import { SemanticAnalyzer, PromptQualityScore } from "@/utils/semanticAnalysis";

// Enhanced type to match OptimizationResults component expectations
interface EnhancedOptimizationResult extends Omit<OptimizationResult, 'analysis'> {
  analysis: {
    complexity: string;
    intent: string;
    domain: string;
    estimatedResponseTime?: number;
    strengths?: string[];
    weaknesses?: string[];
  };
}
const Index = () => {
  const [userPrompt, setUserPrompt] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("gpt-4.1-2025-04-14");
  const [selectedDomain, setSelectedDomain] = useState("general");
  const [selectedProvider, setSelectedProvider] = useState("openai");
  const [selectedMode, setSelectedMode] = useState<PromptMode>("normal");
  const [apiKey, setApiKey] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [qualityScore, setQualityScore] = useState<PromptQualityScore | null>(null);
  const [optimizationResult, setOptimizationResult] = useState<EnhancedOptimizationResult | null>(null);
  const [lastAnalyzedPrompt, setLastAnalyzedPrompt] = useState("");
  const [optimizationOptions, setOptimizationOptions] = useState<OptimizationOptions>({
    useChainOfThought: true,
    useFewShot: false,
    useReAct: false,
    usePersona: true,
    useConstraints: true,
    optimizeForTokens: false,
    useTreeOfThoughts: false,
    useSelfConsistency: false,
    useRolePlay: false
  });
  const {
    toast
  } = useToast();

  // Debounce the quality analysis
  const analyzePromptQuality = useCallback(async (prompt: string) => {
    if (!prompt.trim() || prompt === lastAnalyzedPrompt) {
      return;
    }
    setIsAnalyzing(true);
    setLastAnalyzedPrompt(prompt);
    try {
      const qualityAnalysis = await SemanticAnalyzer.analyzePromptQuality(prompt);
      setQualityScore(qualityAnalysis);
    } catch (error) {
      console.error('Error analyzing prompt quality:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [lastAnalyzedPrompt]);
  useEffect(() => {
    const timer = setTimeout(() => {
      analyzePromptQuality(userPrompt);
    }, 500);
    return () => clearTimeout(timer);
  }, [userPrompt, analyzePromptQuality]);
  const handleOptimize = async () => {
    if (!userPrompt.trim()) {
      toast({
        title: "Empty Prompt",
        description: "Please enter a prompt to optimize",
        variant: "destructive"
      });
      return;
    }
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your API key",
        variant: "destructive"
      });
      return;
    }
    setIsOptimizing(true);
    try {
      const result = await PromptOptimizer.optimizePrompt(userPrompt, selectedPlatform, selectedDomain, optimizationOptions, selectedMode);

      // Transform the result to match the expected type with proper fallbacks
      const enhancedResult: EnhancedOptimizationResult = {
        ...result,
        analysis: {
          complexity: result.analysis?.complexity || "moderate",
          intent: result.analysis?.intent || "informational",
          domain: result.analysis?.domain || selectedDomain,
          estimatedResponseTime: result.analysis?.estimatedResponseTime || 5,
          strengths: result.analysis?.strengths || [],
          weaknesses: result.analysis?.weaknesses || []
        }
      };
      setOptimizationResult(enhancedResult);
      toast({
        title: "Prompt Optimized Successfully",
        description: `Applied ${result.appliedTechniques.length} optimization techniques in ${selectedMode} mode`
      });
    } catch (error) {
      console.error('Optimization error:', error);
      toast({
        title: "Optimization Failed",
        description: "Please check your API key and try again",
        variant: "destructive"
      });
    } finally {
      setIsOptimizing(false);
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-blue-200 rounded-full transform rotate-12 opacity-30"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 border-2 border-purple-200 transform -rotate-6 opacity-30"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 border-2 border-indigo-200 rounded-lg transform rotate-45 opacity-30"></div>
      </div>

      <SimplifiedHeader />
      
      <main className="container mx-auto px-4 py-8 relative max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Super-Charge Your AI Prompts
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your basic questions into professional prompts. Choose between System Prompts for AI platforms or Normal Prompts for direct chat.
          </p>
          <div className="mt-6 flex justify-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 border border-blue-200">
              <p className="text-sm text-gray-700">
                <span className="font-medium text-blue-600">System Mode:</span> 
                Perfect for ChatGPT Custom Instructions, Claude Projects, API setup
                <span className="mx-2">|</span>
                <span className="font-medium text-green-600">Normal Mode:</span> 
                Ready-to-paste optimized prompts for any AI chat
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                Prompt Configuration
              </h2>
              
              <div className="space-y-4">
                <PromptInput value={userPrompt} onChange={setUserPrompt} placeholder="Enter your question or request (e.g., 'Best ML algorithm for image recognition')" />

                <ModeSelector value={selectedMode} onChange={setSelectedMode} />
                
                <PlatformSelector value={selectedPlatform} onChange={setSelectedPlatform} />
                
                <DomainSelector value={selectedDomain} onChange={setSelectedDomain} />
                
                <ProviderSelector value={selectedProvider} onChange={setSelectedProvider} />
                
                <ApiKeyManager provider={selectedProvider} apiKey={apiKey} onChange={setApiKey} />
              </div>
            </div>

            
          </div>
          
          <div className="lg:col-span-7 space-y-6">
            <AdvancedOptimizer options={optimizationOptions} onOptionsChange={setOptimizationOptions} onOptimize={handleOptimize} isOptimizing={isOptimizing} />
            
            <OptimizationResults result={optimizationResult} isOptimizing={isOptimizing} />

            {optimizationResult && <ExportPrompt optimizedPrompt={optimizationResult.optimizedPrompt} platform={selectedPlatform} mode={selectedMode} domain={selectedDomain} />}
          </div>
        </div>
      </main>
    </div>;
};
export default Index;