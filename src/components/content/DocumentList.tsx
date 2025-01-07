import { File, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Database } from "@/integrations/supabase/types";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
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
import { useState, useEffect } from "react";

type Content = Database["public"]["Tables"]["content"]["Row"];

interface DocumentListProps {
  documents: Content[];
}

export function DocumentList({ documents }: DocumentListProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Content | null>(null);
  const [localDocuments, setLocalDocuments] = useState<Content[]>(documents);

  // Update local documents when prop changes
  useEffect(() => {
    setLocalDocuments(documents);
  }, [documents]);

  // Set up real-time subscription
  useEffect(() => {
    console.log("Setting up real-time subscription for documents");
    
    const channel = supabase
      .channel('document_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'content'
        },
        async (payload) => {
          console.log("Document change detected:", payload);
          
          const { data: { session } } = await supabase.auth.getSession();
          if (!session?.user) return;

          const newDoc = payload.new as Content;
          const oldDoc = payload.old as Content;

          if (payload.eventType === 'INSERT' && newDoc.user_id === session.user.id) {
            console.log("New document inserted:", newDoc);
            setLocalDocuments(prev => [newDoc, ...prev]);
          } else if (payload.eventType === 'DELETE' && oldDoc.user_id === session.user.id) {
            console.log("Document deleted:", oldDoc);
            setLocalDocuments(prev => prev.filter(doc => doc.id !== oldDoc.id));
          } else if (payload.eventType === 'UPDATE' && newDoc.user_id === session.user.id) {
            console.log("Document updated:", newDoc);
            setLocalDocuments(prev => 
              prev.map(doc => doc.id === newDoc.id ? newDoc : doc)
            );
          }
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    return () => {
      console.log("Cleaning up document subscription");
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDelete = async (document: Content) => {
    try {
      console.log("Deleting document:", document.id);
      const { error } = await supabase
        .from("content")
        .delete()
        .eq("id", document.id);

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
      if (window.location.pathname === `/write/${document.id}`) {
        navigate("/write");
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

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Documents</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {localDocuments.length === 0 ? (
              <SidebarMenuItem>
                <span className="text-sm text-muted-foreground px-2">
                  No documents yet
                </span>
              </SidebarMenuItem>
            ) : (
              localDocuments.map((doc) => (
                <SidebarMenuItem key={doc.id}>
                  <SidebarMenuButton onClick={() => navigate(`/write/${doc.id}`)}>
                    <File className="h-4 w-4 mr-2" />
                    <span className="truncate">{doc.title || "Untitled Document"}</span>
                  </SidebarMenuButton>
                  <SidebarMenuAction
                    onClick={(e) => {
                      e.stopPropagation();
                      setDocumentToDelete(doc);
                      setIsDeleteDialogOpen(true);
                    }}
                    showOnHover
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </SidebarMenuAction>
                </SidebarMenuItem>
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
              onClick={() => documentToDelete && handleDelete(documentToDelete)}
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