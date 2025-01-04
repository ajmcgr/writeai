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
              src="/lovable-uploads/b8c19210-8dc7-4ed7-858c-f00f6267982e.png" 
              alt="Write AI Logo" 
              className={`w-auto transition-all duration-200 ${isAuthenticated ? 'h-6' : 'h-8'}`}
            />
            {isAuthenticated && (
              <span className="ml-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center">
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