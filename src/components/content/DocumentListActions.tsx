import { Trash2 } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { SidebarMenuAction } from "@/components/ui/sidebar";

type Content = Database["public"]["Tables"]["content"]["Row"];

interface DocumentListActionsProps {
  document: Content;
  onDelete: (document: Content) => void;
}

export function DocumentListActions({ document, onDelete }: DocumentListActionsProps) {
  return (
    <div className="flex items-center gap-1.5 w-[85px] justify-end opacity-0 group-hover:opacity-100 absolute right-2 bg-sidebar/80 backdrop-blur-sm">
      <SidebarMenuAction
        onClick={(e) => {
          e.stopPropagation();
          onDelete(document);
        }}
        showOnHover
        className="hover:bg-sidebar-accent rounded-md p-1.5 transition-colors"
        title="Delete"
      >
        <Trash2 className="h-3.5 w-3.5 text-destructive hover:text-destructive/90 transition-colors" />
      </SidebarMenuAction>
    </div>
  );
}