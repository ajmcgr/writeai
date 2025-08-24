
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LogoProps {
  isAuthenticated: boolean;
  handleLogoClick: (e: React.MouseEvent) => void;
}

export const Logo = ({ isAuthenticated, handleLogoClick }: LogoProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link 
            to="/"
            className="flex items-center group"
            onClick={handleLogoClick}
          >
            <img 
              src="/lovable-uploads/556ab6a0-9ab6-4dcb-9a12-21cf986490dc.png"
              alt="Write AI Logo" 
              className="w-auto h-6 transition-all duration-200"
            />
            {isAuthenticated && (
              <span className="ml-2 text-black text-xs opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center">
                <ArrowLeft className="w-3 h-3 mr-1" />
                Back to editor
              </span>
            )}
          </Link>
        </TooltipTrigger>
        {isAuthenticated && (
          <TooltipContent>
            <p>Back to editor</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};
