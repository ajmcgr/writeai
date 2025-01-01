import { useEffect, useState } from "react";
import { File, FolderOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { Database } from "@/integrations/supabase/types";

type Content = Database["public"]["Tables"]["content"]["Row"];

export function DocumentSidebar() {
  const [documents, setDocuments] = useState<Content[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
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

    // Subscribe to changes
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

  const drafts = documents.filter((doc) => doc.is_draft);
  const published = documents.filter((doc) => !doc.is_draft);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Drafts</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {drafts.map((doc) => (
                <SidebarMenuItem key={doc.id}>
                  <SidebarMenuButton
                    onClick={() => navigate(`/write/${doc.id}`)}
                    tooltip={doc.title}
                  >
                    <FolderOpen className="h-4 w-4" />
                    <span>{doc.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Published</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {published.map((doc) => (
                <SidebarMenuItem key={doc.id}>
                  <SidebarMenuButton
                    onClick={() => navigate(`/write/${doc.id}`)}
                    tooltip={doc.title}
                  >
                    <File className="h-4 w-4" />
                    <span>{doc.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}