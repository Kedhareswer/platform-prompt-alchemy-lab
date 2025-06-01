
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Download, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OptimizedOutputProps {
  content: string;
  isLoading: boolean;
  platform: string;
}

export const OptimizedOutput = ({ content, isLoading, platform }: OptimizedOutputProps) => {
  const { toast } = useToast();

  const handleCopy = async () => {
    if (!content) return;
    
    try {
      await navigator.clipboard.writeText(content);
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
    if (!content) return;
    
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `optimized-prompt-${platform}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <span>Optimized Prompt</span>
        </h2>
        
        {content && (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="flex items-center space-x-1"
            >
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex items-center space-x-1"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </Button>
          </div>
        )}
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
          <p className="text-sm text-gray-500 text-center">
            Optimizing your prompt for {platform}...
          </p>
        </div>
      ) : content ? (
        <div className="space-y-4">
          <Textarea
            value={content}
            readOnly
            className="min-h-[300px] resize-none border-gray-300 bg-gray-50"
          />
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{content.length} characters</span>
            <span>Optimized for {platform}</span>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            Your optimized prompt will appear here
          </p>
        </div>
      )}
    </div>
  );
};
