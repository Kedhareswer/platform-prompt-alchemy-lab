
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Cloud, Zap, Globe, Bot, Brain, Sparkles, Server, Database, Cpu } from "lucide-react";

interface ProviderSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const ProviderSelector = ({ value, onChange }: ProviderSelectorProps) => {
  const providers = [
    { id: "openai", name: "OpenAI", icon: Bot || Cloud, description: "GPT models directly from OpenAI" },
    { id: "anthropic", name: "Anthropic", icon: Brain || Cloud, description: "Claude models from Anthropic" },
    { id: "google", name: "Google AI", icon: Sparkles || Cloud, description: "Gemini models from Google" },
    { id: "groq", name: "Groq", icon: Zap || Cloud, description: "Ultra-fast inference with LPU" },
    { id: "aiml", name: "AI/ML API", icon: Cloud || Bot, description: "Reliable and affordable access" },
    { id: "cohere", name: "Cohere", icon: Globe || Cloud, description: "Enterprise-ready AI platform" },
    { id: "together", name: "Together AI", icon: Server || Cloud, description: "Open source models at scale" },
    { id: "fireworks", name: "Fireworks AI", icon: Zap || Cloud, description: "Fast inference for popular models" },
    { id: "replicate", name: "Replicate", icon: Database || Cloud, description: "Run open source models" },
    { id: "huggingface", name: "Hugging Face", icon: Cpu || Cloud, description: "Inference endpoints" },
    { id: "perplexity", name: "Perplexity", icon: Globe || Cloud, description: "Search-augmented AI" },
    { id: "mistral", name: "Mistral AI", icon: Zap || Cloud, description: "European AI excellence" },
    { id: "deepseek", name: "DeepSeek", icon: Cpu || Cloud, description: "Specialized AI models" },
    { id: "01ai", name: "01.AI", icon: Brain || Cloud, description: "Yi series models" },
    { id: "alibaba", name: "Alibaba Cloud", icon: Cloud || Bot, description: "Qwen models" },
  ];

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">
        AI Provider
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
          <SelectValue placeholder="Select AI provider" />
        </SelectTrigger>
        <SelectContent className="max-h-60">
          {providers.map((provider) => {
            const IconComponent = provider.icon || Cloud;
            return (
              <SelectItem key={provider.id} value={provider.id}>
                <div className="flex items-center space-x-3">
                  <IconComponent className="w-4 h-4" />
                  <div>
                    <div className="font-medium">{provider.name}</div>
                    <div className="text-xs text-gray-500">{provider.description}</div>
                  </div>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};
