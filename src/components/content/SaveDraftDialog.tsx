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
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSave = async () => {
    if (isLoading || !title.trim() || isSaving) return;

    try {
      setIsLoading(true);
      setIsSaving(true);
      console.log("Starting draft save process");
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        console.log("No active session found");
        toast({
          title: "Authentication required",
          description: "Please sign in to save drafts",
          variant: "destructive",
        });
        return;
      }

      // Save the document
      const { data: newContent, error: contentError } = await supabase
        .from('content')
        .insert({
          title: title.trim(),
          content,
          type: 'press_release',
          is_draft: true,
          user_id: session.user.id
        })
        .select()
        .single();

      if (contentError) {
        console.error("Error saving draft:", contentError);
        throw contentError;
      }

      console.log("Draft saved successfully:", newContent);
      
      // Call onSave after successful save
      onSave(title);
      
      // Close the dialog and reset title
      onOpenChange(false);
      setTitle("");

      // Navigate to the new document
      if (newContent?.id) {
        navigate(`/write/${newContent.id}`);
      }
      
      toast({
        title: "Success",
        description: "Draft saved successfully",
      });

    } catch (error) {
      console.error("Error saving draft:", error);
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!isSaving) {
        onOpenChange(open);
        if (!open) setTitle("");
      }
    }}>
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
            disabled={isLoading || isSaving}
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              if (!isSaving) {
                onOpenChange(false);
                setTitle("");
              }
            }}
            disabled={isLoading || isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!title.trim() || isLoading || isSaving}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}