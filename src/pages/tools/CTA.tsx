
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { ContentGeneratorTool } from "@/components/tools/ContentGeneratorTool";

import { ErrorBoundary } from "@/components/ui/error-boundary";

const CTA = () => {
  

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow container max-w-4xl py-20">
        <ErrorBoundary>
          <ContentGeneratorTool
            
            title="CTA Generator"
            description="Create compelling calls-to-action for your press releases."
            type="cta"
            placeholder="Enter information about your desired action, target audience, and any specific benefits or urgency factors..."
          />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};

export default CTA;
