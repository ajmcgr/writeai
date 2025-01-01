import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";

const Quote = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow container py-20">
        <h1 className="text-4xl font-bold mb-8">Quote Generator</h1>
        <p className="text-muted-foreground mb-8">
          Generate impactful quotes for your press releases.
        </p>
        {/* Tool implementation will be added later */}
      </main>
      <Footer />
    </div>
  );
};

export default Quote;