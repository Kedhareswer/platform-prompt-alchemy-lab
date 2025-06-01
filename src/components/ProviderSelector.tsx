
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Cloud, Zap, Globe } from "lucide-react";

interface ProviderSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const ProviderSelector = ({ value, onChange }: ProviderSelectorProps) => {
  const providers = [
    { id: "groq", name: "Groq", icon: Zap, description: "Ultra-fast inference" },
    { id: "aiml", name: "AI/ML API", icon: Cloud, description: "Reliable and affordable" },
    { id: "cohere", name: "Cohere", icon: Globe, description: "Enterprise-ready AI" },
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
        <SelectContent>
          {providers.map((provider) => (
            <SelectItem key={provider.id} value={provider.id}>
              <div className="flex items-center space-x-3">
                <provider.icon className="w-4 h-4" />
                <div>
                  <div className="font-medium">{provider.name}</div>
                  <div className="text-xs text-gray-500">{provider.description}</div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
