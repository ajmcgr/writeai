import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import type { Database } from "@/integrations/supabase/types";
import { DocumentList } from "./DocumentList";
import { NewDocumentButton } from "./NewDocumentButton";
import { useToast } from "@/hooks/use-toast";

type Content = Database["public"]["Tables"]["content"]["Row"];

export function DocumentSidebar() {
  const [documents, setDocuments] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log("No session found, skipping document fetch");
        setDocuments([]);
        return;
      }

      console.log("Fetching documents for user:", session.user.id);
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .eq("user_id", session.user.id)
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("Error fetching documents:", error);
        toast({
          title: "Error",
          description: "Failed to load documents. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log("Documents fetched successfully:", data?.length || 0);
      setDocuments(data || []);
    } catch (error) {
      console.error("Error in fetchDocuments:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();

    // Set up real-time subscription for document changes
    const channel = supabase
      .channel("document_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "content",
        },
        async (payload) => {
          console.log("Document changes detected:", payload);
          const { eventType } = payload;
          const newRecord = payload.new as Content;
          const oldRecord = payload.old as Content;

          try {
            // Only update if the change is for the current user's documents
            const { data: { session } } = await supabase.auth.getSession();
            if (!session || newRecord.user_id !== session.user.id) {
              return;
            }

            setDocuments(currentDocs => {
              switch (eventType) {
                case "INSERT":
                  return [newRecord, ...currentDocs];
                case "UPDATE":
                  return currentDocs.map(doc => 
                    doc.id === newRecord.id ? newRecord : doc
                  );
                case "DELETE":
                  return currentDocs.filter(doc => doc.id !== oldRecord.id);
                default:
                  return currentDocs;
              }
            });
          } catch (error) {
            console.error("Error handling document change:", error);
          }
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    return () => {
      console.log("Cleaning up subscription");
      channel.unsubscribe();
    };
  }, []);

  return (
    <Sidebar>
      <SidebarHeader className="p-2">
        <NewDocumentButton />
      </SidebarHeader>
      <SidebarContent>
        <DocumentList documents={documents} />
      </SidebarContent>
    </Sidebar>
  );
}