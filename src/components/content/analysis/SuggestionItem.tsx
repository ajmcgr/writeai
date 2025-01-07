import { Button } from "@/components/ui/button";

interface SuggestionItemProps {
  suggestion: string;
  onApply: (suggestion: string) => void;
}

export const SuggestionItem = ({ suggestion, onApply }: SuggestionItemProps) => {
  return (
    <div className="p-4 border rounded-lg space-y-2">
      <p className="whitespace-pre-wrap text-sm">{suggestion}</p>
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