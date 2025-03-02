
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { ContentGeneratorTool } from "@/components/tools/ContentGeneratorTool";
import { useSession } from "@supabase/auth-helpers-react";

const Quote = () => {
  const session = useSession();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow container py-20">
        <ContentGeneratorTool
          session={session}
          title="Quote Generator"
          description="Generate impactful quotes for your press releases."
          type="quote"
          placeholder="Enter details about the speaker (name, role) and the context of the quote, including key messages or themes to emphasize..."
        />
      </main>
      <Footer />
    </div>
  );
};

export default Quote;
