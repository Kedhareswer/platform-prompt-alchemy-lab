
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
  Sparkles,
  Heart
} from "lucide-react";
import { OptimizationOptions } from "@/utils/promptEngineering";
import { OptimizationMode } from "./OptimizationModeSelector";

interface AdvancedOptimizerProps {
  mode: OptimizationMode;
  options: OptimizationOptions;
  onOptionsChange: (options: OptimizationOptions) => void;
  onOptimize: () => void;
  isOptimizing: boolean;
}

export const AdvancedOptimizer = ({
  mode,
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

  const getNormalTechniques = () => [
    {
      id: "useChainOfThought" as keyof OptimizationOptions,
      name: "Chain of Thought",
      description: "Break down complex problems into step-by-step reasoning",
      icon: Brain,
      recommended: true
    },
    {
      id: "useTreeOfThoughts" as keyof OptimizationOptions,
      name: "Tree of Thoughts",
      description: "Explore multiple solution paths for complex problems",
      icon: TreePine,
      recommended: false
    },
    {
      id: "useSelfConsistency" as keyof OptimizationOptions,
      name: "Self Consistency",
      description: "Generate multiple solutions and cross-verify for accuracy",
      icon: CheckCircle,
      recommended: false
    },
    {
      id: "useReAct" as keyof OptimizationOptions,
      name: "ReAct Pattern",
      description: "Combine reasoning and acting for problem-solving tasks",
      icon: Zap,
      recommended: false
    },
    {
      id: "usePersona" as keyof OptimizationOptions,
      name: "Expert Persona",
      description: "Add professional expertise and domain knowledge",
      icon: Users,
      recommended: true
    },
    {
      id: "useConstraints" as keyof OptimizationOptions,
      name: "Advanced Constraints",
      description: "Add specific guidelines and quality requirements",
      icon: Shield,
      recommended: true
    },
    {
      id: "optimizeForTokens" as keyof OptimizationOptions,
      name: "Token Optimization",
      description: "Reduce unnecessary words while maintaining clarity",
      icon: Minimize,
      recommended: false
    }
  ];

  const getContextTechniques = () => [
    {
      id: "useContextPrompting" as keyof OptimizationOptions,
      name: "Situational Context",
      description: "Add current situation and environmental context",
      icon: Target,
      recommended: true
    },
    {
      id: "usePersona" as keyof OptimizationOptions,
      name: "Background Context",
      description: "Include relevant history and previous information",
      icon: Users,
      recommended: true
    },
    {
      id: "useConstraints" as keyof OptimizationOptions,
      name: "Domain Context",
      description: "Add domain-specific requirements and constraints",
      icon: Shield,
      recommended: true
    },
    {
      id: "useFewShot" as keyof OptimizationOptions,
      name: "Audience Context",
      description: "Tailor content for specific target audience",
      icon: UserCheck,
      recommended: false
    },
    {
      id: "useChainOfThought" as keyof OptimizationOptions,
      name: "Temporal Context",
      description: "Add time-sensitive and urgency context",
      icon: Brain,
      recommended: false
    }
  ];

  const getEmotionalTechniques = () => [
    {
      id: "useEmotionalPrompting" as keyof OptimizationOptions,
      name: "Emotional Tone",
      description: "Apply appropriate emotional language and tone",
      icon: Heart,
      recommended: true
    },
    {
      id: "usePersona" as keyof OptimizationOptions,
      name: "Empathy Enhancement",
      description: "Add empathetic understanding and connection",
      icon: Users,
      recommended: true
    },
    {
      id: "useRolePlay" as keyof OptimizationOptions,
      name: "Emotional Role Play",
      description: "Use emotional personas for better engagement",
      icon: UserCheck,
      recommended: false
    },
    {
      id: "useConstraints" as keyof OptimizationOptions,
      name: "Emotional Constraints",
      description: "Balance emotional impact with appropriateness",
      icon: Shield,
      recommended: true
    },
    {
      id: "useFewShot" as keyof OptimizationOptions,
      name: "Emotional Examples",
      description: "Include emotionally resonant examples",
      icon: Target,
      recommended: false
    }
  ];

  const getCurrentTechniques = () => {
    switch (mode) {
      case "context":
        return getContextTechniques();
      case "emotional":
        return getEmotionalTechniques();
      default:
        return getNormalTechniques();
    }
  };

  const getModeTitle = () => {
    switch (mode) {
      case "context":
        return "Context Optimization";
      case "emotional":
        return "Emotional Optimization";
      default:
        return "Normal Optimization";
    }
  };

  const getModeDescription = () => {
    switch (mode) {
      case "context":
        return "Enhance your prompt with rich contextual information";
      case "emotional":
        return "Optimize for emotional intelligence and engagement";
      default:
        return "Apply advanced prompt engineering techniques";
    }
  };

  const techniques = getCurrentTechniques();
  const enabledCount = Object.values(options).filter(Boolean).length;

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl text-gray-800">
          <Sparkles className="w-6 h-6 text-blue-600" />
          {getModeTitle()}
        </CardTitle>
        <CardDescription>
          {getModeDescription()}
          <Badge variant="outline" className="ml-2">
            {enabledCount} selected
          </Badge>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid gap-3">
          {techniques.map((technique) => (
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
                Generate {mode === "normal" ? "Optimized" : mode === "context" ? "Context-Enhanced" : "Emotionally-Optimized"} Prompt
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
