import { useEffect } from "react";

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

export function PricingPlansGrid({ period }: PricingPlansGridProps) {
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

  return (
    <div className="w-full max-w-4xl mx-auto">
      {period === "monthly" ? (
        <stripe-pricing-table
          pricing-table-id="prctbl_1QddJvPqjwGz87OwsHhbLiY9"
          publishable-key="pk_live_51QaYabPqjwGz87OwSeE0D2FdImmZ5ntpS6xUfrUiXzjI4k23C2rQOrX9Q8bfHglEj94mNi6mHWyP3nLq9r3nMXyC00Fb5TpBHC"
        />
      ) : (
        <stripe-pricing-table
          pricing-table-id="prctbl_1QddMiPqjwGz87OwZecZTh6X"
          publishable-key="pk_live_51QaYabPqjwGz87OwSeE0D2FdImmZ5ntpS6xUfrUiXzjI4k23C2rQOrX9Q8bfHglEj94mNi6mHWyP3nLq9r3nMXyC00Fb5TpBHC"
        />
      )}
    </div>
  );
}