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
      >
        History
      </FormattingButton>
      <FormattingButton
        onClick={onCopy}
        disabled={isLoading || !hasContent}
        icon={Copy}
      >
        Copy
      </FormattingButton>
      <FormattingButton
        onClick={onAIGenerate}
        disabled={isLoading}
        icon={Sparkles}
      >
        AI Generate
      </FormattingButton>
      <FormattingButton
        onClick={onRewrite}
        disabled={isLoading || !hasContent}
        icon={Wand2}
      >
        AI Re-write
      </FormattingButton>
      <FormattingButton
        onClick={onAnalyze}
        disabled={isLoading || !hasContent}
        icon={LineChart}
      >
        AI Analyze
      </FormattingButton>
      <FormattingButton disabled={isLoading} icon={FileUp} asChild>
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
        >
          Save Draft
        </FormattingButton>
      )}
      <FormattingButton
        onClick={onExport}
        disabled={isLoading || !hasContent}
        icon={FileDown}
      >
        Export
      </FormattingButton>
    </div>
  );
};