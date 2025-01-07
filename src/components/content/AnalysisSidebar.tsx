import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AnalysisSidebarProps {
  analysis: string | null;
  onApply?: (suggestion: string) => void;
  content: string;
}

export const AnalysisSidebar = ({ analysis, onApply, content }: AnalysisSidebarProps) => {
  if (!analysis) return null;

  console.log('Raw analysis:', analysis);

  // Split analysis into separate suggestions, handling both \n\n and single \n
  const suggestions = analysis
    .split(/\n{2,}|\n/)
    .map(s => s.trim())
    .filter(Boolean);

  console.log('Parsed suggestions:', suggestions);

  const handleApplySuggestion = (suggestion: string) => {
    if (!onApply) return;
    
    // Get the editor element
    const editor = document.querySelector('[contenteditable="true"]') as HTMLElement;
    if (!editor) {
      console.error('Editor element not found');
      return;
    }

    // Extract the actual suggestion text after the colon or dash if present
    const suggestionParts = suggestion.split(/:|—/);
    let suggestionText = suggestion.trim();
    let sectionTitle = null;
    
    if (suggestionParts.length > 1) {
      sectionTitle = suggestionParts[0].trim();
      suggestionText = suggestionParts.slice(1).join(':').trim();
    }

    // Remove any markdown formatting from the suggestion text
    suggestionText = suggestionText.replace(/\*\*/g, '').trim();
    
    // Try to find and replace the corresponding section if we have a section title
    if (sectionTitle) {
      const paragraphs = Array.from(editor.children) as HTMLElement[];
      
      console.log('Looking for section:', sectionTitle);
      console.log('Suggestion text:', suggestionText);

      for (let i = 0; i < paragraphs.length; i++) {
        const paragraphText = paragraphs[i].textContent?.trim() || '';
        // Remove any markdown formatting from the paragraph text for comparison
        const cleanParagraphText = paragraphText.replace(/\*\*/g, '').trim();
        
        if (cleanParagraphText.includes(sectionTitle.replace(/\*\*/g, '').trim())) {
          // Replace the next paragraph's content
          if (i + 1 < paragraphs.length) {
            paragraphs[i + 1].innerHTML = suggestionText;
            console.log('Replaced content in paragraph:', i + 1);
            
            // Trigger input event to update content state
            const inputEvent = new Event('input', { bubbles: true });
            editor.dispatchEvent(inputEvent);
            return;
          }
        }
      }
    }

    // If no section found or no section title, replace the entire content
    editor.innerHTML = suggestionText;
    
    // Trigger input event to update content state
    const inputEvent = new Event('input', { bubbles: true });
    editor.dispatchEvent(inputEvent);

    console.log('Content replaced successfully');
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
                <Button 
                  size="sm" 
                  variant="default"
                  onClick={() => handleApplySuggestion(suggestion)}
                  className="w-full mt-2"
                >
                  Apply Change
                </Button>
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