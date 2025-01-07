import { Eraser } from "lucide-react";
import { FormattingButton } from "./FormattingButton";
import { TooltipProvider } from "@/components/ui/tooltip";

interface TextFormatButtonsProps {
  onFormat: (type: string) => void;
  clearFormatting: () => void;
  isLoading: boolean;
}

export const TextFormatButtons = ({
  onFormat,
  clearFormatting,
  isLoading,
}: TextFormatButtonsProps) => {
  const handleListFormat = (type: 'insertUnorderedList' | 'insertOrderedList') => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const parentElement = range.commonAncestorContainer.parentElement;
    
    // If we're already in a list, move out of it
    if (parentElement?.closest('ul, ol')) {
      document.execCommand('outdent');
    } else {
      // Otherwise create a new list
      document.execCommand(type);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <FormattingButton
          onClick={() => onFormat("bold")}
          disabled={isLoading}
          label="Make selected text bold (Ctrl+B)"
        >
          B
        </FormattingButton>
        <FormattingButton
          onClick={() => onFormat("italic")}
          disabled={isLoading}
          label="Make selected text italic (Ctrl+I)"
        >
          I
        </FormattingButton>
        <FormattingButton
          onClick={() => onFormat("underline")}
          disabled={isLoading}
          label="Underline selected text (Ctrl+U)"
        >
          U
        </FormattingButton>
        <FormattingButton
          onClick={() => handleListFormat("insertUnorderedList")}
          disabled={isLoading}
          label="Create a bulleted list"
        >
          •
        </FormattingButton>
        <FormattingButton
          onClick={() => handleListFormat("insertOrderedList")}
          disabled={isLoading}
          label="Create a numbered list"
        >
          1.
        </FormattingButton>
        <FormattingButton
          onClick={clearFormatting}
          disabled={isLoading}
          icon={Eraser}
          label="Remove all formatting from selected text (keeps the text content)"
        />
      </div>
    </TooltipProvider>
  );
};
