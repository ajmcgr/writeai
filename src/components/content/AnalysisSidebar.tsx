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
      console.log('No section title found, appending as new paragraph');
      const newParagraph = document.createElement('p');
      newParagraph.innerHTML = suggestion.trim();
      editor.appendChild(newParagraph);
      const inputEvent = new Event('input', { bubbles: true });
      editor.dispatchEvent(inputEvent);
      return;
    }

    const sectionTitle = suggestionParts[0].trim();
    const suggestionText = suggestionParts.slice(1).join(':').trim();
    
    console.log('Looking for section:', sectionTitle);
    console.log('Suggestion text:', suggestionText);

    const paragraphs = Array.from(editor.children) as HTMLElement[];
    const cleanSectionTitle = sectionTitle.replace(/\*\*/g, '').replace(/^\d+\.\s*/, '').trim();

    // Try to find and replace the exact section
    for (let i = 0; i < paragraphs.length; i++) {
      const paragraphText = paragraphs[i].textContent?.trim() || '';
      const cleanParagraphText = paragraphText.replace(/\*\*/g, '').replace(/^\d+\.\s*/, '').trim();
      
      if (cleanParagraphText.toLowerCase() === cleanSectionTitle.toLowerCase()) {
        paragraphs[i].innerHTML = suggestionText;
        console.log('Replaced content in paragraph:', i);
        const inputEvent = new Event('input', { bubbles: true });
        editor.dispatchEvent(inputEvent);
        return;
      }
    }

    // If no exact match, try partial match
    for (let i = 0; i < paragraphs.length; i++) {
      const paragraphText = paragraphs[i].textContent?.trim() || '';
      if (paragraphText.toLowerCase().includes(cleanSectionTitle.toLowerCase())) {
        paragraphs[i].innerHTML = suggestionText;
        console.log('Replaced content with partial match in paragraph:', i);
        const inputEvent = new Event('input', { bubbles: true });
        editor.dispatchEvent(inputEvent);
        return;
      }
    }

    // If no match found, append as new paragraph
    console.log('No matching section found, appending as new paragraph');
    const newParagraph = document.createElement('p');
    newParagraph.innerHTML = suggestionText;
    editor.appendChild(newParagraph);
    const inputEvent = new Event('input', { bubbles: true });
    editor.dispatchEvent(inputEvent);
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