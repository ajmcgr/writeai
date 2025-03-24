
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
          className={`md:hidden ${isAuthenticated ? 'text-black hover:bg-gray-100 p-2' : 'text-white hover:bg-[#9599d1] p-2'}`}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] bg-[#848ac8] text-white">
        <div className="flex flex-col space-y-4 mt-8">
          {isAuthenticated ? (
            <>
              {subscriptionStatus === 'free' && (
                <Link to="/pricing" className="px-6 py-3 bg-white text-black hover:bg-gray-100 rounded-md text-center font-semibold">
                  Upgrade to Pro
                </Link>
              )}
              <Link to="/settings" className="px-6 py-3 hover:bg-[#9599d1] rounded-md font-semibold">
                Account Settings
              </Link>
              <Button 
                variant="ghost" 
                className="justify-start px-6 py-3 text-white hover:bg-[#9599d1] font-semibold"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/pricing" className="px-6 py-3 hover:bg-[#9599d1] rounded-md font-semibold">
                Pricing
              </Link>
              <Link to="/signin" className="px-6 py-3 hover:bg-[#9599d1] rounded-md font-semibold">
                Login
              </Link>
              <Link to="/signup" className="px-6 py-3 hover:bg-[#9599d1] rounded-md flex items-center gap-1 font-semibold">
                Sign Up <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
