import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const useUsageCheck = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const checkUsageLimit = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to continue",
          variant: "destructive",
        });
        return false;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select()
        .eq("user_id", session.user.id)
        .single();

      if (!profile) return false;

      // Pro users bypass the usage check
      if (profile.subscription_status === "pro") {
        return true;
      }

      // Check daily limit for free users
      const today = new Date().toISOString().split("T")[0];
      if (profile.last_use_date === today && (profile.daily_uses ?? 0) >= 1) {
        toast({
          title: "Usage limit reached",
          description: "You've reached your daily limit. Please upgrade to Pro for unlimited access.",
        });
        navigate("/pricing");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error checking usage limit:", error);
      return false;
    }
  };

  return { checkUsageLimit };
};