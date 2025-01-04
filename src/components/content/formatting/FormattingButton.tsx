import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface FormattingButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
  disabled?: boolean;
  className?: string;
}

export const FormattingButton = ({
  icon,
  label,
  onClick,
  isActive,
  disabled,
  className,
}: FormattingButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClick}
          className={cn(
            "h-8 w-8",
            isActive && "bg-accent text-accent-foreground",
            className
          )}
          disabled={disabled}
        >
          {icon}
          <span className="sr-only">{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
};