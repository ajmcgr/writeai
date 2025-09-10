
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PricingPlansGrid } from "../pricing/PricingPlansGrid";

export function Pricing() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Choose the plan that best fits your needs.
          </p>
        </div>

        <Tabs defaultValue="monthly" className="w-full">
          <TabsList className="grid w-full max-w-[300px] md:max-w-[400px] grid-cols-2 mx-auto mb-8">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="annual">Annual (Save 50%)</TabsTrigger>
          </TabsList>

          <TabsContent value="monthly">
            <PricingPlansGrid period="monthly" isLoading={false} subscriptionStatus={null} />
          </TabsContent>

          <TabsContent value="annual">
            <PricingPlansGrid period="annual" isLoading={false} subscriptionStatus={null} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
