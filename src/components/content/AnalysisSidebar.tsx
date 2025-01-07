import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AnalysisSidebarProps {
  analysis: string | null;
  onApply?: (suggestion: string) => void;
  content: string;
}

export const AnalysisSidebar = ({ analysis, onApply, content }: AnalysisSidebarProps) => {
  if (!analysis) return null;

  console.log('Raw analysis:', analysis); // Debug log

  // Split analysis into separate suggestions, handling both \n\n and single \n
  const suggestions = analysis
    .split(/\n{2,}|\n/)
    .map(s => s.trim())
    .filter(Boolean);

  console.log('Parsed suggestions:', suggestions); // Debug log

  const handleApplySuggestion = (suggestion: string) => {
    if (!onApply) return;
    
    // Get the editor element
    const editor = document.querySelector('[contenteditable="true"]') as HTMLElement;
    if (!editor) {
      console.error('Editor element not found');
      return;
    }

    // Format suggestion into paragraphs with proper HTML
    const formattedSuggestion = suggestion
      .split('\n')
      .map(para => para.trim())
      .filter(Boolean)
      .map(para => `<p>${para}</p>`)
      .join('');

    console.log('Formatted suggestion:', formattedSuggestion); // Debug log

    // Create a temporary container
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = formattedSuggestion;

    // Get or create selection at the end of editor content
    const selection = window.getSelection();
    const range = document.createRange();
    
    // Find the last child element or create one if empty
    let lastChild = editor.lastElementChild;
    if (!lastChild) {
      const p = document.createElement('p');
      p.innerHTML = '<br>';
      editor.appendChild(p);
      lastChild = p;
    }

    // Set range to end of last element
    range.setStartAfter(lastChild);
    range.setEndAfter(lastChild);

    // Clear any existing selection
    selection?.removeAllRanges();
    selection?.addRange(range);

    // Insert each paragraph with proper spacing
    const fragments = Array.from(tempDiv.children);
    fragments.forEach((fragment, index) => {
      // Add a line break before new content if there's existing content
      if (index === 0 && editor.innerHTML.trim() !== '') {
        const br = document.createElement('br');
        range.insertNode(br);
        range.setStartAfter(br);
        range.setEndAfter(br);
      }

      // Insert the paragraph
      range.insertNode(fragment);
      
      // Move range to after the inserted node
      range.setStartAfter(fragment);
      range.setEndAfter(fragment);

      // Add a line break between paragraphs
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
          {suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
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
            ))
          ) : (
            <div className="text-center text-muted-foreground">
              No suggestions available
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};