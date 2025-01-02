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
import { NewDocumentButton } from "./NewDocumentButton";

type Content = Database["public"]["Tables"]["content"]["Row"];

interface DocumentListProps {
  documents: Content[];
}

export function DocumentList({ documents }: DocumentListProps) {
  const navigate = useNavigate();

  const handleDocumentClick = (docId: string) => {
    console.log("Navigating to document:", docId);
    navigate(`/write/${docId}`);
  };

  return (
    <SidebarGroup>
      <div className="px-2 mb-2">
        <NewDocumentButton />
      </div>
      <SidebarGroupLabel>Documents</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {documents.map((doc) => (
            <SidebarMenuItem key={doc.id} onClick={() => handleDocumentClick(doc.id)}>
              <SidebarMenuButton>
                <File className="h-4 w-4 mr-2" />
                <span>{doc.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}