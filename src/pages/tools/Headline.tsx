import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { ContentGeneratorTool } from "@/components/tools/ContentGeneratorTool";
import { useSession } from "@supabase/auth-helpers-react";

const Headline = () => {
  const session = useSession();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow container py-20">
        <ContentGeneratorTool
          session={session}
          title="Headline Generator"
          description="Create attention-grabbing headlines for your press releases."
          type="headline"
          placeholder="Enter the key points of your story, including the main announcement, impact, or newsworthy elements..."
        />
      </main>
      <Footer />
    </div>
  );
};

export default Headline;