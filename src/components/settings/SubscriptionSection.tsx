import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface SubscriptionSectionProps {
  subscriptionStatus: string | null;
}

export function SubscriptionSection({ subscriptionStatus: initialStatus }: SubscriptionSectionProps) {
  const navigate = useNavigate();
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    const checkSubscription = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_status, stripe_customer_id, stripe_subscription_id")
        .eq("user_id", session.user.id)
        .single();

      if (profile) {
        console.log("Subscription status:", profile.subscription_status);
        console.log("Stripe customer ID:", profile.stripe_customer_id);
        setStatus(profile.subscription_status);
      }
    };

    checkSubscription();

    const interval = setInterval(checkSubscription, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleUpgrade = () => {
    navigate("/pricing");
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="h-5 w-5 text-gray-500" />
        <h2 className="text-xl font-semibold">Subscription</h2>
      </div>
      <div className="space-y-6">
        <p className="text-gray-600">
          Current Plan: <span className="font-semibold capitalize">{status}</span>
        </p>
        {status === "free" && (
          <Button onClick={handleUpgrade}>
            Upgrade to Pro
          </Button>
        )}
      </div>
    </div>
  );
}