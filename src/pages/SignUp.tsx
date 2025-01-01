import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        try {
          const { error } = await supabase.functions.invoke('hubspot-contact', {
            body: {
              email: session.user.email,
              name: session.user.user_metadata?.full_name,
            },
          });

          if (error) throw error;

          console.log('Successfully created HubSpot contact');
        } catch (error) {
          console.error('Error creating HubSpot contact:', error);
        }

        toast({
          title: "Welcome!",
          description: "Your account was created successfully.",
        });

        navigate("/write");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return (
    <div className="flex min-h-screen flex-col">
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