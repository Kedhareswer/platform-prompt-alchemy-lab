import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Bot, Brain, Sparkles, Cpu, Zap, Globe, Code, MessageSquare, Crown, Star } from "lucide-react";

interface PlatformSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const PlatformSelector = ({ value, onChange }: PlatformSelectorProps) => {
  const platforms = [
    // OpenAI Models
    { id: "gpt-4o", name: "GPT-4o", icon: Bot || Brain, description: "OpenAI's most advanced model", category: "OpenAI" },
    { id: "gpt-4-turbo", name: "GPT-4 Turbo", icon: Bot || Brain, description: "Fast and capable", category: "OpenAI" },
    { id: "gpt-4", name: "GPT-4", icon: Bot || Brain, description: "Highly capable model", category: "OpenAI" },
    { id: "o1-preview", name: "o1-preview", icon: Crown || Bot, description: "Advanced reasoning model", category: "OpenAI" },
    { id: "o1-mini", name: "o1-mini", icon: Crown || Bot, description: "Fast reasoning model", category: "OpenAI" },
    
    // Anthropic Models
    { id: "claude-3.5-sonnet", name: "Claude 3.5 Sonnet", icon: Brain || Bot, description: "Latest and most capable", category: "Anthropic" },
    { id: "claude-3-opus", name: "Claude 3 Opus", icon: Brain || Bot, description: "Most powerful model", category: "Anthropic" },
    { id: "claude-3-sonnet", name: "Claude 3 Sonnet", icon: Brain || Bot, description: "Balanced performance", category: "Anthropic" },
    { id: "claude-3-haiku", name: "Claude 3 Haiku", icon: Brain || Bot, description: "Fastest model", category: "Anthropic" },
    
    // Google Models
    { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", icon: Sparkles || Bot, description: "Google's most capable", category: "Google" },
    { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", icon: Sparkles || Bot, description: "Fast and efficient", category: "Google" },
    { id: "gemini-pro", name: "Gemini Pro", icon: Sparkles || Bot, description: "Multimodal AI", category: "Google" },
    
    // Meta Models
    { id: "llama-3.1-405b", name: "LLaMA 3.1 405B", icon: Cpu || Bot, description: "Largest open model", category: "Meta" },
    { id: "llama-3.1-70b", name: "LLaMA 3.1 70B", icon: Cpu || Bot, description: "Efficient model", category: "Meta" },
    { id: "llama-3.1-8b", name: "LLaMA 3.1 8B", icon: Cpu || Bot, description: "Fast inference", category: "Meta" },
    
    // Mistral Models
    { id: "mistral-large", name: "Mistral Large", icon: Zap || Bot, description: "Flagship model", category: "Mistral" },
    { id: "mistral-medium", name: "Mistral Medium", icon: Zap || Bot, description: "Balanced performance", category: "Mistral" },
    { id: "mixtral-8x7b", name: "Mixtral 8x7B", icon: Zap || Bot, description: "Mixture of experts", category: "Mistral" },
    
    // Other Models
    { id: "perplexity-70b", name: "Perplexity 70B", icon: Globe || Bot, description: "Search-augmented", category: "Perplexity" },
    { id: "cohere-command-r", name: "Cohere Command R", icon: MessageSquare || Bot, description: "Enterprise model", category: "Cohere" },
    { id: "yi-large", name: "Yi Large", icon: Code || Bot, description: "Multilingual model", category: "01.AI" },
    { id: "deepseek-coder", name: "DeepSeek Coder", icon: Code || Bot, description: "Code specialist", category: "DeepSeek" },
    { id: "qwen-max", name: "Qwen Max", icon: Star || Bot, description: "Alibaba's flagship", category: "Alibaba" },
  ];

  const groupedPlatforms = platforms.reduce((acc, platform) => {
    if (!acc[platform.category]) {
      acc[platform.category] = [];
    }
    acc[platform.category].push(platform);
    return acc;
  }, {} as Record<string, typeof platforms>);

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
          {Object.entries(groupedPlatforms).map(([category, categoryPlatforms]) => (
            <div key={category}>
              <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100">
                {category}
              </div>
              {categoryPlatforms.map((platform) => {
                const IconComponent = platform.icon || Bot;
                return (
                  <SelectItem key={platform.id} value={platform.id}>
                    <div className="flex items-center space-x-3">
                      <IconComponent className="w-4 h-4" />
                      <div>
                        <div className="font-medium">{platform.name}</div>
                        <div className="text-xs text-gray-500">{platform.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </div>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
