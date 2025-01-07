import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function NewDocumentButton() {
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const createNewDocument = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create documents",
          variant: "destructive",
        });
        return;
      }

      setIsCreating(true);
      const { data, error } = await supabase
        .from("content")
        .insert({
          content: "",
          title: "Untitled Document",
          type: "press_release",
          is_draft: true,
          user_id: session.user.id
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        navigate(`/write/${data.id}`);
      }
    } catch (error) {
      console.error("Error creating new document:", error);
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
      className="w-full bg-primary hover:bg-primary/90"
      size="default"
    >
      <Plus className="h-4 w-4 mr-2" />
      New Document
    </Button>
  );
}