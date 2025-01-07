import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";

interface SuggestionItemProps {
  suggestion: string;
  onApply: (suggestion: string) => void;
}

export const SuggestionItem = ({ suggestion }: SuggestionItemProps) => {
  const { toast } = useToast();
  const parts = suggestion.split(/:|—/);
  const title = parts[0].trim();
  const content = parts.slice(1).join(':').trim();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Success",
        description: "Suggestion copied to clipboard",
      });
    } catch (error) {
      console.error("Failed to copy text:", error);
      toast({
        title: "Error",
        description: "Failed to copy text to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 border rounded-lg space-y-2">
      <h4 className="font-medium">{title}</h4>
      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{content}</p>
      <Button 
        size="sm" 
        variant="default"
        onClick={handleCopy}
        className="w-full mt-2"
      >
        <Copy className="mr-2 h-4 w-4" />
        Copy Text
      </Button>
    </div>
  );
};