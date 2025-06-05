
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
  'aria-busy'?: boolean;
  'aria-live'?: 'off' | 'assertive' | 'polite' | undefined;
}

export const AdvancedOptimizer = ({ 
  analysis, 
  options, 
  onOptionsChange, 
  onOptimize, 
  isOptimizing,
  'aria-busy': ariaBusy = false,
  'aria-live': ariaLive = 'polite'
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
    <Card 
      className="w-full"
      aria-busy={ariaBusy}
      aria-live={ariaLive}
      aria-atomic="true"
    >
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-blue-600" />
          <span>Advanced Optimization Engine</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          orientation="horizontal"
          activationMode="automatic"
        >
          <TabsList 
            className="grid w-full grid-cols-3"
            aria-label="Optimization settings sections"
          >
            <TabsTrigger 
              value="analysis"
              aria-controls="analysis-content"
              id="analysis-tab"
            >
              AI Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="techniques"
              aria-controls="techniques-content"
              id="techniques-tab"
            >
              Techniques
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              aria-controls="settings-content"
              id="settings-tab"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent 
            value="analysis" 
            id="analysis-content"
            role="tabpanel"
            aria-labelledby="analysis-tab"
            className="space-y-4"
            tabIndex={0}
          >
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

          <TabsContent 
            value="techniques" 
            id="techniques-content"
            role="tabpanel"
            aria-labelledby="techniques-tab"
            className="space-y-4"
            tabIndex={0}
          >
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-gray-700">Reasoning Techniques</h4>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-4 h-4" />
                    <Label id="chain-of-thought-label" htmlFor="chain-of-thought">Chain of Thought</Label>
                  </div>
                  <Switch
                    id="chain-of-thought"
                    checked={options.useChainOfThought}
                    onCheckedChange={(checked) => updateOption('useChainOfThought', checked)}
                    aria-labelledby="chain-of-thought-label"
                  />
                </div>
                <p className="text-xs text-gray-500 ml-6">
                  Breaks down complex problems into step-by-step reasoning
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TreePine className="w-4 h-4" />
                    <Label id="tree-of-thoughts-label" htmlFor="tree-of-thoughts">Tree of Thoughts</Label>
                  </div>
                  <Switch
                    id="tree-of-thoughts"
                    checked={options.useTreeOfThoughts}
                    onCheckedChange={(checked) => updateOption('useTreeOfThoughts', checked)}
                    aria-labelledby="tree-of-thoughts-label"
                  />
                </div>
                <p className="text-xs text-gray-500 ml-6">
                  Explores multiple reasoning paths for complex problems
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <GitBranch className="w-4 h-4" />
                    <Label id="self-consistency-label" htmlFor="self-consistency">Self Consistency</Label>
                  </div>
                  <Switch
                    id="self-consistency"
                    checked={options.useSelfConsistency}
                    onCheckedChange={(checked) => updateOption('useSelfConsistency', checked)}
                    aria-labelledby="self-consistency-label"
                  />
                </div>
                <p className="text-xs text-gray-500 ml-6">
                  Generates multiple reasoning paths and synthesizes results
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4" />
                    <Label id="react-pattern-label" htmlFor="react-pattern">ReAct Pattern</Label>
                  </div>
                  <Switch
                    id="react-pattern"
                    checked={options.useReAct}
                    onCheckedChange={(checked) => updateOption('useReAct', checked)}
                    aria-labelledby="react-pattern-label"
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
                    <Label id="enhanced-persona-label" htmlFor="enhanced-persona">Enhanced Persona</Label>
                  </div>
                  <Switch
                    id="enhanced-persona"
                    checked={options.usePersona}
                    onCheckedChange={(checked) => updateOption('usePersona', checked)}
                    aria-labelledby="enhanced-persona-label"
                  />
                </div>
                <p className="text-xs text-gray-500 ml-6">
                  Assigns expert personas based on domain expertise
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <Label id="role-playing-label" htmlFor="role-playing">Role Playing</Label>
                  </div>
                  <Switch
                    id="role-playing"
                    checked={options.useRolePlay}
                    onCheckedChange={(checked) => updateOption('useRolePlay', checked)}
                    aria-labelledby="role-playing-label"
                  />
                </div>
                <p className="text-xs text-gray-500 ml-6">
                  Fully embodies domain-specific professional roles
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4" />
                    <Label id="few-shot-label" htmlFor="few-shot">Few-Shot Learning</Label>
                  </div>
                  <Switch
                    id="few-shot"
                    checked={options.useFewShot}
                    onCheckedChange={(checked) => updateOption('useFewShot', checked)}
                    aria-labelledby="few-shot-label"
                  />
                </div>
                <p className="text-xs text-gray-500 ml-6">
                  Provides domain-specific examples to guide responses
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <Label id="advanced-constraints-label" htmlFor="advanced-constraints">Advanced Constraints</Label>
                  </div>
                  <Switch
                    id="advanced-constraints"
                    checked={options.useConstraints}
                    onCheckedChange={(checked) => updateOption('useConstraints', checked)}
                    aria-labelledby="advanced-constraints-label"
                  />
                </div>
                <p className="text-xs text-gray-500 ml-6">
                  Adds domain-specific guidelines and requirements
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent 
            value="settings" 
            id="settings-content"
            role="tabpanel"
            aria-labelledby="settings-tab"
            className="space-y-4"
            tabIndex={0}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <Label id="token-optimization-label" htmlFor="token-optimization">Token Optimization</Label>
                </div>
                <Switch
                  id="token-optimization"
                  checked={options.optimizeForTokens}
                  onCheckedChange={(checked) => updateOption('optimizeForTokens', checked)}
                  aria-labelledby="token-optimization-label"
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
          aria-busy={isOptimizing}
          aria-live={isOptimizing ? "polite" : undefined}
        >
          {isOptimizing ? (
            <>
              <span className="sr-only">Optimization in progress, please wait</span>
              <span aria-hidden="true">Optimizing...</span>
            </>
          ) : (
            <span>Apply Advanced Optimization</span>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
