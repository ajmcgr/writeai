import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SubscriptionSectionProps {
  subscriptionStatus: string | null;
}

export function SubscriptionSection({ subscriptionStatus }: SubscriptionSectionProps) {
  const navigate = useNavigate();

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
          Current Plan: <span className="font-semibold capitalize">{subscriptionStatus}</span>
        </p>
        {subscriptionStatus === "free" && (
          <Button onClick={handleUpgrade}>
            Upgrade to Pro
          </Button>
        )}
      </div>
    </div>
  );
}