import { TextFormatButtons } from "./formatting/TextFormatButtons";
import { ActionButtons } from "./formatting/ActionButtons";

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
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 p-4">
      <TextFormatButtons
        onFormat={onFormat}
        clearFormatting={clearFormatting}
        isLoading={isLoading}
      />
      <ActionButtons
        onHistory={onHistory}
        onCopy={onCopy}
        onAIGenerate={onAIGenerate}
        onRewrite={onRewrite}
        onAnalyze={onAnalyze}
        onFileUpload={onFileUpload}
        onSaveDraft={onSaveDraft}
        onExport={onExport}
        isLoading={isLoading}
        hasContent={hasContent}
        hasContentId={hasContentId}
      />
    </div>
  );
};