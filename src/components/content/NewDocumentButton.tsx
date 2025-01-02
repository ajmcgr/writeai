import { FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export function NewDocumentButton() {
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkUsageAndSubscription = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create documents",
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
      (profile.daily_uses ?? 0) >= 1
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
    const { data: { session } } = await supabase.auth.getSession();
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

  const createNewDocument = async () => {
    if (isCreating) return;

    try {
      const canProceed = await checkUsageAndSubscription();
      if (!canProceed) return;

      setIsCreating(true);
      
      // Get the current user's session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create documents",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from("content")
        .insert({
          title: "Untitled Document",
          content: "",
          type: "press_release",
          is_draft: true,
          user_id: session.user.id  // Explicitly set the user_id
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        await updateUsageCount();
        navigate(`/write/${data.id}`);
        toast({
          title: "Success",
          description: "New document created",
        });
      }
    } catch (error) {
      console.error("Error creating document:", error);
      toast({
        title: "Error",
        description: "Failed to create new document",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Button
      onClick={createNewDocument}
      disabled={isCreating}
      className="w-full"
      size="sm"
    >
      <FilePlus className="h-4 w-4 mr-2" />
      <span>New Document</span>
    </Button>
  );
}