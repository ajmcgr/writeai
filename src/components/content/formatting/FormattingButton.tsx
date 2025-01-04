import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface FormattingButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  icon?: LucideIcon;
}

export const FormattingButton = ({ onClick, disabled, children, icon: Icon }: FormattingButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </Button>
  );
};