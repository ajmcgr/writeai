import { Button } from "@/components/ui/button";
import { SuggestionsList } from "./analysis/SuggestionsList";
import { findAndReplaceText } from "@/utils/textReplacer";

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
    
    findAndReplaceText(editor, sectionTitle, suggestionText);
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