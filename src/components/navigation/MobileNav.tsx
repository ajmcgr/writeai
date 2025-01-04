import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

interface MobileNavProps {
  isAuthenticated: boolean;
  handleLogout: () => Promise<void>;
}

export const MobileNav = ({ isAuthenticated, handleLogout }: MobileNavProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-white">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] bg-[#848ac8] text-white">
        <div className="flex flex-col space-y-4 mt-8">
          <Link to="/about" className="px-4 py-2 hover:bg-[#9599d1] rounded-md">
            About
          </Link>
          <Link to="/pricing" className="px-4 py-2 hover:bg-[#9599d1] rounded-md">
            Pricing
          </Link>
          <a 
            href="https://blog.works.xyz/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2 hover:bg-[#9599d1] rounded-md"
          >
            Blog
          </a>
          {isAuthenticated ? (
            <>
              <Link to="/settings" className="px-4 py-2 hover:bg-[#9599d1] rounded-md">
                Account Settings
              </Link>
              <Button 
                variant="ghost" 
                className="justify-start px-4 text-white hover:bg-[#9599d1]"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/signin" className="px-4 py-2 hover:bg-[#9599d1] rounded-md">
                Sign In
              </Link>
              <Link to="/signup" className="px-4 py-2 hover:bg-[#9599d1] rounded-md">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};