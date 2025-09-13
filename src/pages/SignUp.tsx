
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

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const redirectTo = location.state?.redirectTo || "/write";

  useEffect(() => {
    // Check if user is already authenticated on page load
    const checkExistingSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate(redirectTo);
        return;
      }
    };
    
    checkExistingSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (event === 'USER_UPDATED') {
        toast({
          title: "Email confirmed!",
          description: "Your email has been confirmed. You can now sign in.",
        });
        navigate('/signin');
        return;
      }

      if (event === 'SIGNED_IN' && session) {
        console.log('User signed in, creating HubSpot contact');
        
        // Check if this is a new user (created within the last minute)
        const userCreated = new Date(session.user.created_at);
        const now = new Date();
        const isNewUser = (now.getTime() - userCreated.getTime()) < 60000; // 1 minute
        
        if (isNewUser && !session.user.email_confirmed_at) {
          // Send confirmation email for new users via Resend
          try {
            const confirmationUrl = `${window.location.origin}/auth/callback?type=signup`;
            
            await supabase.functions.invoke('send-confirmation-email', {
              body: {
                email: session.user.email,
                confirmationUrl: confirmationUrl,
              },
            });

            toast({
              title: "Check your email!",
              description: "We've sent you a confirmation link to complete your signup.",
            });
            
            // Sign out the user so they need to confirm email first
            await supabase.auth.signOut();
            return;
          } catch (error) {
            console.error('Error sending confirmation email:', error);
          }
        }
        
        try {
          // Create HubSpot contact
          const { error: hubspotError } = await supabase.functions.invoke('hubspot-contact', {
            body: {
              email: session.user.email,
              name: session.user.user_metadata?.full_name,
            },
          });

          if (hubspotError) throw hubspotError;

          // If this is coming from a pricing plan selection, create checkout session
          if (location.state?.period) {
            console.log('Creating Stripe checkout session with period:', location.state.period);
            const response = await supabase.functions.invoke('create-checkout-session', {
              body: { period: location.state.period },
              headers: {
                Authorization: `Bearer ${session.access_token}`
              }
            });

            if (response.error) {
              console.error('Checkout error:', response.error);
              throw new Error(response.error.message || 'Failed to create checkout session');
            }

            if (response.data?.url) {
              console.log('Redirecting to checkout:', response.data.url);
              window.location.href = response.data.url;
              return;
            }
          }

          toast({
            title: "Welcome!",
            description: "Your account was created successfully.",
          });

          navigate(redirectTo);
        } catch (error) {
          console.error('Error in signup process:', error);
          toast({
            title: "Error",
            description: "There was an error setting up your account. Please try again.",
            variant: "destructive",
          });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast, redirectTo, location.state]);

  const handleViewChange = (view: AuthViewType) => {
    if (view === 'sign_in') {
      navigate('/signin', { state: { redirectTo } });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Create an account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Get started with your free account today
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
              view: "sign_up",
              theme: "light",
              onViewChange: handleViewChange,
              redirectTo: `${window.location.origin}/auth/callback?type=signup`,
              onlyThirdPartyProviders: false,
            } as React.ComponentProps<ExtendedAuth>)}
          />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
