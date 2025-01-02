import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import type { Database } from "@/integrations/supabase/types";
import { NewDocumentButton } from "./NewDocumentButton";
import { DocumentList } from "./DocumentList";

type Content = Database["public"]["Tables"]["content"]["Row"];

export function DocumentSidebar() {
  const [documents, setDocuments] = useState<Content[]>([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from("content")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching documents:", error);
        return;
      }

      setDocuments(data || []);
    };

    fetchDocuments();

    const channel = supabase
      .channel("document_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "content",
        },
        () => {
          fetchDocuments();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <NewDocumentButton />
        <h2 className="text-lg font-semibold mt-4">Documents</h2>
      </SidebarHeader>
      <SidebarContent>
        <DocumentList documents={documents} />
      </SidebarContent>
    </Sidebar>
  );
}