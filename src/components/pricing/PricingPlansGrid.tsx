import { useEffect } from "react";
import { PricingPlanCard } from "./PricingPlanCard";
import { plans } from "./pricingPlans";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "react-hot-toast";

interface PricingPlansGridProps {
  period: "monthly" | "annual";
  isLoading: boolean;
  subscriptionStatus: string | null;
}

export function PricingPlansGrid({ period, isLoading, subscriptionStatus }: PricingPlansGridProps) {
  const navigate = useNavigate();
  const currentPlans = plans[period];

  const handlePlanSelect = async (planName: string) => {
    if (planName === "Free Trial") {
      navigate("/signup");
    } else {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/signup", { state: { period } });
          return;
        }

        const { data, error } = await supabase.functions.invoke('create-checkout-session', {
          body: { period },
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        });

        if (error) {
          console.error('Error creating checkout session:', error);
          throw error;
        }

        if (data?.url) {
          window.location.href = data.url;
        }
      } catch (error) {
        console.error('Error creating checkout session:', error);
        toast.error('Failed to start checkout process. Please try again.');
      }
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {currentPlans.map((plan) => (
        <PricingPlanCard
          key={plan.name}
          {...plan}
          period={period}
          onSelect={() => handlePlanSelect(plan.name)}
          disabled={isLoading}
          currentPlan={subscriptionStatus === plan.name.toLowerCase()}
        />
      ))}
    </div>
  );
}