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
    if (editorRef.current && content && content !== editorRef.current.innerHTML) {
      console.log("Setting editor content:", content);
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const handleInput = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      console.log("Editor content changed:", newContent);
      setContent(newContent);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
    }
  };

  return (
    <div className="flex-1 h-full overflow-hidden pb-24">
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        data-placeholder="Start writing, generate content with AI or upload a document..."
        className="w-full h-full p-4 overflow-y-auto focus:outline-none text-base leading-relaxed 
          empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground 
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] 
          [&>p]:mb-4 [&>ul]:list-disc [&>ul]:ml-6 [&>ol]:list-decimal [&>ol]:ml-6
          prose prose-sm max-w-none"
      />
    </div>
  );
};