
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-slate-700">
          Optimization Mode
        </Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <div className="space-y-2">
                <p className="font-medium">Mode Types:</p>
                <ul className="text-xs space-y-1">
                  <li><span className="font-medium">System:</span> Structured AI setup instructions</li>
                  <li><span className="font-medium">Normal:</span> Ready-to-paste chat prompts</li>
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
        className="grid grid-cols-2 w-full bg-slate-50 p-1 rounded-xl border border-slate-200"
      >
        <ToggleGroupItem
          value="system"
          className="flex items-center gap-3 px-4 py-4 data-[state=on]:bg-white data-[state=on]:shadow-sm data-[state=on]:border data-[state=on]:border-blue-200 transition-all rounded-lg"
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            value === "system" ? "bg-blue-500 text-white" : "bg-slate-200 text-slate-500"
          }`}>
            <Settings className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="font-medium text-sm">System</span>
            <div className="text-xs text-slate-500">Platform setup</div>
          </div>
        </ToggleGroupItem>
        <ToggleGroupItem
          value="normal"
          className="flex items-center gap-3 px-4 py-4 data-[state=on]:bg-white data-[state=on]:shadow-sm data-[state=on]:border data-[state=on]:border-green-200 transition-all rounded-lg"
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            value === "normal" ? "bg-green-500 text-white" : "bg-slate-200 text-slate-500"
          }`}>
            <MessageCircle className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="font-medium text-sm">Normal</span>
            <div className="text-xs text-slate-500">Direct chat</div>
          </div>
        </ToggleGroupItem>
      </ToggleGroup>
      
      <div className="text-xs bg-slate-50 rounded-xl p-4 border border-slate-200">
        {value === "system" ? (
          <div>
            <p className="font-medium text-blue-700 mb-2">🔧 System Mode Active</p>
            <p className="text-slate-600 leading-relaxed">
              Creates structured system instructions for AI platforms. Use in your AI's system/instruction field for consistent behavior.
            </p>
            <div className="mt-3 text-xs text-blue-600 font-medium">
              Best for: ChatGPT Custom Instructions, Claude Projects, API setup
            </div>
          </div>
        ) : (
          <div>
            <p className="font-medium text-green-700 mb-2">💬 Normal Mode Active</p>
            <p className="text-slate-600 leading-relaxed">
              Creates conversation-ready prompts with context. Simply paste directly into your AI chat for immediate use.
            </p>
            <div className="mt-3 text-xs text-green-600 font-medium">
              Best for: Direct chat, one-time requests, detailed queries
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
