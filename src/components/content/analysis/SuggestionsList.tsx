import { ScrollArea } from "@/components/ui/scroll-area";
import { SuggestionItem } from "./SuggestionItem";

interface SuggestionsListProps {
  suggestions: string[];
  onApply: (suggestion: string) => void;
}

export const SuggestionsList = ({ suggestions, onApply }: SuggestionsListProps) => {
  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="space-y-4 pr-4">
        {suggestions.length > 0 ? (
          suggestions.map((suggestion, index) => (
            <SuggestionItem
              key={index}
              suggestion={suggestion}
              onApply={onApply}
            />
          ))
        ) : (
          <div className="text-center text-muted-foreground">
            No suggestions available
          </div>
        )}
      </div>
    </ScrollArea>
  );
};