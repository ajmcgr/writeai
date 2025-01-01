import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const checkUsageAndSubscription = async () => {
    if (!session?.user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to use this feature",
        variant: "destructive",
      });
      return false;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", session.user.id)
      .single();

    if (profile.subscription_status === "pro") {
      return true;
    }

    const today = new Date().toISOString().split("T")[0];
    if (
      profile.last_use_date === today &&
      profile.daily_uses >= 3
    ) {
      const { data } = await supabase.functions.invoke("create-checkout-session");
      if (data?.url) {
        toast({
          title: "Usage limit reached",
          description: "You've reached your daily limit. Upgrade to Pro for unlimited access!",
          action: (
            <Button
              onClick={() => window.location.href = data.url}
              variant="default"
            >
              Upgrade to Pro
            </Button>
          ),
        });
      }
      return false;
    }

    return true;
  };

  const updateUsageCount = async () => {
    const today = new Date().toISOString().split("T")[0];
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", session.user.id)
      .single();

    if (profile.last_use_date !== today) {
      await supabase
        .from("profiles")
        .update({
          daily_uses: 1,
          last_use_date: today,
        })
        .eq("user_id", session.user.id);
    } else {
      await supabase
        .from("profiles")
        .update({
          daily_uses: profile.daily_uses + 1,
        })
        .eq("user_id", session.user.id);
    }
  };

  const generateContent = async (type: "generate" | "rewrite") => {
    try {
      const canProceed = await checkUsageAndSubscription();
      if (!canProceed) return;

      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke("generate-content", {
        body: {
          type,
          content: type === "rewrite" ? content : "",
        },
      });

      if (error) throw error;

      setGeneratedContent(data.generatedText);
      await updateUsageCount();

      await supabase.from("content").insert({
        content: data.generatedText,
        type: "press_release",
        is_generated: true,
      });

    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4 text-center">
          <h1 className="text-4xl font-bold">Welcome to Press Genie</h1>
          <p className="text-lg text-gray-600">
            Your AI-powered assistant for creating professional press releases and blog posts.
          </p>
          <Button
            onClick={() => navigate("/auth")}
            className="w-full"
          >
            Sign In to Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Press Genie</h1>
      
      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate">Generate New</TabsTrigger>
          <TabsTrigger value="rewrite">Rewrite Content</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          <Button
            onClick={() => generateContent("generate")}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Generating..." : "Generate Press Release"}
          </Button>
        </TabsContent>

        <TabsContent value="rewrite" className="space-y-4">
          <Textarea
            placeholder="Paste your content here to rewrite..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px]"
          />
          <Button
            onClick={() => generateContent("rewrite")}
            disabled={isLoading || !content}
            className="w-full"
          >
            {isLoading ? "Rewriting..." : "Rewrite Content"}
          </Button>
        </TabsContent>
      </Tabs>

      {generatedContent && (
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">Generated Content:</h2>
          <div className="p-4 border rounded-lg whitespace-pre-wrap">
            {generatedContent}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;