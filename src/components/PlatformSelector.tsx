
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Bot, Brain, Sparkles, Cpu, Zap, Globe, Code, MessageSquare, Crown, Star, Hammer, Building, Wrench, Terminal, FileCode, Rocket } from "lucide-react";

interface PlatformSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const PlatformSelector = ({ value, onChange }: PlatformSelectorProps) => {
  const platforms = [
    // AI Models
    { id: "gpt-4o", name: "GPT-4o", icon: Bot, description: "OpenAI's most advanced model", category: "AI Models" },
    { id: "gpt-4-turbo", name: "GPT-4 Turbo", icon: Bot, description: "Fast and capable", category: "AI Models" },
    { id: "gpt-4", name: "GPT-4", icon: Bot, description: "Highly capable model", category: "AI Models" },
    { id: "o1-preview", name: "o1-preview", icon: Crown, description: "Advanced reasoning model", category: "AI Models" },
    { id: "o1-mini", name: "o1-mini", icon: Crown, description: "Fast reasoning model", category: "AI Models" },
    { id: "o3-mini", name: "o3-mini", icon: Crown, description: "Latest reasoning model", category: "AI Models" },
    
    { id: "claude-3.5-sonnet", name: "Claude 3.5 Sonnet", icon: Brain, description: "Latest and most capable", category: "AI Models" },
    { id: "claude-3-opus", name: "Claude 3 Opus", icon: Brain, description: "Most powerful model", category: "AI Models" },
    { id: "claude-3-sonnet", name: "Claude 3 Sonnet", icon: Brain, description: "Balanced performance", category: "AI Models" },
    { id: "claude-3-haiku", name: "Claude 3 Haiku", icon: Brain, description: "Fastest model", category: "AI Models" },
    { id: "claude-4-opus", name: "Claude 4 Opus", icon: Brain, description: "Next-gen flagship", category: "AI Models" },
    { id: "claude-4-sonnet", name: "Claude 4 Sonnet", icon: Brain, description: "High-performance model", category: "AI Models" },
    
    { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", icon: Sparkles, description: "Google's latest multimodal", category: "AI Models" },
    { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", icon: Sparkles, description: "Google's most capable", category: "AI Models" },
    { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", icon: Sparkles, description: "Fast and efficient", category: "AI Models" },
    { id: "gemini-pro", name: "Gemini Pro", icon: Sparkles, description: "Multimodal AI", category: "AI Models" },
    
    { id: "llama-3.3-70b", name: "LLaMA 3.3 70B", icon: Cpu, description: "Latest Meta model", category: "AI Models" },
    { id: "llama-3.1-405b", name: "LLaMA 3.1 405B", icon: Cpu, description: "Largest open model", category: "AI Models" },
    { id: "llama-3.1-70b", name: "LLaMA 3.1 70B", icon: Cpu, description: "Efficient model", category: "AI Models" },
    { id: "llama-3.1-8b", name: "LLaMA 3.1 8B", icon: Cpu, description: "Fast inference", category: "AI Models" },
    
    { id: "mistral-large-2", name: "Mistral Large 2", icon: Zap, description: "Latest flagship model", category: "AI Models" },
    { id: "mistral-large", name: "Mistral Large", icon: Zap, description: "Flagship model", category: "AI Models" },
    { id: "mistral-medium", name: "Mistral Medium", icon: Zap, description: "Balanced performance", category: "AI Models" },
    { id: "mixtral-8x22b", name: "Mixtral 8x22B", icon: Zap, description: "Large mixture of experts", category: "AI Models" },
    { id: "mixtral-8x7b", name: "Mixtral 8x7B", icon: Zap, description: "Mixture of experts", category: "AI Models" },
    
    { id: "grok-3", name: "Grok 3", icon: Star, description: "xAI's latest model", category: "AI Models" },
    { id: "grok-2", name: "Grok 2", icon: Star, description: "xAI's reasoning model", category: "AI Models" },
    { id: "perplexity-70b", name: "Perplexity 70B", icon: Globe, description: "Search-augmented", category: "AI Models" },
    { id: "cohere-command-r-plus", name: "Command R+", icon: MessageSquare, description: "Enhanced enterprise model", category: "AI Models" },
    { id: "cohere-command-r", name: "Command R", icon: MessageSquare, description: "Enterprise model", category: "AI Models" },
    { id: "deepseek-r1", name: "DeepSeek R1", icon: Code, description: "Latest reasoning model", category: "AI Models" },
    { id: "deepseek-coder-v2", name: "DeepSeek Coder V2", icon: Code, description: "Advanced code specialist", category: "AI Models" },
    { id: "qwen-max", name: "Qwen Max", icon: Star, description: "Alibaba's flagship", category: "AI Models" },
    { id: "qwen-2.5-coder", name: "Qwen 2.5 Coder", icon: Code, description: "Specialized coding model", category: "AI Models" },
    
    // AI Builders & Tools
    { id: "lovable", name: "Lovable", icon: Building, description: "AI-powered web app builder", category: "AI Builders" },
    { id: "vercel-v0", name: "Vercel v0", icon: Rocket, description: "AI component generator", category: "AI Builders" },
    { id: "bolt-new", name: "Bolt.new", icon: Zap, description: "StackBlitz AI web builder", category: "AI Builders" },
    { id: "cursor", name: "Cursor", icon: Terminal, description: "AI-powered code editor", category: "AI Builders" },
    { id: "windsurf", name: "Windsurf", icon: Code, description: "Codeium's AI IDE", category: "AI Builders" },
    { id: "trae-ai", name: "Trae AI", icon: Hammer, description: "AI development assistant", category: "AI Builders" },
    { id: "replit-agent", name: "Replit Agent", icon: FileCode, description: "AI coding companion", category: "AI Builders" },
    { id: "github-copilot", name: "GitHub Copilot", icon: Code, description: "AI pair programmer", category: "AI Builders" },
    { id: "supermaven", name: "Supermaven", icon: Zap, description: "Fast AI autocomplete", category: "AI Builders" },
    { id: "codeium", name: "Codeium", icon: Terminal, description: "Free AI coding assistant", category: "AI Builders" },
    { id: "tabnine", name: "Tabnine", icon: Brain, description: "AI code completion", category: "AI Builders" },
    { id: "aws-codewhisperer", name: "CodeWhisperer", icon: Building, description: "Amazon's AI assistant", category: "AI Builders" },
    { id: "sourcegraph-cody", name: "Sourcegraph Cody", icon: Code, description: "AI coding assistant", category: "AI Builders" },
    { id: "continue-dev", name: "Continue", icon: Wrench, description: "Open-source AI assistant", category: "AI Builders" },
    { id: "aider", name: "Aider", icon: Terminal, description: "AI pair programming CLI", category: "AI Builders" },
    { id: "phind", name: "Phind", icon: Globe, description: "AI search for developers", category: "AI Builders" },
    { id: "claude-artifacts", name: "Claude Artifacts", icon: Hammer, description: "Interactive code generation", category: "AI Builders" },
    { id: "chatgpt-code-interpreter", name: "ChatGPT Code Interpreter", icon: Terminal, description: "OpenAI's coding tool", category: "AI Builders" },
  ];

  const groupedPlatforms = platforms.reduce((acc, platform) => {
    if (!acc[platform.category]) {
      acc[platform.category] = [];
    }
    acc[platform.category].push(platform);
    return acc;
  }, {} as Record<string, typeof platforms>);

  // Order categories to show AI Models first, then AI Builders
  const orderedCategories = ["AI Models", "AI Builders"];

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">
        Target AI Platform
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
          <SelectValue placeholder="Select AI platform" />
        </SelectTrigger>
        <SelectContent className="max-h-80">
          {orderedCategories.map((category) => {
            const categoryPlatforms = groupedPlatforms[category] || [];
            return (
              <div key={category}>
                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 bg-gray-100 sticky top-0">
                  {category}
                </div>
                {categoryPlatforms.map((platform) => {
                  const IconComponent = platform.icon;
                  return (
                    <SelectItem key={platform.id} value={platform.id}>
                      <div className="flex items-center space-x-3">
                        <IconComponent className="w-4 h-4 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="font-medium truncate">{platform.name}</div>
                          <div className="text-xs text-gray-500 truncate">{platform.description}</div>
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
    </div>
  );
};
