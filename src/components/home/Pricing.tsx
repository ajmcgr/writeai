import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function Pricing() {
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setIsLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("subscription_status")
          .eq("user_id", session.user.id)
          .single();

        setSubscriptionStatus(profile?.subscription_status || null);
      } catch (error) {
        console.error("Error checking subscription:", error);
        toast({
          title: "Error",
          description: "Failed to check subscription status",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscription();
  }, [toast]);

  const plans = {
    monthly: [
      {
        name: "Free",
        description: "Perfect for occasional press releases",
        price: "0",
        period: "month",
        features: [
          "3 free AI press release re-writes every 24 hours",
          "AI-powered suggestions",
          "Basic templates",
          "Download text",
          "Priority support",
        ],
        stripeUrl: "",
      },
      {
        name: "Pro",
        description: "For businesses that need more",
        price: "30",
        period: "month",
        features: [
          "Unlimited AI press release rewrites",
          "AI-powered suggestions",
          "Premium templates",
          "Download text",
          "Priority support",
        ],
        stripeUrl: "https://buy.stripe.com/3csdUq5MQ6w2gzS4gg",
      },
    ],
    annual: [
      {
        name: "Free",
        description: "Perfect for occasional press releases",
        price: "0",
        period: "year",
        features: [
          "3 free AI press release re-writes every 24 hours",
          "AI-powered suggestions",
          "Basic templates",
          "Download text",
          "Priority support",
        ],
        stripeUrl: "",
      },
      {
        name: "Pro",
        description: "For businesses that need more",
        price: "300",
        period: "year",
        features: [
          "Unlimited AI press release rewrites",
          "AI-powered suggestions",
          "Premium templates",
          "Download text",
          "Priority support",
        ],
        stripeUrl: "https://buy.stripe.com/aEU8A6cbeaMibfy145",
      },
    ],
  };

  const handleUpgrade = (url: string) => {
    if (!url) return;
    window.location.href = url;
  };

  const getButtonText = (planName: string) => {
    if (isLoading) return "Loading...";
    if (subscriptionStatus === "pro" && planName === "Pro") return "Current Plan";
    if (planName === "Free") return "Get Started";
    return "Upgrade Now";
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-muted-foreground">
            Choose the plan that best fits your needs
          </p>
        </div>

        <Tabs defaultValue="monthly" className="w-full">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2 mx-auto mb-8">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="annual">Annual (Save 17%)</TabsTrigger>
          </TabsList>

          <TabsContent value="monthly">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {plans.monthly.map((plan) => (
                <Card key={plan.name} className="relative">
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
                      onClick={() => handleUpgrade(plan.stripeUrl)}
                      disabled={isLoading || (subscriptionStatus === "pro" && plan.name === "Pro")}
                    >
                      {getButtonText(plan.name)}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="annual">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {plans.annual.map((plan) => (
                <Card key={plan.name} className="relative">
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
                      onClick={() => handleUpgrade(plan.stripeUrl)}
                      disabled={isLoading || (subscriptionStatus === "pro" && plan.name === "Pro")}
                    >
                      {getButtonText(plan.name)}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}