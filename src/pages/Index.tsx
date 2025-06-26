import React, { useState, useEffect, useCallback } from "react";
import { PenTool, Zap, Target, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Components
import { PromptInput } from "@/components/PromptInput";
import { PlatformSelector } from "@/components/PlatformSelector";
import { DomainSelector } from "@/components/DomainSelector";
import { AdvancedOptimizer } from "@/components/AdvancedOptimizer";
import { OptimizationResults } from "@/components/OptimizationResults";
import { PromptQualityIndicator } from "@/components/PromptQualityIndicator";
import { ModeSelector, PromptMode } from "@/components/ModeSelector";
import { ExportPrompt } from "@/components/ExportPrompt";

// Utils
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
  const [selectedPlatform, setSelectedPlatform] = useState("gpt-4o");
  const [selectedDomain, setSelectedDomain] = useState("general");
  const [selectedMode, setSelectedMode] = useState<PromptMode>("normal");
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
    
    setIsOptimizing(true);
    try {
      const result = await PromptOptimizer.optimizePrompt(
        userPrompt, 
        selectedPlatform, 
        selectedDomain, 
        optimizationOptions, 
        selectedMode
      );
      
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
    <div className="min-h-screen paper-texture">
      <header className="bg-background/80 backdrop-blur-sm border-b-2 border-foreground/20 sketch-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-3 group focus-visible:outline-none" aria-label="PromptForge Home">
              <div className="sketch-card p-3 transform rotate-12 transition-transform group-hover:rotate-0 group-focus-visible:rotate-0">
                <PenTool className="w-6 h-6 transform -rotate-12 transition-transform group-hover:rotate-0 group-focus-visible:rotate-0" />
              </div>
              <div>
                <h1 className="text-3xl font-bold relative inline-flex items-center">
                  PromptForge
                  <div className="absolute -bottom-1 left-0 w-full h-1 bg-foreground/20 transform -skew-x-12 transition-transform group-hover:skew-x-0"></div>
                </h1>
                <p className="text-sm text-foreground/70">AI Prompt Optimizer</p>
              </div>
            </a>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section - More Compact */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-secondary rounded-full mb-6 sketch-border">
            <Sparkles className="w-4 h-4 text-primary mr-2" />
            <span className="text-sm font-medium text-primary">AI Prompt Engineering Platform</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Optimize Your AI Prompts
          </h1>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Transform your prompts with advanced optimization techniques for better AI responses across any platform.
          </p>
        </div>

        {/* Main Content - Horizontal Layout */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Sidebar - Configuration */}
          <div className="lg:col-span-4 space-y-6">
            {/* Input Section */}
            <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm sketch-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="w-5 h-5 text-primary" />
                  Input & Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <PromptInput 
                  value={userPrompt} 
                  onChange={setUserPrompt} 
                  placeholder="Enter your prompt here..." 
                />
                
                <ModeSelector value={selectedMode} onChange={setSelectedMode} />
              </CardContent>
            </Card>

            {/* Settings Section */}
            <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm sketch-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <svg 
                    className="w-5 h-5 text-primary" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
                    />
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                    />
                  </svg>
                  Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <PlatformSelector value={selectedPlatform} onChange={setSelectedPlatform} />
                <DomainSelector value={selectedDomain} onChange={setSelectedDomain} />
              </CardContent>
            </Card>
          </div>
          
          {/* Center & Right - Optimization & Results */}
          <div className="lg:col-span-8 space-y-6">
            {/* Optimization Controls */}
            <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm sketch-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="w-5 h-5 text-primary" />
                  Optimization Engine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AdvancedOptimizer 
                  options={optimizationOptions} 
                  onOptionsChange={setOptimizationOptions} 
                  onOptimize={handleOptimize} 
                  isOptimizing={isOptimizing} 
                />
              </CardContent>
            </Card>
            
            {/* Results Section */}
            <OptimizationResults 
              result={optimizationResult} 
              isOptimizing={isOptimizing} 
            />

            {/* Export Section */}
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

        {/* Status Bar */}
        <div className="mt-12 pt-6 border-t border-foreground/20 sketch-divider">
          <div className="flex items-center justify-between text-sm text-foreground/60">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs sketch-border">
                {selectedMode === "system" ? "System Mode" : "Normal Mode"}
              </Badge>
              <span>Platform: {selectedPlatform}</span>
              <span>Domain: {selectedDomain}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Ready</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;