
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Code, PenTool, TrendingUp, GraduationCap, Stethoscope, Scale, Palette, Calculator, Globe, Users } from "lucide-react";

interface DomainSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const DomainSelector = ({ value, onChange }: DomainSelectorProps) => {
  const domains = [
    { id: "general", name: "General", icon: Globe, description: "Multi-purpose assistance" },
    { id: "technology", name: "Technology & Programming", icon: Code, description: "Software development, coding, tech" },
    { id: "creative", name: "Creative Writing", icon: PenTool, description: "Stories, poetry, creative content" },
    { id: "business", name: "Business & Strategy", icon: TrendingUp, description: "Business analysis, strategy, marketing" },
    { id: "academic", name: "Academic & Research", icon: GraduationCap, description: "Research, academic writing, analysis" },
    { id: "medical", name: "Medical & Healthcare", icon: Stethoscope, description: "Medical information, healthcare" },
    { id: "legal", name: "Legal", icon: Scale, description: "Legal analysis, compliance, regulations" },
    { id: "design", name: "Design & Arts", icon: Palette, description: "Visual design, arts, creativity" },
    { id: "finance", name: "Finance & Economics", icon: Calculator, description: "Financial analysis, economics" },
    { id: "education", name: "Education & Training", icon: Users, description: "Teaching, training, curriculum" },
  ];

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">
        Domain Expertise
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
          <SelectValue placeholder="Select domain" />
        </SelectTrigger>
        <SelectContent className="max-h-60">
          {domains.map((domain) => (
            <SelectItem key={domain.id} value={domain.id}>
              <div className="flex items-center space-x-3">
                <domain.icon className="w-4 h-4" />
                <div>
                  <div className="font-medium">{domain.name}</div>
                  <div className="text-xs text-gray-500">{domain.description}</div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
