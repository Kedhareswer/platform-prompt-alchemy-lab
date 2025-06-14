
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Download, ExternalLink, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PromptMode } from "./ModeSelector";

interface ExportPromptProps {
  optimizedPrompt: string;
  platform: string;
  mode: PromptMode;
  domain: string;
}

export const ExportPrompt = ({ optimizedPrompt, platform, mode, domain }: ExportPromptProps) => {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = async (text: string, format: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 2000);
      toast({
        title: "Copied to clipboard!",
        description: `${format} format copied successfully`,
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please copy the text manually",
        variant: "destructive",
      });
    }
  };

  const downloadAsFile = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateMarkdownFormat = () => {
    return `# ${mode === 'system' ? 'System Prompt' : 'Optimized Prompt'} - ${platform}

**Domain:** ${domain}
**Mode:** ${mode === 'system' ? 'System Instructions' : 'Chat Prompt'}
**Generated:** ${new Date().toLocaleDateString()}

## Prompt Content

\`\`\`
${optimizedPrompt}
\`\`\`

## Usage Instructions

${mode === 'system' 
  ? `This is a system prompt designed for ${platform}. Copy the content above and paste it into your AI platform's system/instruction field.

### Platform-specific instructions:
- **ChatGPT:** Settings → Personalization → Custom Instructions
- **Claude:** Create a Project and use this as Project Instructions  
- **API:** Use as the 'system' message in your API calls`
  : `This is an optimized chat prompt ready for direct use. Simply copy and paste into your ${platform} chat interface.

### Tips for best results:
- Paste the entire prompt as your first message
- Feel free to follow up with clarifying questions
- The prompt includes context that will guide the AI's responses`
}
`;
  };

  const generateJSONFormat = () => {
    return JSON.stringify({
      prompt: optimizedPrompt,
      metadata: {
        platform,
        mode,
        domain,
        generated_at: new Date().toISOString(),
        usage_type: mode === 'system' ? 'system_instructions' : 'chat_prompt'
      }
    }, null, 2);
  };

  const getUsageInstructions = () => {
    if (mode === 'system') {
      return {
        title: "System Prompt Usage",
        steps: [
          "Copy the optimized system prompt above",
          platform.includes('gpt') ? "Go to ChatGPT Settings → Custom Instructions" : 
          platform.includes('claude') ? "Create a new Claude Project" : 
          "Access your AI platform's system settings",
          "Paste the prompt in the system/instruction field",
          "Save your settings for consistent behavior"
        ]
      };
    } else {
      return {
        title: "Chat Prompt Usage", 
        steps: [
          "Copy the entire optimized prompt",
          "Open your AI chat interface",
          "Paste as your first message",
          "Send and start your enhanced conversation"
        ]
      };
    }
  };

  const instructions = getUsageInstructions();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="w-5 h-5" />
          Export & Usage
        </CardTitle>
        <CardDescription>
          Choose your preferred format and get usage instructions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="plain" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="plain">Plain Text</TabsTrigger>
            <TabsTrigger value="markdown">Markdown</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
          </TabsList>
          
          <TabsContent value="plain" className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
              <pre className="text-sm whitespace-pre-wrap">{optimizedPrompt}</pre>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(optimizedPrompt, 'Plain text')}
                className="flex items-center gap-2"
              >
                {copiedFormat === 'Plain text' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadAsFile(optimizedPrompt, `prompt-${domain}-${mode}.txt`)}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="markdown" className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
              <pre className="text-sm whitespace-pre-wrap">{generateMarkdownFormat()}</pre>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(generateMarkdownFormat(), 'Markdown')}
                className="flex items-center gap-2"
              >
                {copiedFormat === 'Markdown' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadAsFile(generateMarkdownFormat(), `prompt-${domain}-${mode}.md`)}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="json" className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
              <pre className="text-sm whitespace-pre-wrap">{generateJSONFormat()}</pre>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(generateJSONFormat(), 'JSON')}
                className="flex items-center gap-2"
              >
                {copiedFormat === 'JSON' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadAsFile(generateJSONFormat(), `prompt-${domain}-${mode}.json`)}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <h4 className="font-medium text-blue-900 mb-2">{instructions.title}</h4>
          <ol className="text-sm text-blue-800 space-y-1">
            {instructions.steps.map((step, index) => (
              <li key={index} className="flex items-start">
                <span className="font-medium mr-2">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};
