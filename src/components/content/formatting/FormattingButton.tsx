import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface FormattingButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  icon?: LucideIcon;
  asChild?: boolean;
}

export const FormattingButton = ({ onClick, disabled, children, icon: Icon, asChild }: FormattingButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      asChild={asChild}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </Button>
  );
};