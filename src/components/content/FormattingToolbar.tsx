import { Button } from "@/components/ui/button";
import {
  Save,
  FileUp,
  History,
  Copy,
  FileDown,
  Wand2,
  LineChart,
  Sparkles,
  XCircle,
} from "lucide-react";

interface FormattingToolbarProps {
  onFormat: (type: string) => void;
  onExport: () => void;
  onCopy: () => void;
  onHistory: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRewrite: () => void;
  onAnalyze: () => void;
  onAIGenerate: () => void;
  onSaveDraft?: () => void;
  isLoading: boolean;
  hasContent: boolean;
  hasContentId: boolean;
}

export const FormattingToolbar = ({
  onFormat,
  onExport,
  onCopy,
  onHistory,
  onFileUpload,
  onRewrite,
  onAnalyze,
  onAIGenerate,
  onSaveDraft,
  isLoading,
  hasContent,
  hasContentId,
}: FormattingToolbarProps) => {
  const clearFormatting = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const content = range.extractContents();
      const textContent = content.textContent;
      if (textContent) {
        const textNode = document.createTextNode(textContent);
        range.insertNode(textNode);
      }
    } else {
      // If no selection, clear formatting for the entire editable content
      const editor = document.querySelector('[contenteditable="true"]');
      if (editor) {
        editor.textContent = editor.textContent;
      }
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 p-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onFormat("bold")}
          disabled={isLoading}
        >
          B
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onFormat("italic")}
          disabled={isLoading}
        >
          I
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onFormat("underline")}
          disabled={isLoading}
        >
          U
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onFormat("formatBlock")}
          disabled={isLoading}
        >
          H
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onFormat("insertUnorderedList")}
          disabled={isLoading}
        >
          •
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onFormat("insertOrderedList")}
          disabled={isLoading}
        >
          1.
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={clearFormatting}
          disabled={isLoading}
        >
          <XCircle className="h-4 w-4 mr-2" />
          Clear Format
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onHistory}
          disabled={isLoading || !hasContentId}
        >
          <History className="h-4 w-4 mr-2" />
          History
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onCopy}
          disabled={isLoading || !hasContent}
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onAIGenerate}
          disabled={isLoading}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          AI Generate
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onRewrite}
          disabled={isLoading || !hasContent}
        >
          <Wand2 className="h-4 w-4 mr-2" />
          AI Re-write
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onAnalyze}
          disabled={isLoading || !hasContent}
        >
          <LineChart className="h-4 w-4 mr-2" />
          AI Analyze
        </Button>
        <Button variant="outline" size="sm" disabled={isLoading} asChild>
          <label>
            <FileUp className="h-4 w-4 mr-2" />
            Upload
            <input
              type="file"
              className="hidden"
              onChange={onFileUpload}
              accept=".txt,.doc,.docx,.odt"
            />
          </label>
        </Button>
        {onSaveDraft && (
          <Button
            variant="default"
            size="sm"
            onClick={onSaveDraft}
            disabled={isLoading || !hasContent}
            className="bg-primary hover:bg-primary/90"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
        )}
        <Button
          variant="secondary"
          size="sm"
          onClick={onExport}
          disabled={isLoading || !hasContent}
        >
          <FileDown className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
};