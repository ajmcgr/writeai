
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
              src={isAuthenticated ? "/lovable-uploads/b04b3af8-22f1-418b-a194-5200f3f191e4.png" : "/lovable-uploads/8ba93214-4227-4884-ace9-0bc42115fdfe.png"}
              alt="Write AI Logo" 
              className={`w-auto transition-all duration-200 ${isAuthenticated ? 'h-5' : 'h-7'}`}
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
