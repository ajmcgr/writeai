import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AnalysisSidebarProps {
  analysis: string | null;
  onApply?: (suggestion: string) => void;
}

export const AnalysisSidebar = ({ analysis, onApply }: AnalysisSidebarProps) => {
  if (!analysis) return null;

  // Split analysis into separate suggestions
  const suggestions = analysis.split('\n\n').filter(Boolean);

  return (
    <div className="w-80 border-l border-border bg-background p-4">
      <h3 className="text-lg font-semibold mb-4">AI Analysis</h3>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-4 pr-4">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-2">
              <p className="whitespace-pre-wrap text-sm">{suggestion}</p>
              {onApply && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => onApply(suggestion)}
                  className="w-full mt-2"
                >
                  Apply Suggestion
                </Button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};