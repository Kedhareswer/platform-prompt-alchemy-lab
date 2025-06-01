
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Download, TrendingUp, Zap } from "lucide-react";
import { OptimizationResult } from "@/utils/promptOptimizer";
import { useToast } from "@/hooks/use-toast";

interface OptimizationResultsProps {
  result: OptimizationResult | null;
}

export const OptimizationResults = ({ result }: OptimizationResultsProps) => {
  const { toast } = useToast();

  if (!result) {
    return (
      <Card className="w-full h-64 flex items-center justify-center">
        <p className="text-gray-500">Optimization results will appear here</p>
      </Card>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.optimizedPrompt);
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

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-green-600" />
            <span>Optimization Results</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Optimization Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getImprovementColor(result.estimatedImprovement)}`}>
              {result.estimatedImprovement}%
            </div>
            <div className="text-sm text-gray-500">Improvement Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {result.tokenCount.optimized}
            </div>
            <div className="text-sm text-gray-500">Final Tokens</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {result.appliedTechniques.length}
            </div>
            <div className="text-sm text-gray-500">Techniques Applied</div>
          </div>
        </div>

        {/* Applied Techniques */}
        <div>
          <h4 className="font-medium mb-2">Applied Techniques</h4>
          <div className="flex flex-wrap gap-2">
            {result.appliedTechniques.map((technique, index) => (
              <Badge key={index} variant="secondary">
                {technique}
              </Badge>
            ))}
          </div>
        </div>

        {/* Token Comparison */}
        <div>
          <h4 className="font-medium mb-2">Token Analysis</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Original:</span> {result.tokenCount.original} tokens
            </div>
            <div>
              <span className="text-gray-500">Optimized:</span> {result.tokenCount.optimized} tokens
            </div>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {result.tokenCount.optimized > result.tokenCount.original ? (
              <span className="text-yellow-600">
                +{result.tokenCount.optimized - result.tokenCount.original} tokens (enhanced detail)
              </span>
            ) : (
              <span className="text-green-600">
                -{result.tokenCount.original - result.tokenCount.optimized} tokens saved
              </span>
            )}
          </div>
        </div>

        {/* System Prompt Info */}
        {result.systemPrompt && (
          <div>
            <h4 className="font-medium mb-2">System Prompt Integration</h4>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-sm font-medium">{result.systemPrompt.name}</div>
              <div className="text-xs text-gray-500">{result.systemPrompt.description}</div>
              <Badge variant="outline" className="mt-1">
                {result.systemPrompt.platform} v{result.systemPrompt.version}
              </Badge>
            </div>
          </div>
        )}

        {/* Optimized Prompt */}
        <div>
          <h4 className="font-medium mb-2">Optimized Prompt</h4>
          <Textarea
            value={result.optimizedPrompt}
            readOnly
            className="min-h-[200px] resize-none bg-gray-50"
          />
        </div>
      </CardContent>
    </Card>
  );
};
