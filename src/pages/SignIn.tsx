
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/layout/Navigation";

type AuthViewType = 'sign_in' | 'sign_up';

type ExtendedAuth = typeof Auth & {
  onViewChange?: (view: AuthViewType) => void;
};

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const redirectTo = location.state?.redirectTo || "/write";

  useEffect(() => {
    // Check if there's an existing session on mount
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log("Existing session found, redirecting to:", redirectTo);
        navigate(redirectTo);
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Sign in page - Auth state changed:", event, session?.user?.email);
      
      if (event === 'SIGNED_IN' && session) {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        navigate(redirectTo);
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out");
        navigate("/");
      } else if (event === 'INITIAL_SESSION') {
        console.log("Initial session check completed");
      }
    });

    return () => {
      console.log("Cleaning up auth state change subscription");
      subscription.unsubscribe();
    };
  }, [navigate, toast, redirectTo]);

  const handleViewChange = (view: AuthViewType) => {
    if (view === 'sign_up') {
      navigate('/signup', { state: { redirectTo } });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to your account to continue
            </p>
          </div>
          <Auth
            {...({
              supabaseClient: supabase,
              appearance: {
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#848ac8',
                      brandAccent: '#9599d1',
                    },
                  },
                },
              },
              providers: ["google"],
              view: "sign_in",
              theme: "light",
              onViewChange: handleViewChange,
              redirectTo: `${window.location.origin}/auth/callback`,
              onlyThirdPartyProviders: false,
            } as React.ComponentProps<ExtendedAuth>)}
          />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
