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
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const handleInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="flex-1 h-[calc(100vh-200px)] overflow-hidden">
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="w-full h-full p-4 overflow-y-auto focus:outline-none text-xl leading-relaxed"
        placeholder="Start writing or generate content..."
      />
    </div>
  );
};