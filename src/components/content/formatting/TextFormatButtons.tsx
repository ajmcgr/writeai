import { Eraser } from "lucide-react";
import { FormattingButton } from "./FormattingButton";

interface TextFormatButtonsProps {
  onFormat: (type: string) => void;
  clearFormatting: () => void;
  isLoading: boolean;
}

export const TextFormatButtons = ({ onFormat, clearFormatting, isLoading }: TextFormatButtonsProps) => {
  return (
    <div className="flex items-center gap-2">
      <FormattingButton onClick={() => onFormat("bold")} disabled={isLoading}>
        B
      </FormattingButton>
      <FormattingButton onClick={() => onFormat("italic")} disabled={isLoading}>
        I
      </FormattingButton>
      <FormattingButton onClick={() => onFormat("underline")} disabled={isLoading}>
        U
      </FormattingButton>
      <FormattingButton onClick={() => onFormat("formatBlock")} disabled={isLoading}>
        H
      </FormattingButton>
      <FormattingButton onClick={() => onFormat("insertUnorderedList")} disabled={isLoading}>
        •
      </FormattingButton>
      <FormattingButton onClick={() => onFormat("insertOrderedList")} disabled={isLoading}>
        1.
      </FormattingButton>
      <FormattingButton onClick={clearFormatting} disabled={isLoading} icon={Eraser} />
    </div>
  );
};