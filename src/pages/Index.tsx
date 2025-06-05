import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { PromptInput } from "@/components/PromptInput";
import { PlatformSelector } from "@/components/PlatformSelector";
import { DomainSelector } from "@/components/DomainSelector";
import { ProviderSelector } from "@/components/ProviderSelector";
import { ApiKeyManager } from "@/components/ApiKeyManager";
import { AdvancedOptimizer } from "@/components/AdvancedOptimizer";
import { OptimizationResults } from "@/components/OptimizationResults";
import { PromptQualityIndicator } from "@/components/PromptQualityIndicator";
import { useToast } from "@/hooks/use-toast";
import { PromptEngineer, OptimizationOptions, PromptAnalysis } from "@/utils/promptEngineering";
import { PromptOptimizer, OptimizationResult } from "@/utils/promptOptimizer";
import { SemanticAnalyzer, PromptQualityScore } from "@/utils/semanticAnalysis";

const Index = () => {
  const [userPrompt, setUserPrompt] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("gpt-4o");
  const [selectedDomain, setSelectedDomain] = useState("general");
  const [selectedProvider, setSelectedProvider] = useState("groq");
  const [apiKey, setApiKey] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<PromptAnalysis | null>(null);
  const [qualityScore, setQualityScore] = useState<PromptQualityScore | null>(null);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [lastAnalyzedPrompt, setLastAnalyzedPrompt] = useState("");
  const [activeElement, setActiveElement] = useState<string | null>(null);
  const { t } = useTranslation();
  const mainContentRef = React.useRef<HTMLElement>(null);

  // Focus management for better keyboard navigation
  useEffect(() => {
    // Focus the main content when the component mounts
    if (mainContentRef.current) {
      mainContentRef.current.focus();
    }
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Skip if not a keyboard navigation key
    if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Enter', ' '].includes(e.key)) {
      return;
    }

    // Get all focusable elements
    const focusableElements = Array.from(
      document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(el => {
      const isVisible = (el as HTMLElement).offsetParent !== null;
      const isDisabled = (el as HTMLElement).getAttribute('aria-disabled') === 'true' || 
                       (el as HTMLButtonElement).disabled;
      return isVisible && !isDisabled;
    }) as HTMLElement[];

    if (focusableElements.length === 0) return;

    const currentIndex = focusableElements.findIndex(el => el === document.activeElement);
    let nextIndex = 0;

    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        nextIndex = (currentIndex + 1) % focusableElements.length;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        nextIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
        break;
      case 'Enter':
      case ' ':
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.click();
        }
        return;
    }

    focusableElements[nextIndex]?.focus();
  }, []);
  const [optimizationOptions, setOptimizationOptions] = useState<OptimizationOptions>({
    useChainOfThought: true,
    useFewShot: false,
    useReAct: false,
    usePersona: true,
    useConstraints: true,
    optimizeForTokens: false,
    useTreeOfThoughts: false,
    useSelfConsistency: false,
    useRolePlay: false,
  });

  const { toast } = useToast();

  // Debounce the analysis to avoid excessive processing
  const analyzePrompt = useCallback(async (prompt: string) => {
    if (!prompt.trim()) {
      setAnalysis(null);
      setQualityScore(null);
      return;
    }

    // Only analyze if the prompt has changed significantly
    if (prompt === lastAnalyzedPrompt ||
      (lastAnalyzedPrompt &&
        Math.abs(prompt.length - lastAnalyzedPrompt.length) < 10 &&
        prompt.startsWith(lastAnalyzedPrompt))) {
      return;
    }

    setIsAnalyzing(true);
    setLastAnalyzedPrompt(prompt);

    try {
      // Basic analysis (synchronous)
      const promptAnalysis = PromptEngineer.analyzePrompt(prompt);
      setAnalysis(promptAnalysis);

      // Semantic analysis (asynchronous)
      const qualityAnalysis = await SemanticAnalyzer.analyzePromptQuality(prompt);
      setQualityScore(qualityAnalysis);

      // Update optimization options based on analysis
      const suggestedOptions = { ...optimizationOptions };

      if (promptAnalysis.complexity === 'complex' || promptAnalysis.complexity === 'expert') {
        suggestedOptions.useChainOfThought = true;
        suggestedOptions.useTreeOfThoughts = true;
      }

      if (promptAnalysis.intent === 'problem_solving') {
        suggestedOptions.useReAct = true;
        suggestedOptions.useSelfConsistency = true;
      }

      setOptimizationOptions(prevOptions => ({
        ...prevOptions,
        ...suggestedOptions
      }));
    } catch (error) {
      console.error('Error analyzing prompt:', error);
      toast({
        title: t('errors.analysisError'),
        description: t('errors.tryAgain'),
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [lastAnalyzedPrompt, optimizationOptions, t, toast]);

  // Set up debounced analysis
  useEffect(() => {
    const timer = setTimeout(() => {
      analyzePrompt(userPrompt);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [userPrompt, analyzePrompt]);

  const handleOptimize = async () => {
    if (!userPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt to optimize",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey.trim()) {
      toast({
        title: "Error", 
        description: "Please enter your API key",
        variant: "destructive",
      });
      return;
    }

    setIsOptimizing(true);
    
    try {
      const result = await PromptOptimizer.optimizePrompt(
        userPrompt,
        selectedPlatform,
        selectedDomain,
        optimizationOptions
      );
      
      setOptimizationResult(result);
      
      toast({
        title: "Success",
        description: `Prompt optimized with ${result.appliedTechniques.length} techniques applied!`,
      });
    } catch (error) {
      console.error('Optimization error:', error);
      toast({
        title: "Error",
        description: "Failed to optimize prompt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-background paper-texture" 
      role="application"
      aria-label="AI Prompt Optimizer"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {/* Skip to main content link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:rounded"
      >
        Skip to main content
      </a>

      {/* Decorative elements */}
      <div 
        className="fixed inset-0 pointer-events-none" 
        aria-hidden="true"
      >
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-foreground/20 rounded-full transform rotate-12"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 border-2 border-foreground/20 transform -rotate-6"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 border-2 border-foreground/20 rounded-lg transform rotate-45"></div>
      </div>

      <Header />
      
      <main 
        id="main-content"
        ref={mainContentRef}
        className="container mx-auto px-4 py-8 relative"
        role="main"
        tabIndex={-1}
        aria-label="Prompt optimization interface"
      >
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-4 space-y-6">
            <div 
              className="sketch-card p-6 sketch-animate-in"
              role="region"
              aria-labelledby="config-heading"
            >
              <h2 
                id="config-heading"
                className="text-xl font-bold mb-4 flex items-center gap-2"
              >
                <span className="w-2 h-2 bg-foreground rounded-full" aria-hidden="true"></span>
                <span>Prompt Configuration</span>
                <span className="w-2 h-2 bg-foreground rounded-full" aria-hidden="true"></span>
              </h2>
              
              <div className="space-y-4">
                <PromptInput 
                  value={userPrompt}
                  onChange={setUserPrompt}
                  placeholder="Enter your prompt here..."
                />
                
                <PlatformSelector 
                  value={selectedPlatform}
                  onChange={setSelectedPlatform}
                />
                
                <DomainSelector 
                  value={selectedDomain}
                  onChange={setSelectedDomain}
                />
                
                <ProviderSelector 
                  value={selectedProvider}
                  onChange={setSelectedProvider}
                />
                
                <ApiKeyManager 
                  provider={selectedProvider}
                  apiKey={apiKey}
                  onChange={setApiKey}
                />
              </div>
            </div>

            <div 
              className="sketch-animate-in" 
              style={{ animationDelay: "0.1s" }}
            >
              <AdvancedOptimizer
                analysis={analysis}
                options={optimizationOptions}
                onOptionsChange={setOptimizationOptions}
                onOptimize={handleOptimize}
                isOptimizing={isOptimizing}
                aria-busy={isOptimizing}
                aria-live="polite"
              />
            </div>
          </div>
          
          {/* Right Column */}
          <div className="lg:col-span-8">
            <div 
              className="sketch-animate-in" 
              style={{ animationDelay: "0.2s" }}
              role="region"
              aria-label="Optimization results"
              aria-live="polite"
              aria-atomic="true"
            >
              <OptimizationResults 
                result={optimizationResult} 
                isOptimizing={isOptimizing}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;