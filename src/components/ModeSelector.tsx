
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Settings, MessageCircle, Info, Copy, Download } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export type PromptMode = "system" | "normal";

interface ModeSelectorProps {
  value: PromptMode;
  onChange: (mode: PromptMode) => void;
}

export const ModeSelector = ({ value, onChange }: ModeSelectorProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium text-gray-700">
          Optimization Mode
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
                  <li><span className="font-medium">System Prompt:</span> Creates structured instructions for AI assistants (use in system/instruction field)</li>
                  <li><span className="font-medium">Normal Prompt:</span> Creates conversation-ready prompts (paste directly into chat)</li>
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
        className="justify-start bg-gradient-to-r from-gray-50 to-gray-100 p-1 rounded-lg border"
      >
        <ToggleGroupItem
          value="system"
          className="flex items-center gap-2 px-4 py-3 data-[state=on]:bg-white data-[state=on]:shadow-md data-[state=on]:border data-[state=on]:border-blue-200 transition-all"
        >
          <Settings className="w-4 h-4" />
          <div className="text-left">
            <span className="font-medium">System Prompt</span>
            <div className="text-xs text-gray-500">For AI platforms</div>
          </div>
        </ToggleGroupItem>
        <ToggleGroupItem
          value="normal"
          className="flex items-center gap-2 px-4 py-3 data-[state=on]:bg-white data-[state=on]:shadow-md data-[state=on]:border data-[state=on]:border-green-200 transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          <div className="text-left">
            <span className="font-medium">Normal Prompt</span>
            <div className="text-xs text-gray-500">For direct chat</div>
          </div>
        </ToggleGroupItem>
      </ToggleGroup>
      
      <div className="text-xs text-gray-600 bg-white/50 rounded-lg p-3 border-l-4 border-l-blue-400">
        {value === "system" ? (
          <div>
            <p className="font-medium text-blue-700 mb-1">🔧 System Mode Active</p>
            <p>Creates structured system instructions optimized for AI platforms. Copy the result to your AI platform's system/instruction field for consistent behavior across conversations.</p>
            <div className="mt-2 text-xs text-blue-600">
              <strong>Best for:</strong> ChatGPT Custom Instructions, Claude Projects, API system messages
            </div>
          </div>
        ) : (
          <div>
            <p className="font-medium text-green-700 mb-1">💬 Normal Mode Active</p>
            <p>Creates conversation-ready prompts with context and role-playing elements. Simply paste the optimized prompt directly into your AI chat for immediate use.</p>
            <div className="mt-2 text-xs text-green-600">
              <strong>Best for:</strong> Direct chat interactions, one-time requests, detailed queries
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
