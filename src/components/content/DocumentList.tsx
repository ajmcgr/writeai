import type { Database } from "@/integrations/supabase/types";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DocumentListItem } from "./DocumentListItem";

type Content = Database["public"]["Tables"]["content"]["Row"];

interface DocumentListProps {
  documents: Content[];
}

export function DocumentList({ documents }: DocumentListProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Content | null>(null);

  const handleDelete = async (document: Content) => {
    setDocumentToDelete(document);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!documentToDelete) return;

    try {
      console.log("Deleting document:", documentToDelete.id);
      const { error } = await supabase
        .from("content")
        .delete()
        .eq("id", documentToDelete.id);

      if (error) {
        console.error("Error deleting document:", error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
      
      setIsDeleteDialogOpen(false);
      setDocumentToDelete(null);
      
      // If we're currently viewing this document, navigate away
      if (window.location.pathname === `/write/${documentToDelete.id}`) {
        navigate("/write");
      }

      // Trigger manual refresh of documents
      if (typeof window !== 'undefined' && (window as any).refreshDocuments) {
        (window as any).refreshDocuments();
      }
    } catch (error) {
      console.error("Error in handleDelete:", error);
      toast({
        title: "Error",
        description: "Failed to delete document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDuplicate = async (document: Content) => {
    try {
      console.log("Duplicating document:", document.id);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        console.log("No session found");
        toast({
          title: "Authentication required",
          description: "Please sign in to duplicate documents",
          variant: "destructive",
        });
        return;
      }

      const newDocument = {
        title: `${document.title} (Copy)`,
        content: document.content,
        type: document.type,
        is_draft: document.is_draft,
        user_id: session.user.id,
        is_generated: document.is_generated
      };

      const { data, error } = await supabase
        .from("content")
        .insert(newDocument)
        .select()
        .single();

      if (error) {
        console.error("Error duplicating document:", error);
        throw error;
      }

      console.log("Document duplicated successfully:", data);
      toast({
        title: "Success",
        description: "Document duplicated successfully",
      });

      // Navigate to the new document
      if (data) {
        navigate(`/write/${data.id}`);
      }

      // Trigger manual refresh of documents
      if (typeof window !== 'undefined' && (window as any).refreshDocuments) {
        (window as any).refreshDocuments();
      }
    } catch (error) {
      console.error("Error in handleDuplicate:", error);
      toast({
        title: "Error",
        description: "Failed to duplicate document. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Documents</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {documents.length === 0 ? (
              <span className="text-sm text-muted-foreground px-2">
                No documents yet
              </span>
            ) : (
              documents.map((doc) => (
                <DocumentListItem
                  key={doc.id}
                  document={doc}
                  onDelete={handleDelete}
                  onDuplicate={handleDuplicate}
                />
              ))
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your document
              "{documentToDelete?.title || 'Untitled Document'}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDocumentToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}