import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthCheck } from "@/components/auth/AuthCheck";
import { ContentGenerator } from "@/components/content/ContentGenerator";
import { ContentDisplay } from "@/components/content/ContentDisplay";
import type { Session } from "@supabase/supabase-js";

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [generatedContent, setGeneratedContent] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <AuthCheck isAuthenticated={!!session} />
      {session && (
        <div className="container mx-auto p-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8 text-center">Press Genie</h1>
          <ContentGenerator 
            session={session}
            onContentGenerated={setGeneratedContent}
          />
          <ContentDisplay content={generatedContent} />
        </div>
      )}
    </>
  );
};

export default Index;