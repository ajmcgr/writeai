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
        label="Bold"
      >
        B
      </FormattingButton>
      <FormattingButton
        onClick={() => onFormat("italic")}
        disabled={isLoading}
        label="Italic"
      >
        I
      </FormattingButton>
      <FormattingButton
        onClick={() => onFormat("underline")}
        disabled={isLoading}
        label="Underline"
      >
        U
      </FormattingButton>
      <FormattingButton
        onClick={() => onFormat("formatBlock")}
        disabled={isLoading}
        label="Heading"
      >
        H
      </FormattingButton>
      <FormattingButton
        onClick={() => onFormat("insertUnorderedList")}
        disabled={isLoading}
        label="Bullet List"
      >
        •
      </FormattingButton>
      <FormattingButton
        onClick={() => onFormat("insertOrderedList")}
        disabled={isLoading}
        label="Numbered List"
      >
        1.
      </FormattingButton>
      <FormattingButton
        onClick={clearFormatting}
        disabled={isLoading}
        icon={Eraser}
        label="Clear Formatting"
      />
    </div>
  );
};