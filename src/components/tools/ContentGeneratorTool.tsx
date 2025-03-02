
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { ContentDisplay } from "@/components/content/ContentDisplay";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ContentGeneratorToolProps {
  session: Session | null;
  title: string;
  description: string;
  type: "boilerplate" | "headline" | "quote" | "cta";
  placeholder: string;
}

export const ContentGeneratorTool = ({
  session,
  title,
  description,
  type,
  placeholder,
}: ContentGeneratorToolProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const checkUsageAndSubscription = async () => {
    if (!session?.user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to use this feature",
        variant: "destructive",
      });
      navigate("/signin");
      return false;
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select()
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "An error occurred while checking your subscription status",
        variant: "destructive",
      });
      return false;
    }

    if (!profile) {
      console.warn("No profile found for user");
      return false;
    }

    if (profile.subscription_status === "pro") {
      return true;
    }

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

  const generateContent = async () => {
    try {
      if (!session?.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to use this feature",
          variant: "destructive",
        });
        navigate("/signin");
        return;
      }

      const canProceed = await checkUsageAndSubscription();
      if (!canProceed) return;

      setIsLoading(true);
      setGeneratedContent("");
      
      console.log(`Generating ${type} with context:`, context.substring(0, 50) + '...');
      
      const { data, error } = await supabase.functions.invoke("generate-specialized-content", {
        body: {
          type,
          context,
        },
      });

      if (error) {
        console.error("Supabase function error:", error);
        throw new Error(error.message || "Failed to generate content");
      }

      if (!data || !data.generatedText) {
        console.error("Invalid response from function:", data);
        throw new Error("No content returned from the generator");
      }

      console.log(`Successfully generated ${type}`);
      setGeneratedContent(data.generatedText);
      await updateUsageCount();

      const { error: saveError } = await supabase
        .from("content")
        .insert({
          content: data.generatedText,
          type,
          is_generated: true,
          title: `Generated ${type}`,
          user_id: session.user.id,
        });

      if (saveError) {
        console.error("Error saving content:", saveError);
      }

    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Error",
        description: error instanceof Error 
          ? error.message 
          : "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <div className="space-y-4">
        <Textarea
          placeholder={placeholder}
          value={context}
          onChange={(e) => setContext(e.target.value)}
          className="min-h-[200px]"
        />
        <Button
          onClick={generateContent}
          disabled={isLoading || !context.trim()}
          className="w-full"
        >
          {isLoading ? (
            <span className="flex items-center">
              <LoadingSpinner className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </span>
          ) : (
            "Generate Content"
          )}
        </Button>
      </div>

      {generatedContent && <ContentDisplay content={generatedContent} />}
    </div>
  );
};
