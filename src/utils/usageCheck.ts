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
        .select("subscription_status, stripe_customer_id, created_at")
        .eq("user_id", session.user.id)
        .single();

      if (!profile) return false;

      console.log("Checking usage limit for user with subscription status:", profile.subscription_status);
      console.log("Stripe customer ID:", profile.stripe_customer_id);
      console.log("Account created at:", profile.created_at);

      // Pro users bypass the usage check
      if (profile.subscription_status === "pro") {
        return true;
      }

      // Check if user is within 7-day trial period
      const trialEndDate = new Date(profile.created_at);
      trialEndDate.setDate(trialEndDate.getDate() + 7);
      const isInTrialPeriod = new Date() < trialEndDate;

      if (isInTrialPeriod) {
        return true;
      }

      // Trial has ended
      toast({
        title: "Trial period ended",
        description: "Your free trial has expired. Please upgrade to Pro for unlimited access.",
      });
      navigate("/pricing");
      return false;
    } catch (error) {
      console.error("Error checking usage limit:", error);
      return false;
    }
  };

  return { checkUsageLimit };
};