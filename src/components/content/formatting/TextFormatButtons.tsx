import { Eraser } from "lucide-react";
import { FormattingButton } from "./FormattingButton";

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
  return (
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
        onClick={() => onFormat("formatBlock")}
        disabled={isLoading}
        label="Convert selected text to heading"
      >
        H
      </FormattingButton>
      <FormattingButton
        onClick={() => onFormat("insertUnorderedList")}
        disabled={isLoading}
        label="Create a bulleted list"
      >
        •
      </FormattingButton>
      <FormattingButton
        onClick={() => onFormat("insertOrderedList")}
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
  );
};