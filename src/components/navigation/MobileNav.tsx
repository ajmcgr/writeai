
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MobileNavProps {
  isAuthenticated: boolean;
  handleLogout: () => Promise<void>;
}

export const MobileNav = ({ isAuthenticated, handleLogout }: MobileNavProps) => {
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

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden text-black p-2 hover:bg-transparent"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] bg-[#848ac8] text-white">
        <div className="flex flex-col space-y-2 mt-8">
          {isAuthenticated ? (
            <>
              {subscriptionStatus === 'free' && (
                <Link to="/pricing" className="px-6 py-3 bg-white text-black rounded-md text-center font-medium">
                  Upgrade to Pro
                </Link>
              )}
              <Link to="/settings" className="px-6 py-3 rounded-md font-medium hover:bg-transparent">
                Account Settings
              </Link>
              <Button 
                variant="ghost" 
                className="justify-start px-6 py-3 text-white font-medium hover:bg-transparent"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/pricing" className="px-6 py-3 rounded-md font-medium hover:bg-transparent">
                Pricing
              </Link>
              <Link to="/signin" className="px-6 py-3 rounded-md font-medium hover:bg-transparent">
                Login
              </Link>
              <Link to="/signup" className="px-6 py-3 rounded-md flex items-center gap-1 font-medium hover:bg-transparent">
                Sign Up <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
