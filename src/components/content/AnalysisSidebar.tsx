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

  // Split analysis into separate suggestions by looking for HTML paragraph tags
  const suggestions = analysis
    .split('</p>')
    .map(s => s.replace(/<p>/g, '').trim())
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

    // Format the suggestion as HTML paragraph
    suggestionText = `<p>${suggestionText}</p>`;
    
    // Try to find and replace the corresponding section if we have a section title
    if (sectionTitle) {
      const paragraphs = Array.from(editor.children) as HTMLElement[];
      
      console.log('Looking for section:', sectionTitle);
      console.log('Suggestion text:', suggestionText);

      // Clean the section title for comparison
      const cleanSectionTitle = sectionTitle.replace(/\*\*/g, '').replace(/^\d+\.\s*/, '').trim();

      // First try: Look for exact section title match
      for (let i = 0; i < paragraphs.length; i++) {
        const paragraphText = paragraphs[i].textContent?.trim() || '';
        const cleanParagraphText = paragraphText.replace(/\*\*/g, '').replace(/^\d+\.\s*/, '').trim();
        
        if (cleanParagraphText.toLowerCase() === cleanSectionTitle.toLowerCase()) {
          // Replace only the content of the next paragraph
          if (i + 1 < paragraphs.length) {
            paragraphs[i + 1].outerHTML = suggestionText;
            console.log('Replaced content in paragraph:', i + 1);
            
            // Trigger input event to update content state
            const inputEvent = new Event('input', { bubbles: true });
            editor.dispatchEvent(inputEvent);
            return;
          }
        }
      }

      // Second try: Look for partial section title match
      for (let i = 0; i < paragraphs.length; i++) {
        const paragraphText = paragraphs[i].textContent?.trim() || '';
        const cleanParagraphText = paragraphText.replace(/\*\*/g, '').replace(/^\d+\.\s*/, '').trim();
        
        if (cleanParagraphText.toLowerCase().includes(cleanSectionTitle.toLowerCase())) {
          // Replace only the content of the next paragraph
          if (i + 1 < paragraphs.length) {
            paragraphs[i + 1].outerHTML = suggestionText;
            console.log('Replaced content with partial match in paragraph:', i + 1);
            
            // Trigger input event to update content state
            const inputEvent = new Event('input', { bubbles: true });
            editor.dispatchEvent(inputEvent);
            return;
          }
        }
      }

      // Third try: Look for similar content to replace
      for (let i = 0; i < paragraphs.length; i++) {
        const paragraphText = paragraphs[i].textContent?.toLowerCase().trim() || '';
        const cleanSuggestion = suggestionText.toLowerCase();
        
        if (paragraphText.length > 0 && 
            (cleanSuggestion.includes(paragraphText) || paragraphText.includes(cleanSuggestion))) {
          paragraphs[i].outerHTML = suggestionText;
          console.log('Replaced similar content in paragraph:', i);
          
          // Trigger input event to update content state
          const inputEvent = new Event('input', { bubbles: true });
          editor.dispatchEvent(inputEvent);
          return;
        }
      }
    }

    // If no match was found, append as a new paragraph
    console.log('No matching section found, appending as new paragraph');
    editor.insertAdjacentHTML('beforeend', suggestionText);
    
    // Trigger input event to update content state
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