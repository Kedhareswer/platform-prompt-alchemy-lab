
import React from 'react';
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Settings, MessageCircle, Brain, Heart } from "lucide-react";

export type OptimizationMode = "normal" | "context" | "emotional";

interface OptimizationModeSelectorProps {
  value: OptimizationMode;
  onChange: (mode: OptimizationMode) => void;
}

export const OptimizationModeSelector = ({ value, onChange }: OptimizationModeSelectorProps) => {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-slate-700">
        Optimization Mode
      </Label>
      
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(newValue) => newValue && onChange(newValue as OptimizationMode)}
        className="grid grid-cols-3 w-full bg-slate-100 p-1 rounded-lg"
      >
        <ToggleGroupItem
          value="normal"
          className="flex items-center gap-2 px-3 py-2 data-[state=on]:bg-white data-[state=on]:shadow-sm transition-all rounded-md text-sm"
        >
          <Settings className="w-4 h-4" />
          <span>Normal</span>
        </ToggleGroupItem>
        <ToggleGroupItem
          value="context"
          className="flex items-center gap-2 px-3 py-2 data-[state=on]:bg-white data-[state=on]:shadow-sm transition-all rounded-md text-sm"
        >
          <Brain className="w-4 h-4" />
          <span>Context</span>
        </ToggleGroupItem>
        <ToggleGroupItem
          value="emotional"
          className="flex items-center gap-2 px-3 py-2 data-[state=on]:bg-white data-[state=on]:shadow-sm transition-all rounded-md text-sm"
        >
          <Heart className="w-4 h-4" />
          <span>Emotional</span>
        </ToggleGroupItem>
      </ToggleGroup>
      
      <div className="text-xs text-slate-500 bg-slate-50 rounded-md p-3">
        {value === "normal" && (
          <span>Standard prompt optimization with advanced techniques</span>
        )}
        {value === "context" && (
          <span>Context-aware optimization with situational enhancement</span>
        )}
        {value === "emotional" && (
          <span>Emotional intelligence optimization for better engagement</span>
        )}
      </div>
    </div>
  );
};
