
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Zap, Target, Cpu, Settings, TrendingUp, TreePine, Users, GitBranch } from "lucide-react";
import { OptimizationOptions, PromptAnalysis } from "@/utils/promptEngineering";

interface AdvancedOptimizerProps {
  analysis: PromptAnalysis | null;
  options: OptimizationOptions;
  onOptionsChange: (options: OptimizationOptions) => void;
  onOptimize: () => void;
  isOptimizing: boolean;
}

export const AdvancedOptimizer = ({ 
  analysis, 
  options, 
  onOptionsChange, 
  onOptimize, 
  isOptimizing 
}: AdvancedOptimizerProps) => {
  const [activeTab, setActiveTab] = useState("techniques");

  const updateOption = (key: keyof OptimizationOptions, value: boolean) => {
    onOptionsChange({ ...options, [key]: value });
  };

  const getIntentColor = (intent: string) => {
    const colors = {
      creative: "bg-purple-100 text-purple-800",
      analytical: "bg-blue-100 text-blue-800",
      informational: "bg-green-100 text-green-800",
      problem_solving: "bg-orange-100 text-orange-800",
      code: "bg-gray-100 text-gray-800",
      conversation: "bg-pink-100 text-pink-800",
      educational: "bg-indigo-100 text-indigo-800",
      research: "bg-teal-100 text-teal-800"
    };
    return colors[intent as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getComplexityColor = (complexity: string) => {
    const colors = {
      simple: "bg-green-100 text-green-800",
      moderate: "bg-yellow-100 text-yellow-800",
      complex: "bg-orange-100 text-orange-800",
      expert: "bg-red-100 text-red-800"
    };
    return colors[complexity as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-blue-600" />
          <span>Advanced Optimization Engine</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
            <TabsTrigger value="techniques">Techniques</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="space-y-4">
            {analysis ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Intent</Label>
                    <Badge className={getIntentColor(analysis.intent)}>
                      {analysis.intent.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Complexity</Label>
                    <Badge className={getComplexityColor(analysis.complexity)}>
                      {analysis.complexity}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Domain</Label>
                    <Badge variant="outline">{analysis.domain}</Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Confidence</Label>
                    <Badge variant="secondary">{analysis.confidence}%</Badge>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Estimated Tokens</Label>
                  <p className="text-sm text-gray-600">{analysis.estimatedTokens}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">AI Suggested Techniques</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {analysis.suggestedTechniques.map((technique, index) => (
                      <Badge key={index} variant="secondary">
                        {technique.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Enter a prompt to see AI analysis
              </p>
            )}
          </TabsContent>

          <TabsContent value="techniques" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-gray-700">Reasoning Techniques</h4>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-4 h-4" />
                    <Label>Chain of Thought</Label>
                  </div>
                  <Switch
                    checked={options.useChainOfThought}
                    onCheckedChange={(checked) => updateOption('useChainOfThought', checked)}
                  />
                </div>
                <p className="text-xs text-gray-500 ml-6">
                  Breaks down complex problems into step-by-step reasoning
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TreePine className="w-4 h-4" />
                    <Label>Tree of Thoughts</Label>
                  </div>
                  <Switch
                    checked={options.useTreeOfThoughts}
                    onCheckedChange={(checked) => updateOption('useTreeOfThoughts', checked)}
                  />
                </div>
                <p className="text-xs text-gray-500 ml-6">
                  Explores multiple reasoning paths for complex problems
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <GitBranch className="w-4 h-4" />
                    <Label>Self Consistency</Label>
                  </div>
                  <Switch
                    checked={options.useSelfConsistency}
                    onCheckedChange={(checked) => updateOption('useSelfConsistency', checked)}
                  />
                </div>
                <p className="text-xs text-gray-500 ml-6">
                  Generates multiple reasoning paths and synthesizes results
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4" />
                    <Label>ReAct Pattern</Label>
                  </div>
                  <Switch
                    checked={options.useReAct}
                    onCheckedChange={(checked) => updateOption('useReAct', checked)}
                  />
                </div>
                <p className="text-xs text-gray-500 ml-6">
                  Combines reasoning and action for problem-solving tasks
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-sm text-gray-700">Role & Context Techniques</h4>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Cpu className="w-4 h-4" />
                    <Label>Enhanced Persona</Label>
                  </div>
                  <Switch
                    checked={options.usePersona}
                    onCheckedChange={(checked) => updateOption('usePersona', checked)}
                  />
                </div>
                <p className="text-xs text-gray-500 ml-6">
                  Assigns expert personas based on domain expertise
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <Label>Role Playing</Label>
                  </div>
                  <Switch
                    checked={options.useRolePlay}
                    onCheckedChange={(checked) => updateOption('useRolePlay', checked)}
                  />
                </div>
                <p className="text-xs text-gray-500 ml-6">
                  Fully embodies domain-specific professional roles
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4" />
                    <Label>Few-Shot Learning</Label>
                  </div>
                  <Switch
                    checked={options.useFewShot}
                    onCheckedChange={(checked) => updateOption('useFewShot', checked)}
                  />
                </div>
                <p className="text-xs text-gray-500 ml-6">
                  Provides domain-specific examples to guide responses
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <Label>Advanced Constraints</Label>
                  </div>
                  <Switch
                    checked={options.useConstraints}
                    onCheckedChange={(checked) => updateOption('useConstraints', checked)}
                  />
                </div>
                <p className="text-xs text-gray-500 ml-6">
                  Adds domain-specific guidelines and requirements
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <Label>Token Optimization</Label>
                </div>
                <Switch
                  checked={options.optimizeForTokens}
                  onCheckedChange={(checked) => updateOption('optimizeForTokens', checked)}
                />
              </div>
              <p className="text-xs text-gray-500">
                Reduces unnecessary words to minimize token usage
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <Button
          onClick={onOptimize}
          disabled={isOptimizing}
          className="w-full mt-6"
        >
          {isOptimizing ? "Optimizing..." : "Apply Advanced Optimization"}
        </Button>
      </CardContent>
    </Card>
  );
};
