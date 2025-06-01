
import { useState } from "react";
import { Header } from "@/components/Header";
import { PromptInput } from "@/components/PromptInput";
import { PlatformSelector } from "@/components/PlatformSelector";
import { ProviderSelector } from "@/components/ProviderSelector";
import { OptimizedOutput } from "@/components/OptimizedOutput";
import { ApiKeyManager } from "@/components/ApiKeyManager";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [userPrompt, setUserPrompt] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("gpt-4o");
  const [selectedProvider, setSelectedProvider] = useState("groq");
  const [apiKey, setApiKey] = useState("");
  const [optimizedPrompt, setOptimizedPrompt] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { toast } = useToast();

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
      // Simulate API call for now - will be replaced with actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock optimized prompt based on platform
      const platformTemplates = {
        "gpt-4o": "You are an expert AI assistant. Please provide a comprehensive and detailed response to the following request:",
        "claude": "I need you to think step by step and provide a thorough analysis of:",
        "gemini": "Please approach this systematically and consider multiple perspectives when addressing:",
        "llama": "Let's work through this methodically. I want you to focus on:",
      };
      
      const template = platformTemplates[selectedPlatform as keyof typeof platformTemplates];
      const optimized = `${template}\n\n${userPrompt}\n\nPlease ensure your response is well-structured, accurate, and provides actionable insights where applicable.`;
      
      setOptimizedPrompt(optimized);
      
      toast({
        title: "Success",
        description: "Prompt optimized successfully!",
      });
    } catch (error) {
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
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Create Your Prompt
              </h2>
              
              <div className="space-y-6">
                <PromptInput 
                  value={userPrompt}
                  onChange={setUserPrompt}
                  placeholder="Enter your prompt here..."
                />
                
                <PlatformSelector 
                  value={selectedPlatform}
                  onChange={setSelectedPlatform}
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
                
                <button
                  onClick={handleOptimize}
                  disabled={isOptimizing}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isOptimizing ? "Optimizing..." : "Optimize Prompt"}
                </button>
              </div>
            </div>
          </div>
          
          {/* Output Section */}
          <div>
            <OptimizedOutput 
              content={optimizedPrompt}
              isLoading={isOptimizing}
              platform={selectedPlatform}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
