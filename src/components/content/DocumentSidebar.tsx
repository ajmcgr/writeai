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
            if (!session) {
              console.log("No session found, skipping real-time update");
              return;
            }

            // For delete events, we check the old record's user_id
            const relevantUserId = eventType === "DELETE" ? oldRecord?.user_id : newRecord?.user_id;
            
            if (relevantUserId !== session.user.id) {
              console.log("Change not relevant to current user, skipping update");
              return;
            }

            console.log(`Processing ${eventType} event for document`);
            
            // Update the documents state based on the event type
            setDocuments(currentDocs => {
              switch (eventType) {
                case "INSERT":
                  console.log("Adding new document to list");
                  return [newRecord, ...currentDocs];
                
                case "UPDATE":
                  console.log("Updating existing document in list");
                  const updatedDocs = currentDocs.map(doc => 
                    doc.id === newRecord.id ? newRecord : doc
                  );
                  // Sort by updated_at to maintain order
                  return updatedDocs.sort((a, b) => 
                    new Date(b.updated_at || '').getTime() - new Date(a.updated_at || '').getTime()
                  );
                
                case "DELETE":
                  console.log("Removing document from list");
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
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Sidebar className="mt-[65px]">
      <SidebarHeader className="p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <NewDocumentButton />
      </SidebarHeader>
      <SidebarContent>
        <DocumentList documents={documents} />
      </SidebarContent>
    </Sidebar>
  );
}