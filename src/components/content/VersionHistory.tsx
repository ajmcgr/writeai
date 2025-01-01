import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type ContentVersion = Database["public"]["Tables"]["content_versions"]["Row"];

interface VersionHistoryProps {
  contentId: string | null;
  onVersionSelect: (content: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const VersionHistory = ({
  contentId,
  onVersionSelect,
  isOpen,
  onOpenChange,
}: VersionHistoryProps) => {
  const [versions, setVersions] = useState<ContentVersion[]>([]);
  const { toast } = useToast();

  const loadVersionHistory = async () => {
    if (!contentId) return;

    try {
      const { data, error } = await supabase
        .from("content_versions")
        .select("*")
        .eq("content_id", contentId)
        .order("version", { ascending: false });

      if (error) throw error;
      setVersions(data);
    } catch (error) {
      console.error("Error loading version history:", error);
      toast({
        title: "Error",
        description: "Failed to load version history. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Load versions when dialog opens
  if (isOpen && versions.length === 0) {
    loadVersionHistory();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Version History</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {versions.map((version) => (
            <div
              key={version.id}
              className="p-4 border rounded-lg cursor-pointer hover:bg-accent"
              onClick={() => {
                onVersionSelect(version.content);
                onOpenChange(false);
              }}
            >
              <div className="flex justify-between items-center">
                <span>Version {version.version}</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(version.created_at!).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};