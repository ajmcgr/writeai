import { Navigation } from "@/components/layout/Navigation";
import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { Testimonials } from "@/components/home/Testimonials";
import { Templates } from "@/components/home/Templates";
import { Pricing } from "@/components/home/Pricing";
import { FAQ } from "@/components/home/FAQ";
import { Enterprise } from "@/components/home/Enterprise";
import { Footer } from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-2/3">
            <Hero />
            <Features />
            <Testimonials />
            <Templates />
          </div>
          <div className="lg:w-1/3 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
            <Pricing />
          </div>
        </div>
        <FAQ />
        <Enterprise />
      </main>
      <Footer />
    </div>
  );
};

export default Index;