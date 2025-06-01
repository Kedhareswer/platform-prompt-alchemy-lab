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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
      {/* Sketch-style background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-gray-400 rounded-full transform rotate-12 border-dashed"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border-2 border-gray-400 transform -rotate-45 border-dotted"></div>
        <div className="absolute bottom-32 left-1/4 w-16 h-16 border-2 border-gray-400 rounded-lg transform rotate-45"></div>
        <div className="absolute bottom-20 right-1/3 w-20 h-20 border-2 border-gray-400 rounded-full transform -rotate-12 border-dashed"></div>
      </div>
      
      {/* Hand-drawn style lines */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M50,300 Q200,100 350,300 T650,300" stroke="#374151" strokeWidth="2" fill="none" strokeDasharray="5,5"/>
          <path d="M100,150 Q300,50 500,150 T900,150" stroke="#374151" strokeWidth="2" fill="none" strokeDasharray="3,7"/>
          <path d="M0,500 Q200,400 400,500 T800,500" stroke="#374151" strokeWidth="1" fill="none" strokeDasharray="8,3"/>
        </svg>
      </div>

      <Header />
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Column - Input & Basic Settings */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border-2 border-gray-200 relative transform hover:rotate-1 transition-transform duration-300">
              {/* Sketch-style corner decorations */}
              <div className="absolute -top-2 -left-2 w-4 h-4 border-2 border-orange-400 rounded-full bg-orange-100"></div>
              <div className="absolute -top-2 -right-2 w-4 h-4 border-2 border-blue-400 rounded-full bg-blue-100"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 border-2 border-green-400 rounded-full bg-green-100"></div>
              <div className="absolute -bottom-2 -right-2 w-4 h-4 border-2 border-purple-400 rounded-full bg-purple-100"></div>
              
              <h2 className="text-xl font-bold text-gray-800 mb-4 relative">
                <span className="relative z-10">Prompt Configuration</span>
                <div className="absolute -bottom-1 left-0 w-full h-2 bg-yellow-200 opacity-60 transform -skew-x-12"></div>
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
            <div className="transform hover:-rotate-1 transition-transform duration-300">
              <AdvancedOptimizer
                analysis={analysis}
                options={optimizationOptions}
                onOptionsChange={setOptimizationOptions}
                onOptimize={handleOptimize}
                isOptimizing={isOptimizing}
              />
            </div>
          </div>
          
          {/* Right Column - Results */}
          <div className="lg:col-span-8">
            <div className="transform hover:rotate-1 transition-transform duration-300">
              <OptimizationResults result={optimizationResult} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
