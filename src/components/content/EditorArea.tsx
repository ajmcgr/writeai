import { useEffect, useRef } from "react";

interface EditorAreaProps {
  content: string;
  setContent: (content: string) => void;
  title: string;
  setTitle: (title: string) => void;
}

export const EditorArea = ({ content, setContent, title, setTitle }: EditorAreaProps) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      // Replace newlines with <br> tags for proper spacing
      const formattedContent = content.split('\n\n').join('<br><br>');
      editorRef.current.innerHTML = formattedContent;
    }
  }, [content]);

  const handleInput = () => {
    if (editorRef.current) {
      // Convert <br> tags back to newlines when saving content
      const rawContent = editorRef.current.innerHTML;
      const cleanContent = rawContent
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]*>/g, '')
        .replace(/\n{3,}/g, '\n\n'); // Normalize multiple newlines to double newlines
      setContent(cleanContent);
    }
  };

  return (
    <div className="flex-1 h-full overflow-hidden pb-24">
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        data-placeholder="Start writing, generate content with AI or upload a document..."
        className="w-full h-full p-4 overflow-y-auto focus:outline-none text-base leading-relaxed empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&>p]:mb-4"
      />
    </div>
  );
};