
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

  // Analyze prompt whenever it changes
  useEffect(() => {
    if (userPrompt.trim()) {
      const promptAnalysis = PromptEngineer.analyzePrompt(userPrompt);
      setAnalysis(promptAnalysis);
      
      // Auto-suggest optimization techniques based on analysis
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
      
      // Auto-update domain if detected differently
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
      // Apply advanced optimization with domain context
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Column - Input & Basic Settings */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Prompt Configuration
              </h2>
              
              <div className="space-y-4">
                <PromptInput 
                  value={userPrompt}
                  onChange={setUserPrompt}
                  placeholder="Enter your prompt here for advanced optimization..."
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

            {/* Advanced Optimizer Controls */}
            <AdvancedOptimizer
              analysis={analysis}
              options={optimizationOptions}
              onOptionsChange={setOptimizationOptions}
              onOptimize={handleOptimize}
              isOptimizing={isOptimizing}
            />
          </div>
          
          {/* Right Column - Results */}
          <div className="lg:col-span-8">
            <OptimizationResults result={optimizationResult} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
