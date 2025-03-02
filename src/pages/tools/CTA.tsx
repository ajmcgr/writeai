
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { ContentGeneratorTool } from "@/components/tools/ContentGeneratorTool";
import { useSession } from "@supabase/auth-helpers-react";
import { ErrorBoundary } from "@/components/ui/error-boundary";

const CTA = () => {
  const session = useSession();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow container py-20">
        <ErrorBoundary>
          <ContentGeneratorTool
            session={session}
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
