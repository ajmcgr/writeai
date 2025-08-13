
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { ContentGeneratorTool } from "@/components/tools/ContentGeneratorTool";

import { ErrorBoundary } from "@/components/ui/error-boundary";

const Headline = () => {
  

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow container max-w-4xl py-20">
        <ErrorBoundary>
          <ContentGeneratorTool
            
            title="Headline Generator"
            description="Create attention-grabbing headlines for your press releases."
            type="headline"
            placeholder="Enter the key points of your story, including the main announcement, impact, or newsworthy elements..."
          />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};

export default Headline;
