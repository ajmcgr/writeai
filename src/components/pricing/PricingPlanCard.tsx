import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

interface PricingPlanProps {
  name: string;
  description: string;
  price: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  period?: "monthly" | "annual";
  onSelect?: () => void;
  disabled?: boolean;
  currentPlan?: boolean;
}

export function PricingPlanCard({
  name,
  description,
  price,
  features,
  cta,
  highlighted = false,
  period = "monthly",
  onSelect,
  disabled = false,
  currentPlan = false,
}: PricingPlanProps) {
  const isFreeTrialPlan = name === "Free Trial";

  return (
    <Card className={`relative p-6 ${highlighted ? "border-primary shadow-lg" : ""}`}>
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}
      <div className="mb-4">
        <h3 className="text-xl font-bold">{name}</h3>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>
      <div className="mb-6">
        <div className="flex items-baseline">
          <span className="text-3xl font-bold">${price}</span>
          {price !== "0" && (
            <span className="text-muted-foreground ml-1">/{period}</span>
          )}
        </div>
      </div>
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <Check className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
            <span className="text-sm text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>
      {isFreeTrialPlan ? (
        <Link to="/signup">
          <Button
            className="w-full"
            disabled={disabled}
            variant={highlighted ? "default" : "outline"}
          >
            {currentPlan ? "Current Plan" : cta}
          </Button>
        </Link>
      ) : (
        <Button
          onClick={onSelect}
          className="w-full"
          disabled={disabled}
          variant={cta === "Upgrade Now" ? "default" : (highlighted ? "default" : "outline")}
        >
          {currentPlan ? "Current Plan" : cta}
        </Button>
      )}
    </Card>
  );
}