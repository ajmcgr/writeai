import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";

const Boilerplate = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow container py-20">
        <h1 className="text-4xl font-bold mb-8">Boilerplate Generator</h1>
        <p className="text-muted-foreground mb-8">
          Generate professional company boilerplates for your press releases.
        </p>
        {/* Tool implementation will be added later */}
      </main>
      <Footer />
    </div>
  );
};

export default Boilerplate;