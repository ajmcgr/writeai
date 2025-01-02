import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface EditorAreaProps {
  content: string;
  setContent: (content: string) => void;
  title: string;
  setTitle: (title: string) => void;
}

export const EditorArea = ({ content, setContent, title, setTitle }: EditorAreaProps) => {
  return (
    <div className="flex-1 space-y-6 px-4">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter your document title..."
        className="text-2xl font-semibold border-none text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start writing or generate content..."
        className="min-h-[calc(100vh-400px)] w-full p-4 resize-none border-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
};