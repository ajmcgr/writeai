
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { ContentDisplay } from "@/components/content/ContentDisplay";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ContentGeneratorToolProps {
  session: Session;
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
  const [error, setError] = useState<string | null>(null);
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

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select()
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      toast({
        title: "Error",
        description: "Failed to check subscription status",
        variant: "destructive",
      });
      return false;
    }

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
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select()
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (profileError || !profile) {
      console.error("Error fetching profile:", profileError);
      return;
    }

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
      setError(null);
      
      if (!context.trim()) {
        setError("Please enter some context for content generation");
        return;
      }
      
      const canProceed = await checkUsageAndSubscription();
      if (!canProceed) return;

      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke("generate-specialized-content", {
        body: {
          type,
          context,
        },
      });

      if (error) {
        console.error("Supabase function error:", error);
        throw new Error(`Failed to generate content: ${error.message}`);
      }

      if (!data || !data.generatedText) {
        throw new Error("No content was generated. Please try again.");
      }

      setGeneratedContent(data.generatedText);
      await updateUsageCount();

      await supabase
        .from("content")
        .insert({
          content: data.generatedText,
          type,
          is_generated: true,
          title: `Generated ${type}`,
          user_id: session.user.id,
        });

      toast({
        title: "Success",
        description: `Your ${type} has been generated successfully`,
      });

    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "Failed to generate content. Please try again.");
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate content. Please try again.",
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

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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
            <>
              <LoadingSpinner className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Content"
          )}
        </Button>
      </div>

      {generatedContent && <ContentDisplay content={generatedContent} />}
    </div>
  );
};
