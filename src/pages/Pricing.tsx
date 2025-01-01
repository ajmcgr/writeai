import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Pricing as PricingTable } from "@/components/home/Pricing";
import { FAQ } from "@/components/home/FAQ";

const Pricing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <PricingTable />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;