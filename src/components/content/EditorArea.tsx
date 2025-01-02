import { Textarea } from "@/components/ui/textarea";

interface EditorAreaProps {
  content: string;
  setContent: (content: string) => void;
}

export const EditorArea = ({ content, setContent }: EditorAreaProps) => {
  return (
    <div className="flex-1 space-y-6 px-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start writing or generate content..."
        className="min-h-[calc(100vh-400px)] w-full p-4 resize-none border-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
};