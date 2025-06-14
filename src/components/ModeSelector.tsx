
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Settings, MessageCircle } from "lucide-react";

export type PromptMode = "system" | "normal";

interface ModeSelectorProps {
  value: PromptMode;
  onChange: (mode: PromptMode) => void;
}

export const ModeSelector = ({ value, onChange }: ModeSelectorProps) => {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-slate-700">
        Mode
      </Label>
      
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(newValue) => newValue && onChange(newValue as PromptMode)}
        className="grid grid-cols-2 w-full bg-slate-100 p-1 rounded-lg"
      >
        <ToggleGroupItem
          value="system"
          className="flex items-center gap-2 px-3 py-2 data-[state=on]:bg-white data-[state=on]:shadow-sm transition-all rounded-md text-sm"
        >
          <Settings className="w-4 h-4" />
          <span>System</span>
        </ToggleGroupItem>
        <ToggleGroupItem
          value="normal"
          className="flex items-center gap-2 px-3 py-2 data-[state=on]:bg-white data-[state=on]:shadow-sm transition-all rounded-md text-sm"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Normal</span>
        </ToggleGroupItem>
      </ToggleGroup>
      
      <div className="text-xs text-slate-500 bg-slate-50 rounded-md p-3">
        {value === "system" ? (
          <span>Creates structured system instructions for AI platforms</span>
        ) : (
          <span>Creates conversation-ready prompts for direct chat use</span>
        )}
      </div>
    </div>
  );
};
