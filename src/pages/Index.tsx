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
  const { toast } = useToast();

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
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <SimplifiedHeader />
      
      <main className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            AI Prompt Engineering
            <span className="block text-blue-600 text-4xl mt-2">Made Simple</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Transform your prompts with advanced optimization techniques. Get better responses from any AI model.
          </p>
          
          <div className="inline-flex items-center px-6 py-3 bg-white/70 backdrop-blur-sm rounded-full border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-8 text-sm text-slate-700">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="font-medium">System Mode:</span>
                <span>Perfect for AI platform setup</span>
              </div>
              <div className="w-px h-4 bg-slate-300"></div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium">Normal Mode:</span>
                <span>Ready-to-use prompts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200/60">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <div className="w-5 h-5 bg-white rounded-sm"></div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Configuration</h2>
                  <p className="text-sm text-slate-500">Set up your prompt parameters</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <PromptInput 
                  value={userPrompt} 
                  onChange={setUserPrompt} 
                  placeholder="Enter your question or request (e.g., 'Best ML algorithm for image recognition')" 
                />

                <ModeSelector value={selectedMode} onChange={setSelectedMode} />
                
                <div className="grid grid-cols-1 gap-4">
                  <PlatformSelector value={selectedPlatform} onChange={setSelectedPlatform} />
                  <DomainSelector value={selectedDomain} onChange={setSelectedDomain} />
                  <ProviderSelector value={selectedProvider} onChange={setSelectedProvider} />
                </div>
                
                <ApiKeyManager 
                  provider={selectedProvider} 
                  apiKey={apiKey} 
                  onChange={setApiKey} 
                />

                {userPrompt && (
                  <div className="pt-4 border-t border-slate-100">
                    <PromptQualityIndicator 
                      score={qualityScore} 
                      isAnalyzing={isAnalyzing} 
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Results Panel */}
          <div className="lg:col-span-3 space-y-6">
            <AdvancedOptimizer 
              options={optimizationOptions} 
              onOptionsChange={setOptimizationOptions} 
              onOptimize={handleOptimize} 
              isOptimizing={isOptimizing} 
            />
            
            <OptimizationResults 
              result={optimizationResult} 
              isOptimizing={isOptimizing} 
            />

            {optimizationResult && (
              <ExportPrompt 
                optimizedPrompt={optimizationResult.optimizedPrompt} 
                platform={selectedPlatform} 
                mode={selectedMode} 
                domain={selectedDomain} 
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-slate-200/60">
          <div className="text-center text-slate-500 text-sm">
            <p>Powered by advanced AI optimization techniques</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
