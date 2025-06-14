
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Settings, MessageCircle, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type PromptMode = "system" | "normal";

interface ModeSelectorProps {
  value: PromptMode;
  onChange: (mode: PromptMode) => void;
}

export const ModeSelector = ({ value, onChange }: ModeSelectorProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium text-gray-700">
          Prompt Mode
        </Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <div className="space-y-2">
                <p className="font-medium">Mode Types:</p>
                <ul className="text-xs space-y-1">
                  <li><span className="font-medium">System Prompt:</span> Optimized for AI assistant system instructions</li>
                  <li><span className="font-medium">Normal Prompt:</span> Optimized for direct chat interaction</li>
                </ul>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(newValue) => newValue && onChange(newValue as PromptMode)}
        className="justify-start bg-gray-50 p-1 rounded-lg"
      >
        <ToggleGroupItem
          value="system"
          className="flex items-center gap-2 px-4 py-2 data-[state=on]:bg-white data-[state=on]:shadow-sm"
        >
          <Settings className="w-4 h-4" />
          <span>System Prompt</span>
        </ToggleGroupItem>
        <ToggleGroupItem
          value="normal"
          className="flex items-center gap-2 px-4 py-2 data-[state=on]:bg-white data-[state=on]:shadow-sm"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Normal Prompt</span>
        </ToggleGroupItem>
      </ToggleGroup>
      
      <div className="text-xs text-gray-500">
        {value === "system" ? (
          <p>
            <span className="font-medium text-blue-600">System Mode:</span> Creates optimized system instructions for AI assistants. Use this in the system/instruction field of your AI platform.
          </p>
        ) : (
          <p>
            <span className="font-medium text-green-600">Normal Mode:</span> Creates optimized prompts for direct conversation. Paste this directly into your AI chat.
          </p>
        )}
      </div>
    </div>
  );
};
