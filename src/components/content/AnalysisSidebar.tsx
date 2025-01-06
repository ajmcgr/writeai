import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AnalysisSidebarProps {
  analysis: string | null;
  onApply?: (suggestion: string) => void;
  content: string;
}

export const AnalysisSidebar = ({ analysis, onApply, content }: AnalysisSidebarProps) => {
  if (!analysis) return null;

  // Split analysis into separate suggestions
  const suggestions = analysis.split('\n\n').filter(Boolean);

  const handleApplySuggestion = (suggestion: string) => {
    if (!onApply) return;
    
    // Format the suggestion as rich text
    const formattedSuggestion = `<p>${suggestion.replace(/\n/g, '</p><p>')}</p>`;
    
    // Insert the suggestion at the cursor position or at the end
    const textarea = document.querySelector('[contenteditable]') as HTMLElement;
    if (textarea) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = formattedSuggestion;
        
        while (tempDiv.firstChild) {
          range.insertNode(tempDiv.firstChild);
        }
        range.collapse(false);
      } else {
        textarea.innerHTML += formattedSuggestion;
      }
    } else {
      // Fallback: append to the end if contenteditable not found
      onApply(content + formattedSuggestion);
    }
  };

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
                  onClick={() => handleApplySuggestion(suggestion)}
                  className="w-full mt-2"
                >
                  Insert Suggestion
                </Button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};