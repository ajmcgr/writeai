import { File } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Database } from "@/integrations/supabase/types";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

type Content = Database["public"]["Tables"]["content"]["Row"];

interface DocumentListProps {
  documents: Content[];
}

export function DocumentList({ documents }: DocumentListProps) {
  const navigate = useNavigate();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Documents</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {documents.length === 0 ? (
            <SidebarMenuItem>
              <span className="text-sm text-muted-foreground px-2">
                No documents yet
              </span>
            </SidebarMenuItem>
          ) : (
            documents.map((doc) => (
              <SidebarMenuItem key={doc.id} onClick={() => navigate(`/write/${doc.id}`)}>
                <SidebarMenuButton>
                  <File className="h-4 w-4 mr-2" />
                  <span>{doc.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}