
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FormattingButtonProps {
  icon?: LucideIcon;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  asChild?: boolean;
}

export const FormattingButton = ({
  icon: Icon,
  label,
  onClick,
  isActive,
  disabled,
  className,
  children,
  asChild,
}: FormattingButtonProps) => {
  const buttonContent = Icon ? (
    <Icon className="h-4 w-4" />
  ) : (
    children
  );

  const ButtonWrapper = ({ children }: { children: React.ReactNode }) => {
    if (asChild) {
      return <>{children}</>;
    }
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={onClick}
        className={cn(
          "h-8 w-8 p-1.5",
          isActive && "bg-accent text-accent-foreground",
          className
        )}
        disabled={disabled}
      >
        {children}
      </Button>
    );
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <ButtonWrapper>
          {buttonContent}
          <span className="sr-only">{label}</span>
        </ButtonWrapper>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
};
