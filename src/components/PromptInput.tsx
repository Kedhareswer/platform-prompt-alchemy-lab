
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const PromptInput = ({ value, onChange, placeholder }: PromptInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="prompt-input" className="text-sm font-medium text-gray-700">
        Your Prompt
      </Label>
      <Textarea
        id="prompt-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[120px] resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
      />
      <p className="text-xs text-gray-500">
        {value.length} characters
      </p>
    </div>
  );
};
