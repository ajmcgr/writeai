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

  // Make fetchDocuments available globally for manual refresh
  if (typeof window !== 'undefined') {
    (window as any).refreshDocuments = fetchDocuments;
  }

  useEffect(() => {
    fetchDocuments();
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