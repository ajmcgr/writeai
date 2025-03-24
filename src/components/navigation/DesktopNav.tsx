
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings, LogOut, ArrowRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface DesktopNavProps {
  isAuthenticated: boolean;
  handleLogout: () => Promise<void>;
}

export const DesktopNav = ({ isAuthenticated, handleLogout }: DesktopNavProps) => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);

  useEffect(() => {
    const checkSubscription = async () => {
      if (!isAuthenticated) return;
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('user_id', session.user.id)
        .single();

      setSubscriptionStatus(profile?.subscription_status || 'free');
    };

    checkSubscription();
  }, [isAuthenticated]);

  if (isAuthenticated) {
    return (
      <div className="hidden md:flex items-center gap-2">
        {subscriptionStatus === 'free' && (
          <Link to="/pricing">
            <Button variant="secondary" size="sm" className="mr-2 px-5">
              Upgrade
            </Button>
          </Link>
        )}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/settings">
                <Button variant="ghost" size="icon" className="text-black hover:bg-gray-100 p-2">
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
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
                className="text-black hover:bg-gray-100 p-2"
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
    );
  }

  return (
    <div className="hidden md:flex items-center gap-4">
      <Link to="/pricing">
        <Button variant="ghost" className="text-white hover:bg-[#9599d1] font-semibold px-5">Pricing</Button>
      </Link>
      <Link to="/signin">
        <Button variant="ghost" className="text-white hover:bg-[#9599d1] font-semibold px-5">Login</Button>
      </Link>
      <Link to="/signup">
        <Button className="bg-white text-black hover:bg-gray-100 font-semibold px-6">Sign Up <ArrowRight className="w-4 h-4" /></Button>
      </Link>
    </div>
  );
};
