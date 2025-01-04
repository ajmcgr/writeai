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
import { ArrowLeft, User, LogOut, Menu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navigation() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Initial auth check:", session ? "Session exists" : "No session");
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
      // First check if there's a valid session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Error checking session:", sessionError);
        setIsAuthenticated(false);
        navigate("/");
        toast({
          title: "Logged out",
          description: "You have been logged out of your account",
        });
        return;
      }

      if (!session) {
        console.log("No active session found, clearing local state");
        setIsAuthenticated(false);
        navigate("/");
        toast({
          title: "Logged out",
          description: "You have been logged out of your account",
        });
        return;
      }

      // If we have a valid session, attempt to sign out
      const { error: signOutError } = await supabase.auth.signOut();
      
      if (signOutError) {
        console.error("Error during logout:", signOutError);
        // Even if there's an error, we should clean up the local state
        setIsAuthenticated(false);
        navigate("/");
        toast({
          title: "Logged out",
          description: "You have been logged out of your account",
          variant: "default",
        });
        return;
      }

      console.log("Logout successful");
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      navigate("/");
    } catch (error) {
      console.error("Unexpected error during logout:", error);
      setIsAuthenticated(false);
      toast({
        title: "Logged out",
        description: "You have been logged out of your account",
        variant: "default",
      });
      navigate("/");
    }
  };

  const MobileMenu = () => (
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

  return (
    <header className="fixed top-0 w-full bg-[#848ac8] z-50">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
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
        
        {!isAuthenticated && (
          <NavigationMenu className="hidden md:flex flex-1 justify-center">
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
            <div className="hidden md:flex items-center gap-2">
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
            <div className="hidden md:flex items-center gap-4">
              <Link to="/signin">
                <Button variant="ghost" className="text-white hover:bg-[#9599d1]">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-white text-[#848ac8] hover:bg-gray-100">Sign Up</Button>
              </Link>
            </div>
          )}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}