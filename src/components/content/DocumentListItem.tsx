import { File } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Database } from "@/integrations/supabase/types";
import {
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { DocumentListActions } from "./DocumentListActions";

type Content = Database["public"]["Tables"]["content"]["Row"];

interface DocumentListItemProps {
  document: Content;
  onDelete: (document: Content) => void;
  onDuplicate: (document: Content) => void;
}

export function DocumentListItem({ document, onDelete, onDuplicate }: DocumentListItemProps) {
  const navigate = useNavigate();

  return (
    <SidebarMenuItem key={document.id}>
      <SidebarMenuButton 
        onClick={() => navigate(`/write/${document.id}`)}
        className="group relative pr-[90px]"
      >
        <File className="h-4 w-4 mr-2" />
        <span className="truncate max-w-[calc(100%-90px)]">
          {document.title || "Untitled Document"}
        </span>
      </SidebarMenuButton>
      <DocumentListActions 
        document={document}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
      />
    </SidebarMenuItem>
  );
}