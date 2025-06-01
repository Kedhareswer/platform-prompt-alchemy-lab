import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { PromptInput } from "@/components/PromptInput";
import { PlatformSelector } from "@/components/PlatformSelector";
import { DomainSelector } from "@/components/DomainSelector";
import { ProviderSelector } from "@/components/ProviderSelector";
import { ApiKeyManager } from "@/components/ApiKeyManager";
import { AdvancedOptimizer } from "@/components/AdvancedOptimizer";
import { OptimizationResults } from "@/components/OptimizationResults";
import { useToast } from "@/hooks/use-toast";
import { PromptEngineer, OptimizationOptions, PromptAnalysis } from "@/utils/promptEngineering";
import { PromptOptimizer, OptimizationResult } from "@/utils/promptOptimizer";

const Index = () => {
  const [userPrompt, setUserPrompt] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("gpt-4o");
  const [selectedDomain, setSelectedDomain] = useState("general");
  const [selectedProvider, setSelectedProvider] = useState("groq");
  const [apiKey, setApiKey] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [analysis, setAnalysis] = useState<PromptAnalysis | null>(null);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
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

  useEffect(() => {
    if (userPrompt.trim()) {
      const promptAnalysis = PromptEngineer.analyzePrompt(userPrompt);
      setAnalysis(promptAnalysis);
      
      const suggestedOptions = { ...optimizationOptions };
      
      if (promptAnalysis.complexity === 'complex' || promptAnalysis.complexity === 'expert') {
        suggestedOptions.useChainOfThought = true;
        suggestedOptions.useTreeOfThoughts = true;
      }
      
      if (promptAnalysis.intent === 'problem_solving') {
        suggestedOptions.useReAct = true;
        suggestedOptions.useSelfConsistency = true;
      }
      
      if (promptAnalysis.domain !== 'general') {
        suggestedOptions.usePersona = true;
        suggestedOptions.useRolePlay = true;
      }
      
      if (promptAnalysis.domain !== selectedDomain && promptAnalysis.confidence > 70) {
        setSelectedDomain(promptAnalysis.domain);
      }
      
      setOptimizationOptions(suggestedOptions);
    } else {
      setAnalysis(null);
    }
  }, [userPrompt]);

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
    <div className="min-h-screen bg-background paper-texture">
      {/* Decorative elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-foreground/20 rounded-full transform rotate-12"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 border-2 border-foreground/20 transform -rotate-6"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 border-2 border-foreground/20 rounded-lg transform rotate-45"></div>
      </div>

      <Header />
      
      <main className="container mx-auto px-4 py-8 relative">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sketch-card p-6 sketch-animate-in">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-foreground rounded-full"></span>
                Prompt Configuration
                <span className="w-2 h-2 bg-foreground rounded-full"></span>
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

            <div className="sketch-animate-in" style={{ animationDelay: "0.1s" }}>
              <AdvancedOptimizer
                analysis={analysis}
                options={optimizationOptions}
                onOptionsChange={setOptimizationOptions}
                onOptimize={handleOptimize}
                isOptimizing={isOptimizing}
              />
            </div>
          </div>
          
          {/* Right Column */}
          <div className="lg:col-span-8">
            <div className="sketch-animate-in" style={{ animationDelay: "0.2s" }}>
              <OptimizationResults result={optimizationResult} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;