import React from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Zap, 
  Brain, 
  Target, 
  Users, 
  Shield, 
  Minimize, 
  TreePine, 
  CheckCircle, 
  UserCheck,
  Sparkles 
} from "lucide-react";
import { OptimizationOptions } from "@/utils/promptEngineering";

interface AdvancedOptimizerProps {
  options: OptimizationOptions;
  onOptionsChange: (options: OptimizationOptions) => void;
  onOptimize: () => void;
  isOptimizing: boolean;
}

export const AdvancedOptimizer = ({
  options,
  onOptionsChange,
  onOptimize,
  isOptimizing
}: AdvancedOptimizerProps) => {
  const updateOption = (key: keyof OptimizationOptions, value: boolean) => {
    onOptionsChange({
      ...options,
      [key]: value
    });
  };

  const optimizationTechniques = [
    {
      id: "useChainOfThought" as keyof OptimizationOptions,
      name: "Chain of Thought",
      description: "Break down complex problems into step-by-step reasoning",
      icon: Brain,
      recommended: true,
      category: "Reasoning"
    },
    {
      id: "useTreeOfThoughts" as keyof OptimizationOptions,
      name: "Tree of Thoughts",
      description: "Explore multiple solution paths for complex problems",
      icon: TreePine,
      recommended: false,
      category: "Reasoning"
    },
    {
      id: "useSelfConsistency" as keyof OptimizationOptions,
      name: "Self Consistency",
      description: "Generate multiple solutions and cross-verify for accuracy",
      icon: CheckCircle,
      recommended: false,
      category: "Reasoning"
    },
    {
      id: "useReAct" as keyof OptimizationOptions,
      name: "ReAct Pattern",
      description: "Combine reasoning and acting for problem-solving tasks",
      icon: Zap,
      recommended: false,
      category: "Reasoning"
    },
    {
      id: "usePersona" as keyof OptimizationOptions,
      name: "Expert Persona",
      description: "Add professional expertise and domain knowledge",
      icon: Users,
      recommended: true,
      category: "Context"
    },
    {
      id: "useRolePlay" as keyof OptimizationOptions,
      name: "Role Playing",
      description: "Simulate expert roles for specialized responses",
      icon: UserCheck,
      recommended: false,
      category: "Context"
    },
    {
      id: "useFewShot" as keyof OptimizationOptions,
      name: "Few-Shot Examples",
      description: "Include relevant examples to guide response format",
      icon: Target,
      recommended: false,
      category: "Context"
    },
    {
      id: "useContextPrompting" as keyof OptimizationOptions,
      name: "Context Prompting",
      description: "Add structured context and background information",
      icon: Target,
      recommended: true,
      category: "Context"
    },
    {
      id: "useEmotionalPrompting" as keyof OptimizationOptions,
      name: "Emotional Intelligence",
      description: "Apply appropriate emotional tone and language",
      icon: Users,
      recommended: false,
      category: "Context"
    },
    {
      id: "useConstraints" as keyof OptimizationOptions,
      name: "Advanced Constraints",
      description: "Add specific guidelines and quality requirements",
      icon: Shield,
      recommended: true,
      category: "Structure"
    },
    {
      id: "optimizeForTokens" as keyof OptimizationOptions,
      name: "Token Optimization",
      description: "Reduce unnecessary words while maintaining clarity",
      icon: Minimize,
      recommended: false,
      category: "Efficiency"
    }
  ];

  const categories = ["Reasoning", "Context", "Structure", "Efficiency"];
  const enabledCount = Object.values(options).filter(Boolean).length;

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl text-gray-800">
          <Sparkles className="w-6 h-6 text-blue-600" />
          Optimization Techniques
        </CardTitle>
        <CardDescription>
          Select techniques to enhance your prompt for better AI responses
          <Badge variant="outline" className="ml-2">
            {enabledCount} selected
          </Badge>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {categories.map((category) => (
          <div key={category}>
            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
              {category === "Reasoning" && <Brain className="w-5 h-5" />}
              {category === "Context" && <Users className="w-5 h-5" />}
              {category === "Structure" && <Shield className="w-5 h-5" />}
              {category === "Efficiency" && <Minimize className="w-5 h-5" />}
              {category}
            </h3>
            
            <div className="grid gap-3">
              {optimizationTechniques
                .filter(technique => technique.category === category)
                .map((technique) => (
                  <div
                    key={technique.id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                      options[technique.id] 
                        ? 'border-blue-300 bg-blue-50' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3 flex-1">
                      <technique.icon className={`w-5 h-5 mt-0.5 ${
                        options[technique.id] ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Label className="font-medium text-gray-900">
                            {technique.name}
                          </Label>
                          {technique.recommended && (
                            <Badge variant="secondary" className="text-xs">
                              Recommended
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {technique.description}
                        </p>
                      </div>
                    </div>
                    
                    <Switch
                      checked={options[technique.id]}
                      onCheckedChange={(checked) => updateOption(technique.id, checked)}
                    />
                  </div>
                ))}
            </div>
            
            {category !== "Efficiency" && <Separator className="my-4" />}
          </div>
        ))}
        
        <div className="pt-4">
          <Button 
            onClick={onOptimize}
            disabled={isOptimizing}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
            size="lg"
          >
            {isOptimizing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Optimizing Prompt...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Optimized Prompt
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
