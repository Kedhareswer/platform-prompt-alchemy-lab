
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Bot, Brain, Sparkles, Cpu, Zap, Globe, Code, MessageSquare } from "lucide-react";

interface PlatformSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const PlatformSelector = ({ value, onChange }: PlatformSelectorProps) => {
  const platforms = [
    { id: "gpt-4o", name: "GPT-4o", icon: Bot, description: "OpenAI's most advanced model" },
    { id: "gpt-4-turbo", name: "GPT-4 Turbo", icon: Bot, description: "OpenAI's fast and capable model" },
    { id: "claude-3.5-sonnet", name: "Claude 3.5 Sonnet", icon: Brain, description: "Anthropic's reasoning specialist" },
    { id: "claude-3-opus", name: "Claude 3 Opus", icon: Brain, description: "Anthropic's most powerful model" },
    { id: "gemini-pro", name: "Gemini Pro", icon: Sparkles, description: "Google's multimodal AI" },
    { id: "gemini-ultra", name: "Gemini Ultra", icon: Sparkles, description: "Google's most capable model" },
    { id: "llama-3.1-405b", name: "LLaMA 3.1 405B", icon: Cpu, description: "Meta's largest open model" },
    { id: "llama-3.1-70b", name: "LLaMA 3.1 70B", icon: Cpu, description: "Meta's efficient model" },
    { id: "mistral-large", name: "Mistral Large", icon: Zap, description: "Mistral's flagship model" },
    { id: "mixtral-8x7b", name: "Mixtral 8x7B", icon: Zap, description: "Mistral's mixture of experts" },
    { id: "perplexity-70b", name: "Perplexity 70B", icon: Globe, description: "Search-augmented model" },
    { id: "cohere-command-r", name: "Cohere Command R", icon: MessageSquare, description: "Cohere's enterprise model" },
    { id: "anthropic-haiku", name: "Claude 3 Haiku", icon: Brain, description: "Anthropic's fastest model" },
    { id: "yi-large", name: "Yi Large", icon: Code, description: "01.AI's multilingual model" },
  ];

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">
        Target Platform
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
          <SelectValue placeholder="Select AI platform" />
        </SelectTrigger>
        <SelectContent className="max-h-60">
          {platforms.map((platform) => (
            <SelectItem key={platform.id} value={platform.id}>
              <div className="flex items-center space-x-3">
                <platform.icon className="w-4 h-4" />
                <div>
                  <div className="font-medium">{platform.name}</div>
                  <div className="text-xs text-gray-500">{platform.description}</div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
