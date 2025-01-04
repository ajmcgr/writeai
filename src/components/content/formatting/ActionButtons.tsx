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
        label="History"
      />
      <FormattingButton
        onClick={onCopy}
        disabled={isLoading || !hasContent}
        icon={Copy}
        label="Copy"
      />
      <FormattingButton
        onClick={onAIGenerate}
        disabled={isLoading}
        icon={Sparkles}
        label="AI Generate"
      />
      <FormattingButton
        onClick={onRewrite}
        disabled={isLoading || !hasContent}
        icon={Wand2}
        label="AI Re-write"
      />
      <FormattingButton
        onClick={onAnalyze}
        disabled={isLoading || !hasContent}
        icon={LineChart}
        label="AI Analyze"
      />
      <FormattingButton
        disabled={isLoading}
        icon={FileUp}
        label="Upload"
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
          label="Save Draft"
        />
      )}
      <FormattingButton
        onClick={onExport}
        disabled={isLoading || !hasContent}
        icon={FileDown}
        label="Export"
      />
    </div>
  );
};