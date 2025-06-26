import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ExternalLink } from "lucide-react";
import { useState } from "react";
import { SemanticAnalyzer } from "@/utils/semanticAnalysis";
import { PromptOptimizer } from "@/utils/promptOptimizer";

interface ApiKeyManagerProps {
  provider: string;
  apiKey: string;
  onChange: (value: string) => void;
}

export const ApiKeyManager = ({ provider, apiKey, onChange }: ApiKeyManagerProps) => {
  const [showKey, setShowKey] = useState(false);

  // Initialize the appropriate client when the API key changes
  const handleApiKeyChange = (value: string) => {
    onChange(value);
    
    // Initialize the appropriate client based on the provider
    if (provider === 'cohere') {
      SemanticAnalyzer.initializeClient(value);
      PromptOptimizer.initializeClient(value);
    }
    // Add other providers as needed
  };

  const providerInfo = {
    cohere: {
      name: "Cohere",
      url: "https://dashboard.cohere.com/api-keys",
      placeholder: "co_...",
    },
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
    openai: {
      name: "OpenAI",
      url: "https://platform.openai.com/api-keys",
      placeholder: "sk-...",
    },
    anthropic: {
      name: "Anthropic",
      url: "https://console.anthropic.com/",
      placeholder: "sk-ant-...",
    },
    google: {
      name: "Google AI",
      url: "https://makersuite.google.com/app/apikey",
      placeholder: "AI...",
    },
    together: {
      name: "Together AI",
      url: "https://api.together.xyz/settings/api-keys",
      placeholder: "tok_...",
    },
    fireworks: {
      name: "Fireworks AI",
      url: "https://fireworks.ai/api-keys",
      placeholder: "fw_...",
    },
    replicate: {
      name: "Replicate",
      url: "https://replicate.com/account/api-tokens",
      placeholder: "r8_...",
    },
    huggingface: {
      name: "Hugging Face",
      url: "https://huggingface.co/settings/tokens",
      placeholder: "hf_...",
    },
    perplexity: {
      name: "Perplexity",
      url: "https://www.perplexity.ai/settings/api",
      placeholder: "pplx-...",
    },
    mistral: {
      name: "Mistral AI",
      url: "https://console.mistral.ai/api-keys/",
      placeholder: "msk_...",
    },
    deepseek: {
      name: "DeepSeek",
      url: "https://platform.deepseek.com/api_keys",
      placeholder: "sk-...",
    },
    "01ai": {
      name: "01.AI",
      url: "https://platform.01.ai/",
      placeholder: "sk-...",
    },
    alibaba: {
      name: "Alibaba Cloud",
      url: "https://dashscope.aliyun.com/",
      placeholder: "sk-...",
    },
  } as const;

  // Safely get provider info with proper fallback
  const getProviderInfo = () => {
    const providerKey = provider as keyof typeof providerInfo;
    if (providerInfo[providerKey]) {
      return providerInfo[providerKey];
    }
    
    // Safe fallback with all required properties
    return {
      name: provider ? provider.charAt(0).toUpperCase() + provider.slice(1) : "Unknown Provider",
      url: "#",
      placeholder: "Enter API key...",
    };
  };

  const info = getProviderInfo();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-gray-700">
          {info.name} API Key
        </Label>
        {info.url !== "#" && (
          <a
            href={info.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800"
          >
            <span>Get API Key</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
      <div className="relative">
        <Input
          type={showKey ? "text" : "password"}
          value={apiKey}
          onChange={(e) => handleApiKeyChange(e.target.value)}
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