
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Bot, Brain, Sparkles, Cpu } from "lucide-react";

interface PlatformSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const PlatformSelector = ({ value, onChange }: PlatformSelectorProps) => {
  const platforms = [
    { id: "gpt-4o", name: "GPT-4o", icon: Bot, description: "OpenAI's most advanced model" },
    { id: "claude", name: "Claude", icon: Brain, description: "Anthropic's reasoning specialist" },
    { id: "gemini", name: "Gemini", icon: Sparkles, description: "Google's multimodal AI" },
    { id: "llama", name: "LLaMA", icon: Cpu, description: "Meta's open-source model" },
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
        <SelectContent>
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
