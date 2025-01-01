import { Navigation } from "@/components/layout/Navigation";
import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";

const Index = () => {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <Features />
      </main>
    </>
  );
};

export default Index;