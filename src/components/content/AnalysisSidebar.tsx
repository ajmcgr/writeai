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
    
    // Find the most similar part of the content to replace
    const words = content.split(' ');
    let bestMatch = { score: 0, start: 0, length: 0 };
    
    // Simple similarity scoring
    for (let i = 0; i < words.length; i++) {
      for (let j = i + 1; j <= words.length; j++) {
        const segment = words.slice(i, j).join(' ');
        const similarity = calculateSimilarity(segment, suggestion);
        if (similarity > bestMatch.score) {
          bestMatch = { score: similarity, start: i, length: j - i };
        }
      }
    }

    // If we found a good match, replace that part
    if (bestMatch.score > 0.3) {
      const newContent = [
        words.slice(0, bestMatch.start).join(' '),
        suggestion,
        words.slice(bestMatch.start + bestMatch.length).join(' ')
      ].join(' ');
      onApply(newContent);
    } else {
      // Fallback to full replacement if no good match found
      onApply(suggestion);
    }
  };

  const calculateSimilarity = (text1: string, text2: string) => {
    const set1 = new Set(text1.toLowerCase().split(' '));
    const set2 = new Set(text2.toLowerCase().split(' '));
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return intersection.size / union.size;
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
                  Apply Suggestion
                </Button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};