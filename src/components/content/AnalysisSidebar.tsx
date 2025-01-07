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
      console.error('Editor element not found');
      return;
    }

    // Get current selection
    const selection = window.getSelection();
    const range = selection?.rangeCount ? selection.getRangeAt(0) : document.createRange();

    // If no selection, move to the end of the editor
    if (!selection?.rangeCount) {
      range.selectNodeContents(editor);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }

    // Format suggestion into paragraphs with proper HTML
    const formattedSuggestion = suggestion
      .split('\n')
      .map(para => para.trim())
      .filter(Boolean)
      .map(para => `<p>${para}</p>`)
      .join('');

    // Create a temporary container and insert the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = formattedSuggestion;

    // Insert each paragraph with proper spacing
    const fragments = Array.from(tempDiv.children);
    fragments.forEach((fragment, index) => {
      // Insert the paragraph
      range.insertNode(fragment);
      
      // Move range to after the inserted node
      range.setStartAfter(fragment);
      range.setEndAfter(fragment);

      // Add a line break after each paragraph except the last one
      if (index < fragments.length - 1) {
        const br = document.createElement('br');
        range.insertNode(br);
        range.setStartAfter(br);
        range.setEndAfter(br);
      }
    });

    // Update selection to end of inserted content
    selection?.removeAllRanges();
    selection?.addRange(range);

    // Trigger input event to update content state
    const inputEvent = new Event('input', { bubbles: true });
    editor.dispatchEvent(inputEvent);

    console.log('Content inserted successfully');
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