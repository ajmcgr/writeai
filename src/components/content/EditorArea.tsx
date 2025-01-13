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
    if (editorRef.current && content !== editorRef.current.innerText) {
      editorRef.current.innerText = content;
    }
  }, [content]);

  const handleInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerText);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);
      if (range) {
        range.insertNode(document.createTextNode('    '));
        range.collapse(false);
      }
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
        className="w-full h-full p-4 overflow-y-auto focus:outline-none text-base leading-relaxed whitespace-pre-wrap
          empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground 
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      />
    </div>
  );
};