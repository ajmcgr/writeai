import { ScrollArea } from "@/components/ui/scroll-area";

interface AnalysisSidebarProps {
  analysis: string | null;
}

export const AnalysisSidebar = ({ analysis }: AnalysisSidebarProps) => {
  if (!analysis) return null;

  return (
    <div className="w-80 border-l border-border bg-background p-4">
      <h3 className="text-lg font-semibold mb-4">AI Analysis</h3>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="pr-4 whitespace-pre-wrap">{analysis}</div>
      </ScrollArea>
    </div>
  );
};