
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
import { OptimizationModeSelector, OptimizationMode } from "@/components/OptimizationModeSelector";
import { ExportPrompt } from "@/components/ExportPrompt";
import { ProviderSelector } from "@/components/ProviderSelector";
import { ApiKeyManager } from "@/components/ApiKeyManager";

// Hooks and Services
import { useAdvancedOptimization } from "@/hooks/useAdvancedOptimization";

// Types for API key management
interface APIKeyStorage {
  [provider: string]: string;
}

const Index = () => {
  // Advanced optimization hook
  const {
    analyzePrompt,
    optimizePrompt,
    configureProvider,
    currentAnalysis,
    currentQualityPrediction,
    optimizationHistory,
    selectedTechniques,
    setSelectedTechniques,
    isAnalyzing,
    isOptimizing,
    optimizationSuggestions,
    canOptimize
  } = useAdvancedOptimization();

  // Local state
  const [userPrompt, setUserPrompt] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("gpt-4o");
  const [selectedProvider, setSelectedProvider] = useState("openai");
  const [selectedDomain, setSelectedDomain] = useState("general");
  const [selectedMode, setSelectedMode] = useState<PromptMode>("normal");
  const [optimizationMode, setOptimizationMode] = useState<OptimizationMode>("normal");
  const [lastAnalyzedPrompt, setLastAnalyzedPrompt] = useState("");
  
  // API key management with localStorage
  const [apiKeys, setApiKeys] = useState<APIKeyStorage>(() => {
    try {
      const stored = localStorage.getItem('promptforge_api_keys');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Enhanced optimization options
  const [enhancedOptions, setEnhancedOptions] = useState({
    techniques: selectedTechniques,
    domain: selectedDomain,
    intent: 'informational',
    applyDomainSpecific: true,
    useQualityPrediction: true,
    personalized: true
  });
  const { toast } = useToast();

  // Save API keys to localStorage
  const saveApiKey = (provider: string, key: string) => {
    const newApiKeys = { ...apiKeys, [provider]: key };
    setApiKeys(newApiKeys);
    try {
      localStorage.setItem('promptforge_api_keys', JSON.stringify(newApiKeys));
      configureProvider(provider, key);
    } catch (error) {
      console.error('Failed to save API key:', error);
    }
  };

  // Get current API key for selected provider
  const getCurrentApiKey = () => apiKeys[selectedProvider] || "";

  // Configure provider when it changes
  useEffect(() => {
    const currentKey = getCurrentApiKey();
    if (currentKey) {
      configureProvider(selectedProvider, currentKey);
    }
  }, [selectedProvider, configureProvider]);

  // Real-time prompt analysis with debouncing
  const analyzePromptQuality = useCallback(async (prompt: string) => {
    if (!prompt.trim() || prompt === lastAnalyzedPrompt) {
      return;
    }
    
    const currentApiKey = getCurrentApiKey();
    if (!currentApiKey) {
      return; // Don't analyze if no API key
    }
    
    setLastAnalyzedPrompt(prompt);
    
    try {
      await analyzePrompt(prompt, selectedDomain);
    } catch (error) {
      console.error('Error analyzing prompt quality:', error);
      toast({
        title: "Analysis Error",
        description: "Failed to analyze prompt quality. Please check your API key and try again.",
        variant: "destructive"
      });
    }
  }, [lastAnalyzedPrompt, analyzePrompt, selectedDomain, toast, getCurrentApiKey]);

  // Debounced analysis effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (userPrompt.trim() && getCurrentApiKey()) {
        analyzePromptQuality(userPrompt);
      }
    }, 800); // Increased debounce time for API rate limits
    return () => clearTimeout(timer);
  }, [userPrompt, analyzePromptQuality, getCurrentApiKey]);

  // Update enhanced options when domain or selectedTechniques changes
  useEffect(() => {
    setEnhancedOptions(prev => ({
      ...prev,
      domain: selectedDomain,
      techniques: selectedTechniques
    }));
  }, [selectedDomain, selectedTechniques]);
  
  // Advanced optimization handler
  const handleOptimize = async () => {
    if (!userPrompt.trim()) {
      toast({
        title: "Empty Prompt",
        description: "Please enter a prompt to optimize",
        variant: "destructive"
      });
      return;
    }
    
    const currentApiKey = getCurrentApiKey();
    if (!currentApiKey) {
      toast({
        title: "API Key Required",
        description: `Please enter your ${selectedProvider} API key to optimize prompts`,
        variant: "destructive"
      });
      return;
    }
    
    try {
      const result = await optimizePrompt(userPrompt, enhancedOptions);
      
      if (result) {
        toast({
          title: "Optimization Complete",
          description: `Applied ${result.appliedTechniques.length} advanced techniques with ${Math.round(result.qualityPrediction.effectiveness)}% predicted effectiveness`,
        });
      }
    } catch (error) {
      console.error('Optimization error:', error);
      toast({
        title: "Optimization Failed",
        description: "Please check your API key and try again",
        variant: "destructive"
      });
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
                  PromptForger
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
                <OptimizationModeSelector value={optimizationMode} onChange={setOptimizationMode} />
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
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37.996.608 2.296.07 2.572-1.065z" 
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
                <ProviderSelector value={selectedProvider} onChange={setSelectedProvider} />
                <ApiKeyManager 
                  provider={selectedProvider} 
                  apiKey={getCurrentApiKey()} 
                  onChange={(key) => saveApiKey(selectedProvider, key)} 
                />
                <PlatformSelector value={selectedPlatform} onChange={setSelectedPlatform} />
                <DomainSelector value={selectedDomain} onChange={setSelectedDomain} />
              </CardContent>
            </Card>

            {/* Quality Analysis */}
            {currentAnalysis && currentQualityPrediction && (
              <PromptQualityIndicator 
                qualityScore={{
                  clarity: currentAnalysis.semanticStructure.clarity / 10,
                  specificity: currentAnalysis.semanticStructure.specificity / 10,
                  effectiveness: currentQualityPrediction.effectiveness / 10,
                  issues: {
                    isVague: currentAnalysis.identifiedIssues.some(i => i.type === 'specificity'),
                    isOverlyBroad: currentAnalysis.identifiedIssues.some(i => i.type === 'goals'),
                    lacksContext: currentAnalysis.identifiedIssues.some(i => i.type === 'context'),
                    suggestions: optimizationSuggestions
                  }
                }}
                isAnalyzing={isAnalyzing}
              />
            )}
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
                  mode={optimizationMode}
                  options={{
                    useChainOfThought: selectedTechniques.includes('meta_instruction'),
                    useFewShot: selectedTechniques.includes('expert_domain_injection'),
                    useReAct: selectedTechniques.includes('constitutional_ai'),
                    usePersona: selectedTechniques.includes('expert_domain_injection'),
                    useConstraints: selectedTechniques.includes('quality_assurance'),
                    optimizeForTokens: false,
                    useTreeOfThoughts: selectedTechniques.includes('multi_perspective'),
                    useSelfConsistency: selectedTechniques.includes('constitutional_ai'),
                    useRolePlay: selectedTechniques.includes('expert_domain_injection'),
                    useContextPrompting: true,
                    useEmotionalPrompting: selectedTechniques.includes('emotional_intelligence')
                  }} 
                  onOptionsChange={(options) => {
                    // Convert legacy options to technique selection
                    const techniques = [];
                    if (options.useChainOfThought) techniques.push('meta_instruction');
                    if (options.usePersona) techniques.push('expert_domain_injection');
                    if (options.useConstraints) techniques.push('quality_assurance');
                    if (options.useTreeOfThoughts) techniques.push('multi_perspective');
                    if (options.useSelfConsistency) techniques.push('constitutional_ai');
                    if (options.useEmotionalPrompting) techniques.push('emotional_intelligence');
                    setSelectedTechniques(techniques);
                  }} 
                  onOptimize={handleOptimize} 
                  isOptimizing={isOptimizing} 
                />
              </CardContent>
            </Card>
            
            {/* Results Section */}
            <OptimizationResults 
              result={optimizationHistory[0] ? {
                originalPrompt: optimizationHistory[0].originalPrompt,
                optimizedPrompt: optimizationHistory[0].optimizedPrompt,
                systemPrompt: null,
                analysis: {
                  complexity: optimizationHistory[0].analysis.complexity,
                  intent: optimizationHistory[0].analysis.intent,
                  domain: optimizationHistory[0].analysis.domain,
                  estimatedResponseTime: 5,
                  strengths: optimizationHistory[0].qualityPrediction.successFactors,
                  weaknesses: optimizationHistory[0].qualityPrediction.riskFactors
                },
                appliedTechniques: optimizationHistory[0].appliedTechniques,
                estimatedImprovement: optimizationHistory[0].qualityPrediction.effectiveness,
                tokenCount: {
                  original: optimizationHistory[0].analysis.tokenEstimate,
                  optimized: optimizationHistory[0].analysis.tokenEstimate + 50
                },
                domain: optimizationHistory[0].analysis.domain,
                mode: selectedMode
              } : null} 
              isOptimizing={isOptimizing} 
            />

            {/* Export Section */}
            {optimizationHistory[0] && (
              <ExportPrompt 
                optimizedPrompt={optimizationHistory[0].optimizedPrompt} 
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
              <Badge variant="outline" className="text-xs sketch-border">
                {optimizationMode === "normal" ? "Normal Optimization" : 
                 optimizationMode === "context" ? "Context Optimization" : "Emotional Optimization"}
              </Badge>
              <span>Platform: {selectedPlatform}</span>
              <span>Domain: {selectedDomain}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 ${getCurrentApiKey() ? 'bg-primary' : 'bg-gray-400'} rounded-full`}></div>
              <span>{getCurrentApiKey() ? "Ready" : "API Key Required"}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
