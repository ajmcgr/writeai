import { Button } from "@/components/ui/button";
import { Wand2, RefreshCw, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

interface AIActionsProps {
  content: string;
  onContentGenerated: (content: string) => void;
  onAnalysis: (analysis: string) => void;
}

export const AIActions = ({ content, onContentGenerated, onAnalysis }: AIActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateContent = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke("generate-content", {
        body: { type: "generate" }
      });

      if (error) throw error;
      onContentGenerated(data.generatedText);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const rewriteContent = async () => {
    if (!content) {
      toast({
        title: "No content",
        description: "Please enter some content to rewrite.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke("generate-content", {
        body: { type: "rewrite", content }
      });

      if (error) throw error;
      onContentGenerated(data.generatedText);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to rewrite content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeContent = async () => {
    if (!content) {
      toast({
        title: "No content",
        description: "Please enter some content to analyze.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke("analyze-content", {
        body: { content }
      });

      if (error) throw error;
      onAnalysis(data.analysis);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to analyze content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex space-x-2">
      <Button
        onClick={generateContent}
        disabled={isLoading}
        className="flex items-center h-8 px-3 text-sm"
      >
        <Wand2 className="mr-1.5 h-3.5 w-3.5" />
        AI Generate
      </Button>
      <Button
        onClick={rewriteContent}
        disabled={isLoading || !content}
        className="flex items-center h-8 px-3 text-sm"
      >
        <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
        AI Re-write
      </Button>
      <Button
        onClick={analyzeContent}
        disabled={isLoading || !content}
        className="flex items-center h-8 px-3 text-sm"
      >
        <Search className="mr-1.5 h-3.5 w-3.5" />
        AI Analyze
      </Button>
    </div>
  );
};