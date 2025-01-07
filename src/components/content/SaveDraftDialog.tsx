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
    if (isLoading || !title.trim()) return;

    try {
      setIsLoading(true);
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

      // Check for existing document with same title
      const { data: existingDocs, error: queryError } = await supabase
        .from('content')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('title', title.trim())
        .maybeSingle();

      if (queryError) {
        console.error("Error checking for existing document:", queryError);
        throw queryError;
      }

      let savedContent;

      if (existingDocs) {
        console.log("Document with same title exists, updating instead");
        const { data: updatedContent, error: updateError } = await supabase
          .from('content')
          .update({
            content,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingDocs.id)
          .select()
          .single();

        if (updateError) throw updateError;
        savedContent = updatedContent;
      } else {
        // Save new document
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

        if (contentError) throw contentError;
        savedContent = newContent;
      }

      console.log("Draft saved successfully:", savedContent);
      
      onSave(title);
      onOpenChange(false);
      setTitle("");

      // Trigger manual refresh of documents
      if (typeof window !== 'undefined' && (window as any).refreshDocuments) {
        console.log("Triggering manual refresh of documents");
        (window as any).refreshDocuments();
      }

      if (savedContent?.id) {
        navigate(`/write/${savedContent.id}`);
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
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!isLoading) {
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
            disabled={isLoading}
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              if (!isLoading) {
                onOpenChange(false);
                setTitle("");
              }
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!title.trim() || isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}