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
}

export function DocumentListItem({ document, onDelete }: DocumentListItemProps) {
  const navigate = useNavigate();

  return (
    <SidebarMenuItem key={document.id}>
      <SidebarMenuButton 
        onClick={() => navigate(`/write/${document.id}`)}
        className="group relative pr-[90px] w-full"
      >
        <div className="flex items-center w-full">
          <File className="h-4 w-4 mr-2 shrink-0" />
          <span className="truncate">
            {document.title || "Untitled Document"}
          </span>
        </div>
        <DocumentListActions 
          document={document}
          onDelete={onDelete}
        />
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}