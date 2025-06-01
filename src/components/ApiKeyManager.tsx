
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ExternalLink } from "lucide-react";
import { useState } from "react";

interface ApiKeyManagerProps {
  provider: string;
  apiKey: string;
  onChange: (value: string) => void;
}

export const ApiKeyManager = ({ provider, apiKey, onChange }: ApiKeyManagerProps) => {
  const [showKey, setShowKey] = useState(false);

  const providerInfo = {
    groq: {
      name: "Groq",
      url: "https://console.groq.com/keys",
      placeholder: "gsk_...",
    },
    aiml: {
      name: "AI/ML API",
      url: "https://aimlapi.com/app/keys",
      placeholder: "sk-...",
    },
    cohere: {
      name: "Cohere",
      url: "https://dashboard.cohere.ai/api-keys",
      placeholder: "co_...",
    },
  };

  const info = providerInfo[provider as keyof typeof providerInfo];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-gray-700">
          {info.name} API Key
        </Label>
        <a
          href={info.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800"
        >
          <span>Get API Key</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
      <div className="relative">
        <Input
          type={showKey ? "text" : "password"}
          value={apiKey}
          onChange={(e) => onChange(e.target.value)}
          placeholder={info.placeholder}
          className="pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={() => setShowKey(!showKey)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      <p className="text-xs text-gray-500">
        Your API key is stored locally and never sent to our servers
      </p>
    </div>
  );
};
