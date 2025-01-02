import { Button } from "@/components/ui/button";
import {
  Save,
  FileUp,
  History,
  Copy,
  FileDown,
  Wand2,
  LineChart,
} from "lucide-react";

interface FormattingToolbarProps {
  onFormat: (type: string) => void;
  onExport: () => void;
  onCopy: () => void;
  onHistory: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRewrite: () => void;
  onAnalyze: () => void;
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
  onSaveDraft,
  isLoading,
  hasContent,
  hasContentId,
}: FormattingToolbarProps) => {
  return (
    <div className="flex items-center justify-between gap-2">
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
          onClick={() => onFormat("heading")}
          disabled={isLoading}
        >
          H
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onFormat("bullet")}
          disabled={isLoading}
        >
          •
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onFormat("number")}
          disabled={isLoading}
        >
          1.
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {onSaveDraft && (
          <Button
            variant="outline"
            size="sm"
            onClick={onSaveDraft}
            disabled={isLoading || !hasContent}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
        )}
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
          onClick={onExport}
          disabled={isLoading || !hasContent}
        >
          <FileDown className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onRewrite}
          disabled={isLoading || !hasContent}
        >
          <Wand2 className="h-4 w-4 mr-2" />
          Re-write
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onAnalyze}
          disabled={isLoading || !hasContent}
        >
          <LineChart className="h-4 w-4 mr-2" />
          Analyze
        </Button>
        <Button variant="outline" size="sm" disabled={isLoading} asChild>
          <label>
            <FileUp className="h-4 w-4 mr-2" />
            Upload
            <input
              type="file"
              className="hidden"
              onChange={onFileUpload}
              accept=".txt,.doc,.docx"
            />
          </label>
        </Button>
      </div>
    </div>
  );
};