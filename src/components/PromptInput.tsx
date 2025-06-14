import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Info, Lightbulb } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}
export const PromptInput = ({
  value,
  onChange,
  placeholder
}: PromptInputProps) => {
  const getCharacterCountColor = (count: number) => {
    if (count < 50) return "text-red-500";
    if (count < 100) return "text-yellow-500";
    return "text-green-500";
  };
  const getPromptTips = () => {
    const tips = ["Start with an action verb (e.g., 'Create', 'Analyze', 'Write')", "Be specific about what you want", "Include context and constraints", "Specify the desired format or structure", "Add examples if helpful"];
    return tips;
  };
  return <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="prompt-input" className="text-sm font-medium text-gray-700 flex items-center gap-2">
          Your Prompt
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <div className="space-y-2">
                  <p className="font-medium">Tips for better prompts:</p>
                  <ul className="text-xs space-y-1">
                    {getPromptTips().map((tip, index) => <li key={index} className="flex items-start gap-1">
                        <span className="text-blue-500">•</span>
                        <span>{tip}</span>
                      </li>)}
                  </ul>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Label>
        
        {value.length < 50 && value.length > 0 && <div className="flex items-center gap-1 text-xs text-yellow-600">
            <Lightbulb className="w-3 h-3" />
            <span>Try to be more specific</span>
          </div>}
      </div>
      
      <div className="relative">
        <Textarea id="prompt-input" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || "Example: Create a comprehensive marketing strategy for a sustainable fashion startup targeting Gen Z consumers, including social media campaigns, influencer partnerships, and budget allocation."} className="min-h-[140px] resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-16" aria-describedby="prompt-help" />
        
        <div className="absolute bottom-3 right-3 text-xs text-gray-400">
          <span className={getCharacterCountColor(value.length)}>
            {value.length}
          </span>
          <span className="text-gray-400"> chars</span>
        </div>
      </div>
      
      <div id="prompt-help" className="text-xs text-gray-500 space-y-1">
        
        {value.length === 0 && <p className="text-blue-600 font-medium">
            💡 Start with an action verb like "Create", "Analyze", or "Write" for better results
          </p>}
      </div>
    </div>;
};