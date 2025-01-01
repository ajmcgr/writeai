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
        <Hero />
        <Features />
        <Testimonials />
        <Templates />
        <Pricing />
        <FAQ />
        <Enterprise />
      </main>
      <Footer />
    </div>
  );
};

export default Index;