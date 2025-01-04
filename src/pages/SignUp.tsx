import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/layout/Navigation";

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const redirectTo = location.state?.redirectTo || "/write";

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        console.log('User signed in, creating HubSpot contact');
        
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
          if (location.state?.price) {
            console.log('Creating Stripe checkout session');
            const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke(
              'create-checkout-session',
              {
                body: { 
                  priceId: location.state.price,
                  email: session.user.email,
                  userId: session.user.id
                },
                headers: {
                  Authorization: `Bearer ${session.access_token}`
                }
              }
            );

            if (checkoutError) {
              console.error('Checkout error:', checkoutError);
              throw checkoutError;
            }

            if (checkoutData?.url) {
              console.log('Redirecting to checkout:', checkoutData.url);
              window.location.href = checkoutData.url;
              return; // Prevent further navigation
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
            view="sign_up"
            theme="light"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUp;