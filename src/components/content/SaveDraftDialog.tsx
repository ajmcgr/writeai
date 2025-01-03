import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SaveDraftDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  content: string;
  onSave: (title: string) => void;
}

export function SaveDraftDialog({ isOpen, onOpenChange, content, onSave }: SaveDraftDialogProps) {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save drafts",
          variant: "destructive",
        });
        return;
      }

      // Check if user is on free plan and has created a document in the last 24 hours
      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_status, last_document_created_at")
        .eq("user_id", session.user.id)
        .single();

      if (profile?.subscription_status === "free") {
        const lastCreated = profile?.last_document_created_at;
        if (lastCreated && new Date(lastCreated).getTime() > Date.now() - 24 * 60 * 60 * 1000) {
          toast({
            title: "Daily limit reached",
            description: "Free users can only create one document every 24 hours. Upgrade to Pro for unlimited access.",
          });
          onOpenChange(false);
          navigate("/pricing");
          return;
        }
      }

      // Update last_document_created_at
      await supabase
        .from("profiles")
        .update({ last_document_created_at: new Date().toISOString() })
        .eq("user_id", session.user.id);

      // Save the document
      const { data: newContent, error: contentError } = await supabase
        .from('content')
        .insert({
          title,
          content,
          type: 'press_release',
          is_draft: true,
          user_id: session.user.id
        })
        .select()
        .single();

      if (contentError) throw contentError;

      onSave(title);
      onOpenChange(false);

      // Trigger a refresh of the documents list by navigating to the new document
      if (newContent?.id) {
        navigate(`/write/${newContent.id}`);
      }
      
    } catch (error) {
      console.error("Error saving draft:", error);
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Draft</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter document title"
            className="w-full"
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!title || isLoading}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}