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
      // If content is plain text, convert it to rich text format
      if (!content.includes('<p>')) {
        const formattedContent = content
          .split('\n\n')
          .map(paragraph => `<p>${paragraph.trim()}</p>`)
          .join('');
        editorRef.current.innerHTML = formattedContent;
      } else {
        editorRef.current.innerHTML = content;
      }
    }
  }, [content]);

  const handleInput = () => {
    if (editorRef.current) {
      // Preserve rich text formatting when saving content
      setContent(editorRef.current.innerHTML);
    }
  };

  // Enable rich text formatting commands
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
    }

    // Handle list indentation
    if (e.key === 'Tab' && !e.shiftKey) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const listItem = range.commonAncestorContainer.parentElement?.closest('li');
        if (listItem) {
          e.preventDefault();
          document.execCommand('indent');
        }
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
        className="w-full h-full p-4 overflow-y-auto focus:outline-none text-base leading-relaxed 
          empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground 
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] 
          [&>p]:mb-4 [&>ul]:list-disc [&>ul]:ml-6 [&>ol]:list-decimal [&>ol]:ml-6
          prose prose-sm max-w-none"
      />
    </div>
  );
};