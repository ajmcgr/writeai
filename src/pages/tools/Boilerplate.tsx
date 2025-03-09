
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { ContentGeneratorTool } from "@/components/tools/ContentGeneratorTool";
import { useSession } from "@supabase/auth-helpers-react";
import { ErrorBoundary } from "@/components/ui/error-boundary";

const Boilerplate = () => {
  const session = useSession();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow container py-20">
        <ErrorBoundary>
          <ContentGeneratorTool
            session={session}
            title="Boilerplate Generator"
            description="Generate professional company boilerplates for your press releases."
            type="boilerplate"
            placeholder="Enter information about your company, including its mission, key products/services, market position, and any notable achievements..."
          />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};

export default Boilerplate;
