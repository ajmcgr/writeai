import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FilePlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function NewDocumentButton() {
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const createNewDocument = async () => {
    try {
      console.log("Creating new document...");
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        console.log("No session found, showing auth required toast");
        toast({
          title: "Authentication required",
          description: "Please sign in to create documents",
          variant: "destructive",
        });
        return;
      }

      setIsCreating(true);
      console.log("Creating document for user:", session.user.id);
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

      console.log("Document created successfully:", data?.id);
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
      variant="ghost"
      className="w-full justify-start font-normal hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    >
      <FilePlus className="h-4 w-4 mr-2" />
      New Document
    </Button>
  );
}