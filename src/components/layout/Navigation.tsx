import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowLeft, User, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function Navigation() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(isAuthenticated ? "/write" : "/");
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error",
        description: "There was a problem logging out",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="fixed top-0 w-full bg-[#848ac8] z-50">
      <div className="container flex h-16 items-center justify-between">
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
                  className="h-8 w-auto"
                />
                {isAuthenticated && (
                  <span className="ml-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
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
        
        {!isAuthenticated && (
          <NavigationMenu className="flex-1 flex justify-center">
            <NavigationMenuList className="space-x-4">
              <NavigationMenuItem>
                <Link to="/about" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-[#848ac8] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#9599d1] focus:bg-[#9599d1] focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-[#9599d1]/50 data-[state=open]:bg-[#9599d1]/50">
                  About
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/pricing" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-[#848ac8] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#9599d1] focus:bg-[#9599d1] focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-[#9599d1]/50 data-[state=open]:bg-[#9599d1]/50">
                  Pricing
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <a 
                  href="https://blog.works.xyz/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-[#848ac8] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#9599d1] focus:bg-[#9599d1] focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-[#9599d1]/50 data-[state=open]:bg-[#9599d1]/50"
                >
                  Blog
                </a>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        )}

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-[#9599d1]"
                      onClick={() => navigate("/settings")}
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Account Settings</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-white hover:bg-[#9599d1]"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Logout</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ) : (
            <>
              <Link to="/signin">
                <Button variant="ghost" className="text-white hover:bg-[#9599d1]">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-white text-[#848ac8] hover:bg-gray-100">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}