import { Button } from "@/components/ui/button";
import { SuggestionsList } from "./analysis/SuggestionsList";
import { findAndReplaceText } from "@/utils/textReplacer";

interface AnalysisSidebarProps {
  analysis: string | null;
  onApply?: (suggestion: string) => void;
  content: string;
}

interface Suggestion {
  original: string;
  improved: string;
}

export const AnalysisSidebar = ({ analysis, onApply, content }: AnalysisSidebarProps) => {
  if (!analysis) return null;

  console.log('Raw analysis:', analysis);

  // Parse the suggestions into structured format
  const suggestions: Suggestion[] = analysis
    .split(/\n\n/)
    .map(block => {
      const lines = block.split('\n');
      const original = lines[0]?.replace('Original: ', '').replace(/^"|"$/g, '');
      const improved = lines[1]?.replace('Improved: ', '').replace(/^"|"$/g, '');
      
      if (original && improved) {
        return { original, improved };
      }
      return null;
    })
    .filter((s): s is Suggestion => s !== null);

  console.log('Parsed suggestions:', suggestions);

  const handleApplySuggestion = (suggestion: Suggestion) => {
    if (!onApply) return;
    
    const editor = document.querySelector('[contenteditable="true"]') as HTMLElement;
    if (!editor) {
      console.error('Editor element not found');
      return;
    }

    console.log('Applying suggestion:', suggestion);

    // Ensure the suggestion text is properly wrapped in HTML
    const formattedSuggestion = !suggestion.improved.includes('<') 
      ? `<p>${suggestion.improved}</p>`
      : suggestion.improved;
    
    const replaced = findAndReplaceText(editor, suggestion.original, formattedSuggestion);
    if (!replaced) {
      console.error('Failed to replace text:', suggestion.original);
    }
  };

  return (
    <div className="w-80 border-l border-border bg-background p-4">
      <h3 className="text-lg font-semibold mb-4">AI Analysis</h3>
      <SuggestionsList 
        suggestions={suggestions} 
        onApply={handleApplySuggestion}
      />
    </div>
  );
};