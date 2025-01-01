import { useEffect, useState } from "react";
import { File, FilePlus, FolderOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { Database } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";

type Content = Database["public"]["Tables"]["content"]["Row"];

export function DocumentSidebar() {
  const [documents, setDocuments] = useState<Content[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const createNewDocument = async () => {
    if (isCreating) return;

    try {
      setIsCreating(true);
      const { data, error } = await supabase
        .from("content")
        .insert({
          title: "Untitled Document",
          content: "",
          type: "press_release",
          is_draft: true,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        navigate(`/write/${data.id}`);
        toast({
          title: "Success",
          description: "New document created",
        });
      }
    } catch (error) {
      console.error("Error creating document:", error);
      toast({
        title: "Error",
        description: "Failed to create new document",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const drafts = documents.filter((doc) => doc.is_draft);
  const published = documents.filter((doc) => !doc.is_draft);

  return (
    <Sidebar>
      <SidebarHeader className="p-2">
        <Button
          onClick={createNewDocument}
          disabled={isCreating}
          className="w-full"
          size="sm"
        >
          <FilePlus className="h-4 w-4" />
          <span>New Document</span>
        </Button>
      </SidebarHeader>
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