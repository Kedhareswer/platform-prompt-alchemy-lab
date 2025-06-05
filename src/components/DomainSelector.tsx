
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Code, 
  Briefcase, 
  GraduationCap, 
  Palette, 
  Stethoscope, 
  Scale, 
  TrendingUp, 
  Cpu, 
  Database,
  Globe,
  Lightbulb,
  PenTool,
  Calculator,
  Beaker,
  Building,
  Users,
  Heart,
  Gamepad2,
  Music,
  Camera
} from "lucide-react";

interface DomainSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const DomainSelector = ({ value, onChange }: DomainSelectorProps) => {
  const domains = [
    { id: "general", name: "General", icon: Globe, description: "General purpose assistance" },
    
    // Technology & Programming
    { id: "software-engineering", name: "Software Engineering", icon: Code, description: "Programming, architecture, best practices" },
    { id: "machine-learning", name: "Machine Learning & AI", icon: Cpu, description: "ML algorithms, neural networks, data science" },
    { id: "data-science", name: "Data Science", icon: Database, description: "Data analysis, statistics, visualization" },
    { id: "cybersecurity", name: "Cybersecurity", icon: Code, description: "Security, penetration testing, compliance" },
    { id: "devops", name: "DevOps & Cloud", icon: Database, description: "Infrastructure, deployment, monitoring" },
    
    // Business & Finance
    { id: "business-strategy", name: "Business Strategy", icon: Briefcase, description: "Strategic planning, management, growth" },
    { id: "marketing", name: "Marketing & Sales", icon: TrendingUp, description: "Digital marketing, branding, customer acquisition" },
    { id: "finance", name: "Finance & Investment", icon: Calculator, description: "Financial analysis, investing, economics" },
    { id: "entrepreneurship", name: "Entrepreneurship", icon: Lightbulb, description: "Startups, innovation, venture capital" },
    { id: "consulting", name: "Management Consulting", icon: Users, description: "Business analysis, process improvement" },
    
    // Academic & Research
    { id: "academic-research", name: "Academic Research", icon: GraduationCap, description: "Research methodology, academic writing" },
    { id: "science", name: "Science & Research", icon: Beaker, description: "Scientific research, experimental design" },
    { id: "mathematics", name: "Mathematics", icon: Calculator, description: "Mathematical analysis, problem solving" },
    { id: "education", name: "Education & Training", icon: GraduationCap, description: "Curriculum design, pedagogy, learning" },
    
    // Creative & Design
    { id: "creative-writing", name: "Creative Writing", icon: PenTool, description: "Storytelling, content creation, copywriting" },
    { id: "design", name: "Design & UX", icon: Palette, description: "Visual design, user experience, branding" },
    { id: "photography", name: "Photography & Visual Arts", icon: Camera, description: "Photography, visual storytelling, art" },
    { id: "music", name: "Music & Audio", icon: Music, description: "Music production, composition, audio" },
    { id: "gaming", name: "Gaming & Entertainment", icon: Gamepad2, description: "Game development, entertainment industry" },
    
    // Professional Services
    { id: "legal", name: "Legal & Compliance", icon: Scale, description: "Legal analysis, compliance, contracts" },
    { id: "healthcare", name: "Healthcare & Medicine", icon: Stethoscope, description: "Medical knowledge, healthcare systems" },
    { id: "psychology", name: "Psychology & Mental Health", icon: Heart, description: "Psychology, counseling, mental wellness" },
    { id: "architecture", name: "Architecture & Construction", icon: Building, description: "Architectural design, construction, planning" },
  ];

  const groupedDomains = {
    "General": domains.filter(d => d.id === "general"),
    "Technology & Programming": domains.filter(d => 
      ["software-engineering", "machine-learning", "data-science", "cybersecurity", "devops"].includes(d.id)
    ),
    "Business & Finance": domains.filter(d => 
      ["business-strategy", "marketing", "finance", "entrepreneurship", "consulting"].includes(d.id)
    ),
    "Academic & Research": domains.filter(d => 
      ["academic-research", "science", "mathematics", "education"].includes(d.id)
    ),
    "Creative & Design": domains.filter(d => 
      ["creative-writing", "design", "photography", "music", "gaming"].includes(d.id)
    ),
    "Professional Services": domains.filter(d => 
      ["legal", "healthcare", "psychology", "architecture"].includes(d.id)
    ),
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">
        Domain Expertise
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
          <SelectValue placeholder="Select domain expertise" />
        </SelectTrigger>
        <SelectContent className="max-h-80">
          {Object.entries(groupedDomains).map(([category, categoryDomains]) => (
            <div key={category}>
              <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100">
                {category}
              </div>
              {categoryDomains.map((domain) => {
                const IconComponent = domain.icon;
                return (
                  <SelectItem key={domain.id} value={domain.id}>
                    <div className="flex items-center space-x-3">
                      <IconComponent className="w-4 h-4" />
                      <div>
                        <div className="font-medium">{domain.name}</div>
                        <div className="text-xs text-gray-500">{domain.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </div>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
