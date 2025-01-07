import { Button } from "@/components/ui/button";

interface SuggestionItemProps {
  suggestion: string;
  onApply: (suggestion: string) => void;
}

export const SuggestionItem = ({ suggestion, onApply }: SuggestionItemProps) => {
  const parts = suggestion.split(/:|—/);
  const title = parts[0].trim();
  const content = parts.slice(1).join(':').trim();

  return (
    <div className="p-4 border rounded-lg space-y-2">
      <h4 className="font-medium">{title}</h4>
      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{content}</p>
      <Button 
        size="sm" 
        variant="default"
        onClick={() => onApply(suggestion)}
        className="w-full mt-2"
      >
        Apply Change
      </Button>
    </div>
  );
};