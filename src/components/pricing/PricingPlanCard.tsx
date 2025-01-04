import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PricingPlan {
  name: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  stripeUrl: string;
}

interface PricingPlanCardProps {
  plan: PricingPlan;
  isLoading: boolean;
  subscriptionStatus: string | null;
  onUpgrade: (url: string) => void;
}

export function PricingPlanCard({ plan, isLoading, subscriptionStatus, onUpgrade }: PricingPlanCardProps) {
  const navigate = useNavigate();

  const getButtonText = (planName: string) => {
    if (isLoading) return "Loading...";
    if (subscriptionStatus === "pro" && planName === "Pro") return "Current Plan";
    if (planName === "Free") return "Get Started";
    return "Upgrade Now";
  };

  const handleButtonClick = () => {
    if (plan.name === "Free") {
      navigate("/signup", { state: { redirectTo: "/write" } });
    } else if (plan.stripeUrl) {
      window.location.href = plan.stripeUrl;
    }
  };

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold">${plan.price}</span>
          <span className="text-muted-foreground">/{plan.period}</span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <Check className="h-5 w-5 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Button 
          className="w-full mt-8"
          onClick={handleButtonClick}
          disabled={isLoading || (subscriptionStatus === "pro" && plan.name === "Pro")}
        >
          {getButtonText(plan.name)}
        </Button>
      </CardContent>
    </Card>
  );
}