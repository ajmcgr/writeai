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

  const suggestions = analysis
    .split(/\n{2,}|\n/)
    .map(s => s.trim())
    .filter(Boolean);

  console.log('Parsed suggestions:', suggestions);

  const handleApplySuggestion = (suggestion: string) => {
    if (!onApply) return;
    
    const editor = document.querySelector('[contenteditable="true"]') as HTMLElement;
    if (!editor) {
      console.error('Editor element not found');
      return;
    }

    const suggestionParts = suggestion.split(/:|—/);
    if (suggestionParts.length < 2) {
      console.log('No section title found in suggestion:', suggestion);
      return;
    }

    const sectionTitle = suggestionParts[0].trim();
    const suggestionText = suggestionParts.slice(1).join(':').trim();
    
    console.log('Looking for section:', sectionTitle);
    console.log('Suggestion text:', suggestionText);

    // Convert section title to comparable format
    const cleanSectionTitle = sectionTitle
      .replace(/\*\*/g, '')
      .replace(/^\d+\.\s*/, '')
      .toLowerCase()
      .trim();

    // Find the matching paragraph
    const paragraphs = Array.from(editor.children) as HTMLElement[];
    let matchFound = false;

    for (let i = 0; i < paragraphs.length; i++) {
      const paragraph = paragraphs[i];
      const paragraphText = paragraph.textContent?.trim() || '';
      const cleanParagraphText = paragraphText
        .toLowerCase()
        .replace(/\*\*/g, '')
        .replace(/^\d+\.\s*/, '')
        .trim();

      if (cleanParagraphText.includes(cleanSectionTitle)) {
        console.log('Found matching section:', paragraphText);
        
        // Replace only the content of the existing paragraph
        paragraph.innerHTML = suggestionText;
        
        matchFound = true;
        
        // Trigger input event to update content state
        const inputEvent = new Event('input', { bubbles: true });
        editor.dispatchEvent(inputEvent);
        break;
      }
    }

    if (!matchFound) {
      console.log('No matching section found for:', sectionTitle);
    }
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