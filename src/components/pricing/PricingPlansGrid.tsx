import { useEffect } from "react";
import { PricingPlanCard } from "./PricingPlanCard";
import { plans } from "./pricingPlans";
import { useNavigate } from "react-router-dom";

interface PricingPlansGridProps {
  period: "monthly" | "annual";
  isLoading: boolean;
  subscriptionStatus: string | null;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-pricing-table': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'pricing-table-id': string;
        'publishable-key': string;
      };
    }
  }
}

export function PricingPlansGrid({ period, isLoading, subscriptionStatus }: PricingPlansGridProps) {
  const navigate = useNavigate();
  const currentPlans = plans[period];

  useEffect(() => {
    // Load Stripe.js
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/pricing-table.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePlanSelect = (planName: string) => {
    if (planName === "Free") {
      navigate("/write");
    } else {
      // Show Stripe pricing table for Pro plan
      const stripeContainer = document.createElement('div');
      stripeContainer.style.position = 'fixed';
      stripeContainer.style.top = '0';
      stripeContainer.style.left = '0';
      stripeContainer.style.width = '100%';
      stripeContainer.style.height = '100%';
      stripeContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      stripeContainer.style.zIndex = '1000';
      stripeContainer.style.display = 'flex';
      stripeContainer.style.justifyContent = 'center';
      stripeContainer.style.alignItems = 'center';

      const stripeTable = document.createElement('stripe-pricing-table');
      stripeTable.setAttribute('pricing-table-id', 
        period === "monthly" 
          ? "prctbl_1QddJvPqjwGz87OwsHhbLiY9"
          : "prctbl_1QddMiPqjwGz87OwZecZTh6X"
      );
      stripeTable.setAttribute('publishable-key', 
        "pk_live_51QaYabPqjwGz87OwSeE0D2FdImmZ5ntpS6xUfrUiXzjI4k23C2rQOrX9Q8bfHglEj94mNi6mHWyP3nLq9r3nMXyC00Fb5TpBHC"
      );

      stripeContainer.appendChild(stripeTable);
      document.body.appendChild(stripeContainer);

      // Add click event to close the modal when clicking outside
      stripeContainer.addEventListener('click', (e) => {
        if (e.target === stripeContainer) {
          document.body.removeChild(stripeContainer);
        }
      });
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