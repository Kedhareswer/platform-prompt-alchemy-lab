
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Bot, Brain, Sparkles, Cpu, Zap, Globe, Code, MessageSquare, Crown, Star, Hammer, Building, Wrench, Terminal, FileCode, Rocket } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PlatformSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const PlatformSelector = ({ value, onChange }: PlatformSelectorProps) => {
  const platforms = [
    // AI Models
    { id: "gpt-4o", name: "GPT-4o", icon: Bot, description: "OpenAI's most advanced model", category: "AI Models", provider: "OpenAI" },
    { id: "gpt-4-turbo", name: "GPT-4 Turbo", icon: Bot, description: "Fast and capable", category: "AI Models", provider: "OpenAI" },
    { id: "gpt-4", name: "GPT-4", icon: Bot, description: "Highly capable model", category: "AI Models", provider: "OpenAI" },
    { id: "o1-preview", name: "o1-preview", icon: Crown, description: "Advanced reasoning model", category: "AI Models", provider: "OpenAI" },
    { id: "o1-mini", name: "o1-mini", icon: Crown, description: "Fast reasoning model", category: "AI Models", provider: "OpenAI" },
    { id: "o3-mini", name: "o3-mini", icon: Crown, description: "Latest reasoning model", category: "AI Models", provider: "OpenAI" },
    
    { id: "claude-3.5-sonnet", name: "Claude 3.5 Sonnet", icon: Brain, description: "Latest and most capable", category: "AI Models", provider: "Anthropic" },
    { id: "claude-3-opus", name: "Claude 3 Opus", icon: Brain, description: "Most powerful model", category: "AI Models", provider: "Anthropic" },
    { id: "claude-3-sonnet", name: "Claude 3 Sonnet", icon: Brain, description: "Balanced performance", category: "AI Models", provider: "Anthropic" },
    { id: "claude-3-haiku", name: "Claude 3 Haiku", icon: Brain, description: "Fastest model", category: "AI Models", provider: "Anthropic" },
    { id: "claude-4-opus", name: "Claude 4 Opus", icon: Brain, description: "Next-gen flagship", category: "AI Models", provider: "Anthropic" },
    { id: "claude-4-sonnet", name: "Claude 4 Sonnet", icon: Brain, description: "High-performance model", category: "AI Models", provider: "Anthropic" },
    
    { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", icon: Sparkles, description: "Google's latest multimodal", category: "AI Models", provider: "Google" },
    { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", icon: Sparkles, description: "Google's most capable", category: "AI Models", provider: "Google" },
    { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", icon: Sparkles, description: "Fast and efficient", category: "AI Models", provider: "Google" },
    { id: "gemini-pro", name: "Gemini Pro", icon: Sparkles, description: "Multimodal AI", category: "AI Models", provider: "Google" },
    
    { id: "llama-3.3-70b", name: "LLaMA 3.3 70B", icon: Cpu, description: "Latest Meta model", category: "AI Models", provider: "Meta" },
    { id: "llama-3.1-405b", name: "LLaMA 3.1 405B", icon: Cpu, description: "Largest open model", category: "AI Models", provider: "Meta" },
    { id: "llama-3.1-70b", name: "LLaMA 3.1 70B", icon: Cpu, description: "Efficient model", category: "AI Models", provider: "Meta" },
    { id: "llama-3.1-8b", name: "LLaMA 3.1 8B", icon: Cpu, description: "Fast inference", category: "AI Models", provider: "Meta" },
    
    { id: "mistral-large-2", name: "Mistral Large 2", icon: Zap, description: "Latest flagship model", category: "AI Models", provider: "Mistral" },
    { id: "mistral-large", name: "Mistral Large", icon: Zap, description: "Flagship model", category: "AI Models", provider: "Mistral" },
    { id: "mistral-medium", name: "Mistral Medium", icon: Zap, description: "Balanced performance", category: "AI Models", provider: "Mistral" },
    { id: "mixtral-8x22b", name: "Mixtral 8x22B", icon: Zap, description: "Large mixture of experts", category: "AI Models", provider: "Mistral" },
    { id: "mixtral-8x7b", name: "Mixtral 8x7B", icon: Zap, description: "Mixture of experts", category: "AI Models", provider: "Mistral" },
    
    { id: "grok-3", name: "Grok 3", icon: Star, description: "xAI's latest model", category: "AI Models", provider: "xAI" },
    { id: "grok-2", name: "Grok 2", icon: Star, description: "xAI's reasoning model", category: "AI Models", provider: "xAI" },
    { id: "perplexity-70b", name: "Perplexity 70B", icon: Globe, description: "Search-augmented", category: "AI Models", provider: "Perplexity" },
    { id: "cohere-command-r-plus", name: "Command R+", icon: MessageSquare, description: "Enhanced enterprise model", category: "AI Models", provider: "Cohere" },
    { id: "cohere-command-r", name: "Command R", icon: MessageSquare, description: "Enterprise model", category: "AI Models", provider: "Cohere" },
    { id: "deepseek-r1", name: "DeepSeek R1", icon: Code, description: "Latest reasoning model", category: "AI Models", provider: "DeepSeek" },
    { id: "deepseek-coder-v2", name: "DeepSeek Coder V2", icon: Code, description: "Advanced code specialist", category: "AI Models", provider: "DeepSeek" },
    { id: "qwen-max", name: "Qwen Max", icon: Star, description: "Alibaba's flagship", category: "AI Models", provider: "Alibaba" },
    { id: "qwen-2.5-coder", name: "Qwen 2.5 Coder", icon: Code, description: "Specialized coding model", category: "AI Models", provider: "Alibaba" },
    
    // AI Builders & Tools
    { id: "lovable", name: "Lovable", icon: Building, description: "AI-powered web app builder", category: "AI Builders", provider: "Lovable" },
    { id: "vercel-v0", name: "Vercel v0", icon: Rocket, description: "AI component generator", category: "AI Builders", provider: "Vercel" },
    { id: "bolt-new", name: "Bolt.new", icon: Zap, description: "StackBlitz AI web builder", category: "AI Builders", provider: "StackBlitz" },
    { id: "cursor", name: "Cursor", icon: Terminal, description: "AI-powered code editor", category: "AI Builders", provider: "Cursor" },
    { id: "windsurf", name: "Windsurf", icon: Code, description: "Codeium's AI IDE", category: "AI Builders", provider: "Codeium" },
    { id: "trae-ai", name: "Trae AI", icon: Hammer, description: "AI development assistant", category: "AI Builders", provider: "Trae" },
    { id: "replit-agent", name: "Replit Agent", icon: FileCode, description: "AI coding companion", category: "AI Builders", provider: "Replit" },
    { id: "github-copilot", name: "GitHub Copilot", icon: Code, description: "AI pair programmer", category: "AI Builders", provider: "GitHub" },
    { id: "supermaven", name: "Supermaven", icon: Zap, description: "Fast AI autocomplete", category: "AI Builders", provider: "Supermaven" },
    { id: "codeium", name: "Codeium", icon: Terminal, description: "Free AI coding assistant", category: "AI Builders", provider: "Codeium" },
    { id: "tabnine", name: "Tabnine", icon: Brain, description: "AI code completion", category: "AI Builders", provider: "Tabnine" },
    { id: "aws-codewhisperer", name: "CodeWhisperer", icon: Building, description: "Amazon's AI assistant", category: "AI Builders", provider: "AWS" },
    { id: "sourcegraph-cody", name: "Sourcegraph Cody", icon: Code, description: "AI coding assistant", category: "AI Builders", provider: "Sourcegraph" },
    { id: "continue-dev", name: "Continue", icon: Wrench, description: "Open-source AI assistant", category: "AI Builders", provider: "Continue" },
    { id: "aider", name: "Aider", icon: Terminal, description: "AI pair programming CLI", category: "AI Builders", provider: "Aider" },
    { id: "phind", name: "Phind", icon: Globe, description: "AI search for developers", category: "AI Builders", provider: "Phind" },
    { id: "claude-artifacts", name: "Claude Artifacts", icon: Hammer, description: "Interactive code generation", category: "AI Builders", provider: "Anthropic" },
    { id: "chatgpt-code-interpreter", name: "ChatGPT Code Interpreter", icon: Terminal, description: "OpenAI's coding tool", category: "AI Builders", provider: "OpenAI" },
  ];

  const groupedPlatforms = platforms.reduce((acc, platform) => {
    if (!acc[platform.category]) {
      acc[platform.category] = [];
    }
    acc[platform.category].push(platform);
    return acc;
  }, {} as Record<string, typeof platforms>);

  const orderedCategories = ["AI Models", "AI Builders"];

  const selectedPlatform = platforms.find(p => p.id === value);

  const getProviderColor = (provider: string) => {
    const colors: Record<string, string> = {
      "OpenAI": "bg-green-100 text-green-700 border-green-200",
      "Anthropic": "bg-orange-100 text-orange-700 border-orange-200",
      "Google": "bg-blue-100 text-blue-700 border-blue-200",
      "Meta": "bg-blue-100 text-blue-700 border-blue-200",
      "Mistral": "bg-purple-100 text-purple-700 border-purple-200",
      "xAI": "bg-gray-100 text-gray-700 border-gray-200",
      "Perplexity": "bg-indigo-100 text-indigo-700 border-indigo-200",
      "Cohere": "bg-teal-100 text-teal-700 border-teal-200",
      "DeepSeek": "bg-red-100 text-red-700 border-red-200",
      "Alibaba": "bg-yellow-100 text-yellow-700 border-yellow-200",
    };
    return colors[provider] || "bg-slate-100 text-slate-700 border-slate-200";
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold text-slate-800">
          Target AI Platform
        </Label>
        {selectedPlatform && (
          <Badge 
            variant="outline" 
            className={`text-xs px-2 py-1 ${getProviderColor(selectedPlatform.provider)}`}
          >
            {selectedPlatform.provider}
          </Badge>
        )}
      </div>
      
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-12 border-slate-300 bg-white hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 shadow-sm">
          <SelectValue placeholder="Choose your AI platform" className="text-slate-600" />
        </SelectTrigger>
        <SelectContent className="max-h-80 w-full min-w-[400px] bg-white border-slate-200 shadow-lg">
          {orderedCategories.map((category) => {
            const categoryPlatforms = groupedPlatforms[category] || [];
            return (
              <div key={category} className="py-1">
                <div className="px-3 py-2 text-xs font-bold text-slate-600 bg-slate-50 border-b border-slate-100 sticky top-0 z-10">
                  <div className="flex items-center gap-2">
                    {category === "AI Models" ? (
                      <Brain className="w-3 h-3" />
                    ) : (
                      <Hammer className="w-3 h-3" />
                    )}
                    {category}
                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                      {categoryPlatforms.length}
                    </Badge>
                  </div>
                </div>
                {categoryPlatforms.map((platform) => {
                  const IconComponent = platform.icon;
                  return (
                    <SelectItem 
                      key={platform.id} 
                      value={platform.id}
                      className="py-3 px-3 cursor-pointer hover:bg-slate-50 focus:bg-blue-50 data-[highlighted]:bg-blue-50 transition-colors duration-150"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="flex-shrink-0">
                          <IconComponent className="w-5 h-5 text-slate-600" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-900 truncate">
                              {platform.name}
                            </span>
                            <Badge 
                              variant="outline" 
                              className={`text-xs px-1.5 py-0.5 ${getProviderColor(platform.provider)}`}
                            >
                              {platform.provider}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-500 truncate">
                            {platform.description}
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </div>
            );
          })}
        </SelectContent>
      </Select>
      
      {selectedPlatform && (
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
          <div className="flex items-start gap-3">
            <selectedPlatform.icon className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-900">{selectedPlatform.name}</span>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getProviderColor(selectedPlatform.provider)}`}
                >
                  {selectedPlatform.provider}
                </Badge>
              </div>
              <p className="text-xs text-slate-600">{selectedPlatform.description}</p>
              <Badge variant="secondary" className="text-xs">
                {selectedPlatform.category}
              </Badge>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
