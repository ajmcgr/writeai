import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface AIPromptDialogProps {
  onContentGenerated: (content: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AIPromptDialog = ({ onContentGenerated, isOpen, onOpenChange }: AIPromptDialogProps) => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateContent = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke("generate-content", {
        body: { type: "generate", content: prompt }
      });

      if (error) throw error;
      
      onContentGenerated(data.generatedText);
      setPrompt("");
      onOpenChange(false);
      
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Content with AI</DialogTitle>
          <DialogDescription>
            Enter a prompt to generate content for your document.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          className="min-h-[100px]"
        />
        <DialogFooter>
          <Button onClick={handleGenerateContent} disabled={isLoading}>
            {isLoading ? <LoadingSpinner /> : "Generate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};