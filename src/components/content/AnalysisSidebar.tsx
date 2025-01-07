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
    
    // Get the editor element
    const editor = document.querySelector('[contenteditable]') as HTMLElement;
    if (!editor) {
      // Fallback: append to existing content if editor not found
      onApply(content + '\n\n' + suggestion);
      return;
    }

    // Get current selection or create a new one at the end
    const selection = window.getSelection();
    const range = selection?.rangeCount ? selection.getRangeAt(0) : document.createRange();
    
    if (!selection?.rangeCount) {
      range.selectNodeContents(editor);
      range.collapse(false); // Move to end
      selection?.removeAllRanges();
      selection?.addRange(range);
    }

    // Format the suggestion with proper paragraph tags
    const formattedSuggestion = suggestion
      .split('\n')
      .map(para => para.trim())
      .filter(Boolean)
      .map(para => `<p>${para}</p>`)
      .join('');

    // Create a temporary container
    const container = document.createElement('div');
    container.innerHTML = formattedSuggestion;

    // Insert each paragraph
    while (container.firstChild) {
      range.insertNode(container.firstChild);
      range.collapse(false);
    }

    // Ensure a line break after the insertion
    const br = document.createElement('br');
    range.insertNode(br);
    range.collapse(false);

    // Update selection
    selection?.removeAllRanges();
    selection?.addRange(range);

    // Trigger input event to ensure content state is updated
    const event = new Event('input', { bubbles: true });
    editor.dispatchEvent(event);
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