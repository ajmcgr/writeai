import { Textarea } from "@/components/ui/textarea";

interface EditorAreaProps {
  content: string;
  setContent: (content: string) => void;
  title: string;
  setTitle: (title: string) => void;
}

export const EditorArea = ({ content, setContent, title, setTitle }: EditorAreaProps) => {
  return (
    <div className="flex-1">
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
        style={{ display: 'none' }}
      />
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start writing or generate content..."
        className="min-h-[calc(100vh-200px)] w-full p-4 resize-none border-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-xl leading-relaxed"
      />
    </div>
  );
};