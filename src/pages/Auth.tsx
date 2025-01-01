import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Send welcome email for new sign-ups
        try {
          await supabase.functions.invoke("send-notification-email", {
            body: {
              type: "welcome",
              email: session.user.email,
              name: session.user.user_metadata?.full_name,
            },
          });
        } catch (error) {
          console.error("Error sending welcome email:", error);
          toast({
            title: "Welcome!",
            description: "There was an issue sending your welcome email, but your account is ready to use.",
          });
        }
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={["google"]}
          theme="light"
        />
      </div>
    </div>
  );
};

export default AuthPage;