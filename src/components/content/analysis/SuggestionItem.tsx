import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";

interface Suggestion {
  original: string;
  improved: string;
}

interface SuggestionItemProps {
  suggestion: Suggestion;
  onApply: (suggestion: Suggestion) => void;
}

export const SuggestionItem = ({ suggestion, onApply }: SuggestionItemProps) => {
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(suggestion.improved);
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
      <div className="space-y-2">
        <h4 className="font-medium text-sm text-muted-foreground">Original Text:</h4>
        <p className="text-sm">{suggestion.original}</p>
      </div>
      <div className="space-y-2">
        <h4 className="font-medium text-sm text-muted-foreground">Improved Version:</h4>
        <p className="text-sm">{suggestion.improved}</p>
      </div>
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