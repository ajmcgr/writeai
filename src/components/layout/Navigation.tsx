import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/navigation/Logo";
import { DesktopNav } from "@/components/navigation/DesktopNav";
import { MobileNav } from "@/components/navigation/MobileNav";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
      // First check if there's an active session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Error checking session:", sessionError);
        // If we can't get the session, clear local state and redirect
        setIsAuthenticated(false);
        navigate("/");
        toast({
          title: "Logged out",
          description: "You have been logged out of your account",
        });
        return;
      }

      // If no session exists, just clear local state
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

      // If we have a session, attempt to sign out
      const { error: signOutError } = await supabase.auth.signOut({
        scope: 'local' // Only clear local session to prevent 403 errors
      });
      
      if (signOutError) {
        console.error("Error during logout:", signOutError);
        // Even if there's an error, clear local state
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
      // In case of any unexpected error, clear local state
      setIsAuthenticated(false);
      toast({
        title: "Logged out",
        description: "You have been logged out of your account",
        variant: "default",
      });
      navigate("/");
    }
  };

  return (
    <header className="fixed top-0 w-full bg-[#848ac8] z-50">
      <div className={`${isAuthenticated ? 'w-full px-4' : 'container px-4 md:px-6'} flex h-16 items-center justify-between`}>
        <Logo isAuthenticated={isAuthenticated} handleLogoClick={handleLogoClick} />
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-[#9599d1] transition-colors duration-200 hover:scale-105"
                    onClick={() => window.open('https://www.trywrite.ai/help', '_blank')}
                  >
                    <HelpCircle className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Help Center</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <DesktopNav isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
          <MobileNav isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
        </div>
      </div>
    </header>
  );
}