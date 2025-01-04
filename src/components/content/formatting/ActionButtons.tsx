import {
  History,
  Copy,
  FileDown,
  Wand2,
  LineChart,
  Sparkles,
  Save,
  FileUp,
} from "lucide-react";
import { FormattingButton } from "./FormattingButton";

interface ActionButtonsProps {
  onHistory: () => void;
  onCopy: () => void;
  onAIGenerate: () => void;
  onRewrite: () => void;
  onAnalyze: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveDraft?: () => void;
  onExport: () => void;
  isLoading: boolean;
  hasContent: boolean;
  hasContentId: boolean;
}

export const ActionButtons = ({
  onHistory,
  onCopy,
  onAIGenerate,
  onRewrite,
  onAnalyze,
  onFileUpload,
  onSaveDraft,
  onExport,
  isLoading,
  hasContent,
  hasContentId,
}: ActionButtonsProps) => {
  return (
    <div className="flex items-center gap-2">
      <FormattingButton
        onClick={onHistory}
        disabled={isLoading || !hasContentId}
        icon={History}
        label="View previous versions of this document"
      />
      <FormattingButton
        onClick={onCopy}
        disabled={isLoading || !hasContent}
        icon={Copy}
        label="Copy all content to clipboard"
      />
      <FormattingButton
        onClick={onAIGenerate}
        disabled={isLoading}
        icon={Sparkles}
        label="Generate new content using AI assistant"
      />
      <FormattingButton
        onClick={onRewrite}
        disabled={isLoading || !hasContent}
        icon={Wand2}
        label="Rewrite current content using AI"
      />
      <FormattingButton
        onClick={onAnalyze}
        disabled={isLoading || !hasContent}
        icon={LineChart}
        label="Analyze content quality and get suggestions"
      />
      <FormattingButton
        disabled={isLoading}
        icon={FileUp}
        label="Import content from a document file"
        asChild
      >
        <label>
          Upload
          <input
            type="file"
            className="hidden"
            onChange={onFileUpload}
            accept=".txt,.doc,.docx,.odt"
          />
        </label>
      </FormattingButton>
      {onSaveDraft && (
        <FormattingButton
          onClick={onSaveDraft}
          disabled={isLoading || !hasContent}
          icon={Save}
          label="Save current content as a draft"
        />
      )}
      <FormattingButton
        onClick={onExport}
        disabled={isLoading || !hasContent}
        icon={FileDown}
        label="Export content as a Word document"
      />
    </div>
  );
};