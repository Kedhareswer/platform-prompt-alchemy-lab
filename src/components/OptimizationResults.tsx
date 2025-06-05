
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Download, Zap, Info, CheckCircle, AlertCircle, Lightbulb, FileText, BarChart, Code, MessageSquare, BookOpen, Search, Clock, Hash, Sparkles, TrendingUp } from "lucide-react";
import { OptimizationResult } from "@/utils/promptOptimizer";
import { useToast } from "@/hooks/use-toast";

// Define local types since they're not exported from promptOptimizer
interface PromptAnalysis {
  complexity: string;
  intent: string;
  domain: string;
  estimatedResponseTime?: number;
  strengths?: string[];
  weaknesses?: string[];
}

interface SystemPrompt {
  name: string;
  description: string;
  platform: string;
  version: string;
  tags?: string[];
}

interface EnhancedOptimizationResult extends Omit<OptimizationResult, 'analysis' | 'systemPrompt'> {
  analysis: PromptAnalysis;
  systemPrompt?: SystemPrompt;
}

// Helper function to get technique description
const getTechniqueDescription = (technique: string): string => {
  const descriptions: Record<string, string> = {
    'Chain of Thought': 'Breaks down reasoning into clear, logical steps',
    'Tree of Thoughts': 'Explores multiple reasoning paths for better solutions',
    'Self-Consistency': 'Generates multiple responses and selects the most consistent one',
    'Persona Injection': 'Adds specific role or expertise to guide the response',
    'Role Play': 'Simulates a specific character or expert perspective',
    'Few-Shot Learning': 'Includes examples to demonstrate desired output format',
    'ReAct Pattern': 'Combines reasoning and action for better task completion',
    'Token Optimization': 'Reduces token usage while maintaining clarity',
    'Structured Output': 'Formats the output in a specific structure',
  };
  return descriptions[technique] || 'Improves prompt effectiveness';
};
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface OptimizationResultsProps {
  result: EnhancedOptimizationResult | null;
  isOptimizing?: boolean;
  onCopy?: (text: string) => void;
  onDownload?: (text: string) => void;
}

export const OptimizationResults = ({ result, isOptimizing = false }: OptimizationResultsProps) => {
  const { toast } = useToast();

  if (isOptimizing) {
    return (
      <Card className="w-full h-64 flex items-center justify-center" aria-live="polite" aria-busy="true">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" role="status">
            <span className="sr-only">Optimizing prompt...</span>
          </div>
          <p className="text-gray-600">Optimizing your prompt...</p>
        </div>
      </Card>
    );
  }

  if (!result) return null;

  // Type assertions for analysis and systemPrompt
  const analysis = result.analysis as PromptAnalysis;
  const systemPrompt = result.systemPrompt as SystemPrompt | undefined;

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(result.optimizedPrompt);
      toast({
        title: "Copied!",
        description: "Optimized prompt copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([result.optimizedPrompt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `optimized-prompt-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getImprovementColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 55) return "text-yellow-600";
    return "text-gray-600";
  };

  // Calculate token savings percentage
  const tokenSavings = Math.max(0, result.tokenCount.original - result.tokenCount.optimized);
  const tokenSavingsPercentage = result.tokenCount.original > 0 
    ? Math.round((tokenSavings / result.tokenCount.original) * 100) 
    : 0;

  // Get optimization level based on improvement score
  const getOptimizationLevel = (score: number) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Moderate';
    return 'Basic';
  };

  // Get intent icon based on analysis
  const getIntentIcon = (intent: string) => {
    switch (intent) {
      case 'creative':
        return <FileText className="w-4 h-4" />;
      case 'analytical':
        return <BarChart className="w-4 h-4" />;
      case 'code':
        return <Code className="w-4 h-4" />;
      case 'conversation':
        return <MessageSquare className="w-4 h-4" />;
      case 'educational':
        return <BookOpen className="w-4 h-4" />;
      case 'research':
        return <Search className="w-4 h-4" />;
      default:
        return <Lightbulb className="w-4 h-4" />;
    }
  };

  return (
    <Card className="w-full" aria-live="polite">
      <CardHeader className="pb-4">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">Optimization Results</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Analysis of your prompt's optimization
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCopy}
                className="gap-1.5"
                aria-label="Copy optimized prompt to clipboard"
              >
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownload}
                className="gap-1.5"
                aria-label="Download optimized prompt"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </Button>
            </div>
          </div>
          
          {/* Optimization Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-3 rounded-lg bg-muted/50 border">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-muted-foreground">Optimization Level</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-3.5 h-3.5 text-muted-foreground/70" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[250px]">
                      <p>How effectively your prompt has been optimized based on best practices.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{getOptimizationLevel(result.estimatedImprovement)}</span>
                  <Badge variant="outline" className={cn(
                    "px-2 py-0.5 text-xs",
                    result.estimatedImprovement >= 75 ? "bg-green-50 text-green-700 border-green-200" :
                    result.estimatedImprovement >= 50 ? "bg-blue-50 text-blue-700 border-blue-200" :
                    "bg-yellow-50 text-yellow-700 border-yellow-200"
                  )}>
                    {result.estimatedImprovement}%
                  </Badge>
                </div>
                <div className={cn(
                  "p-1.5 rounded-full",
                  result.estimatedImprovement >= 75 ? "bg-green-100 text-green-600" :
                  result.estimatedImprovement >= 50 ? "bg-blue-100 text-blue-600" :
                  "bg-yellow-100 text-yellow-600"
                )}>
                  {result.estimatedImprovement >= 75 ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                </div>
              </div>
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Optimization Progress</span>
                  <span>{result.estimatedImprovement}%</span>
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div 
                    className={cn(
                      "h-full",
                      result.estimatedImprovement >= 75 ? "bg-green-500" :
                      result.estimatedImprovement >= 50 ? "bg-blue-500" : "bg-yellow-500"
                    )}
                    style={{ width: `${result.estimatedImprovement}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-muted/50 border">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-muted-foreground">Token Efficiency</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-3.5 h-3.5 text-muted-foreground/70" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[250px]">
                      <p>How efficiently your prompt uses tokens to convey information.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold">{result.tokenCount.optimized}</span>
                  <span className="text-sm text-muted-foreground mb-0.5">tokens</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  {tokenSavings > 0 ? (
                    <>
                      <span className="text-green-600 font-medium">-{tokenSavingsPercentage}%</span>
                      <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                    </>
                  ) : tokenSavings < 0 ? (
                    <span className="text-yellow-600">+{Math.abs(tokenSavingsPercentage)}% more</span>
                  ) : (
                    <span className="text-muted-foreground">No change</span>
                  )}
                </div>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Original</span>
                  <span>{result.tokenCount.original} tokens</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Optimized</span>
                  <span className="font-medium">{result.tokenCount.optimized} tokens</span>
                </div>
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-muted/50 border">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-muted-foreground">Techniques Applied</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-3.5 h-3.5 text-muted-foreground/70" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[250px]">
                      <p>Optimization techniques that were applied to improve your prompt.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold">{result.appliedTechniques.length}</span>
                  <span className="text-sm text-muted-foreground mb-0.5">techniques</span>
                </div>
                <div className="p-1.5 rounded-full bg-primary/10 text-primary">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="flex flex-wrap gap-1.5">
                  {result.appliedTechniques.slice(0, 3).map((tech, i) => (
                    <Badge key={i} variant="secondary" className="text-xs font-normal">
                      {tech}
                    </Badge>
                  ))}
                  {result.appliedTechniques.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{result.appliedTechniques.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Prompt Analysis Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              <span>Prompt Analysis</span>
            </h3>
            <Badge variant="outline" className="text-sm font-normal">
              {analysis.complexity.charAt(0).toUpperCase() + analysis.complexity.slice(1)} Complexity
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-2 text-sm font-medium mb-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>Response Time</span>
              </div>
              <div className="text-2xl font-bold">
                {analysis.estimatedResponseTime}s
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Estimated time for model to process
              </div>
            </div>
            
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-2 text-sm font-medium mb-2">
                <Hash className="w-4 h-4 text-muted-foreground" />
                <span>Token Usage</span>
              </div>
              <div className="text-2xl font-bold">
                {result.tokenCount.optimized} tokens
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                ~{Math.ceil(result.tokenCount.optimized * 0.75)} words
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="p-3 rounded-lg border border-green-100 bg-green-50">
              <h4 className="text-sm font-medium text-green-800 flex items-center gap-1.5 mb-2">
                <CheckCircle className="w-4 h-4" />
                <span>Strengths</span>
              </h4>
              <ul className="space-y-1.5 text-sm text-green-700">
                {analysis.strengths?.map((strength, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
                    <span>{strength}</span>
                  </li>
                )) || (
                  <li className="text-muted-foreground text-sm">No specific strengths identified</li>
                )}
              </ul>
            </div>
            
            <div className="p-3 rounded-lg border border-amber-100 bg-amber-50">
              <h4 className="text-sm font-medium text-amber-800 flex items-center gap-1.5 mb-2">
                <AlertCircle className="w-4 h-4" />
                <span>Areas for Improvement</span>
              </h4>
              <ul className="space-y-1.5 text-sm text-amber-700">
                {analysis.weaknesses?.map((weakness, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></div>
                    <span>{weakness}</span>
                  </li>
                )) || (
                  <li className="text-muted-foreground text-sm">No major improvements needed</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Applied Techniques */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Applied Optimization Techniques</h3>
            <Badge variant="outline" className="text-sm font-normal">
              {result.appliedTechniques.length} techniques applied
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.appliedTechniques.map((technique, index) => (
              <div key={index} className="p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-md bg-primary/10 text-primary mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{technique}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {getTechniqueDescription(technique)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Prompt Integration */}
        {result.systemPrompt && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">System Prompt Integration</h3>
            <div className="p-4 border rounded-lg bg-card">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-md bg-blue-100 text-blue-600 mt-0.5">
                  <Code className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{systemPrompt.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {systemPrompt.platform} v{systemPrompt.version}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {systemPrompt.description}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {systemPrompt?.tags?.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Optimized Prompt */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Optimized Prompt</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {result.optimizedPrompt.split(' ').length} words • {result.optimizedPrompt.length} characters
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={handleCopy}
                aria-label="Copy optimized prompt"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <Textarea
              value={result.optimizedPrompt}
              readOnly
              className="min-h-[200px] resize-none font-mono text-sm"
              aria-label="Optimized prompt"
              onFocus={(e) => e.target.select()}
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 gap-1.5"
                onClick={handleDownload}
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download</span>
              </Button>
            </div>
            <div className="sr-only" aria-live="polite">
              Optimized prompt ready. {result.optimizedPrompt.split(' ').length} words, approximately {Math.ceil(result.optimizedPrompt.length / 5)} characters.
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span>Original:</span>
                <span className="font-medium">{result.tokenCount.original} tokens</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <span>Optimized:</span>
                <span className="font-medium">{result.tokenCount.optimized} tokens</span>
              </div>
            </div>
            {tokenSavings !== 0 && (
              <div className={cn(
                "flex items-center gap-1 font-medium",
                tokenSavings > 0 ? 'text-green-600' : 'text-yellow-600'
              )}>
                {tokenSavings > 0 ? (
                  <>
                    <span>Saved {tokenSavings} tokens ({tokenSavingsPercentage}%)</span>
                    <TrendingUp className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <span>+{Math.abs(tokenSavings)} tokens added for better results</span>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
