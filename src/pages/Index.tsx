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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Settings, Zap, Target, Sparkles } from "lucide-react";

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
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <SimplifiedHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section - More Compact */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-700">AI Prompt Engineering Platform</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Optimize Your AI Prompts
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Transform your prompts with advanced optimization techniques for better AI responses across any platform.
          </p>
        </div>

        {/* Main Content - Horizontal Layout */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Sidebar - Configuration */}
          <div className="lg:col-span-4 space-y-6">
            {/* Input Section */}
            <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="w-5 h-5 text-blue-600" />
                  Input & Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <PromptInput value={userPrompt} onChange={setUserPrompt} placeholder="Enter your prompt here..." />
                
                <ModeSelector value={selectedMode} onChange={setSelectedMode} />
                
                {userPrompt}
              </CardContent>
            </Card>

            {/* Settings Section */}
            <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="w-5 h-5 text-slate-600" />
                  Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <PlatformSelector value={selectedPlatform} onChange={setSelectedPlatform} />
                <DomainSelector value={selectedDomain} onChange={setSelectedDomain} />
                <ProviderSelector value={selectedProvider} onChange={setSelectedProvider} />
                <ApiKeyManager provider={selectedProvider} apiKey={apiKey} onChange={setApiKey} />
              </CardContent>
            </Card>
          </div>
          
          {/* Center & Right - Optimization & Results */}
          <div className="lg:col-span-8 space-y-6">
            {/* Optimization Controls */}
            <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="w-5 h-5 text-orange-600" />
                  Optimization Engine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AdvancedOptimizer options={optimizationOptions} onOptionsChange={setOptimizationOptions} onOptimize={handleOptimize} isOptimizing={isOptimizing} />
              </CardContent>
            </Card>
            
            {/* Results Section */}
            <OptimizationResults result={optimizationResult} isOptimizing={isOptimizing} />

            {/* Export Section */}
            {optimizationResult && <ExportPrompt optimizedPrompt={optimizationResult.optimizedPrompt} platform={selectedPlatform} mode={selectedMode} domain={selectedDomain} />}
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-12 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">
                {selectedMode === "system" ? "System Mode" : "Normal Mode"}
              </Badge>
              <span>Platform: {selectedPlatform}</span>
              <span>Domain: {selectedDomain}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Ready</span>
            </div>
          </div>
        </div>
      </main>
    </div>;
};
export default Index;