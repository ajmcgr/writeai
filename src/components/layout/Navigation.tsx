import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/navigation/Logo";
import { DesktopNav } from "@/components/navigation/DesktopNav";
import { MobileNav } from "@/components/navigation/MobileNav";

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

      const { error: signOutError } = await supabase.auth.signOut();
      
      if (signOutError) {
        console.error("Error during logout:", signOutError);
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

  return (
    <header className="fixed top-0 w-full bg-[#848ac8] z-50">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Logo isAuthenticated={isAuthenticated} handleLogoClick={handleLogoClick} />
        <DesktopNav isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
        <MobileNav isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
      </div>
    </header>
  );
}