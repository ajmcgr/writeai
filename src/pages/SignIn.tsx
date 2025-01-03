import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/layout/Navigation";
import { AuthError, AuthChangeEvent } from "@supabase/supabase-js";

const SignIn = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if there's an existing session on mount
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log("Existing session found, redirecting to write page");
        navigate("/write");
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session) => {
      console.log("Sign in page - Auth state changed:", event, session?.user?.email);
      
      if (event === 'SIGNED_IN' && session) {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        navigate("/write");
      } else if (event === 'USER_DELETED' || event === 'SIGNED_OUT') {
        console.log("User signed out or deleted");
        navigate("/");
      } else if (event === 'INITIAL_SESSION') {
        console.log("Initial session check completed");
      }
    });

    return () => {
      console.log("Cleaning up auth state change subscription");
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

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
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#848ac8',
                    brandAccent: '#9599d1',
                  },
                },
              },
            }}
            providers={["google"]}
            theme="light"
          />
        </div>
      </div>
    </div>
  );
};

export default SignIn;