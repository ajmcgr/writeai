import { PricingPlanCard } from "./PricingPlanCard";
import { plans } from "./pricingPlans";

interface PricingPlansGridProps {
  period: "monthly" | "annual";
  isLoading: boolean;
  subscriptionStatus: string | null;
  onUpgrade: (url: string) => void;
}

export function PricingPlansGrid({ period, isLoading, subscriptionStatus, onUpgrade }: PricingPlansGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {plans[period].map((plan) => (
        <PricingPlanCard
          key={plan.name}
          plan={plan}
          isLoading={isLoading}
          subscriptionStatus={subscriptionStatus}
          onUpgrade={onUpgrade}
        />
      ))}
    </div>
  );
}