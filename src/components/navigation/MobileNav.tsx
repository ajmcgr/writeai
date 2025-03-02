import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
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
          className={`md:hidden ${isAuthenticated ? 'text-black hover:bg-gray-100' : 'text-white hover:bg-[#9599d1]'}`}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] bg-[#848ac8] text-white">
        <div className="flex flex-col space-y-4 mt-8">
          {isAuthenticated ? (
            <>
              {subscriptionStatus === 'free' && (
                <Link to="/pricing" className="px-4 py-2 bg-white text-[#848ac8] hover:bg-gray-100 rounded-md text-center">
                  Upgrade to Pro
                </Link>
              )}
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
