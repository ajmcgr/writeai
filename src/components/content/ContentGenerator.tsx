import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { useNavigate } from "react-router-dom";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface ContentGeneratorProps {
  session: Session;
  onContentGenerated: (content: string) => void;
}

export const ContentGenerator = ({ session, onContentGenerated }: ContentGeneratorProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

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
      .select()
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (!profile) return false;

    // Pro users bypass the usage check
    if (profile.subscription_status === "pro") {
      return true;
    }

    // Only check daily limit for free users
    const today = new Date().toISOString().split("T")[0];
    if (
      profile.last_use_date === today &&
      (profile.daily_uses ?? 0) >= 3
    ) {
      toast({
        title: "Usage limit reached",
        description: "You've reached your daily limit. Please upgrade to Pro for unlimited access.",
      });
      navigate("/pricing");
      return false;
    }

    return true;
  };

  const updateUsageCount = async () => {
    if (!session?.user) return;

    const today = new Date().toISOString().split("T")[0];
    const { data: profile } = await supabase
      .from("profiles")
      .select()
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (!profile) return;

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
          daily_uses: (profile.daily_uses ?? 0) + 1,
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

      onContentGenerated(data.generatedText);
      await updateUsageCount();

      await supabase
        .from("content")
        .insert({
          content: data.generatedText,
          type: "press_release",
          is_generated: true,
          title: "Generated Press Release",
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

  return (
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
  );
};