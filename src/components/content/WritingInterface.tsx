import { useState, useEffect } from "react";
import { EditorArea } from "./EditorArea";
import { FormattingToolbar } from "./FormattingToolbar";
import { AnalysisSidebar } from "./AnalysisSidebar";
import { AIPromptDialog } from "./AIPromptDialog";
import { SaveDraftDialog } from "./SaveDraftDialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface WritingInterfaceProps {
  content: string;
  setContent: (content: string) => void;
  title: string;
  setTitle: (title: string) => void;
  onSaveDraft: (title?: string) => void;
  onExport: () => void;
  onCopy: () => void;
  onHistory: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRewrite: () => void;
  onAnalyze: () => void;
  isLoading: boolean;
  analysis: string | null;
  currentContentId: string | null;
}

export const WritingInterface = ({
  content,
  setContent,
  title,
  setTitle,
  onSaveDraft,
  onExport,
  onCopy,
  onHistory,
  onFileUpload,
  onRewrite,
  onAnalyze,
  isLoading,
  analysis,
  currentContentId,
}: WritingInterfaceProps) => {
  const [showAnalysis, setShowAnalysis] = useState(true);
  const [editorContent, setEditorContent] = useState(content);
  const [showAIPrompt, setShowAIPrompt] = useState(true);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  useEffect(() => {
    setEditorContent(content);
  }, [content]);

  const formatText = (type: string) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editorContent.substring(start, end);
    let formattedText = selectedText;

    switch (type) {
      case 'bold':
        formattedText = `<strong>${selectedText}</strong>`;
        break;
      case 'italic':
        formattedText = `<em>${selectedText}</em>`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        break;
      case 'heading':
        formattedText = `<h2>${selectedText}</h2>`;
        break;
      case 'bullet':
        formattedText = `<li>${selectedText}</li>`;
        break;
      case 'number':
        formattedText = `<ol><li>${selectedText}</li></ol>`;
        break;
      default:
        return;
    }

    const newContent = editorContent.substring(0, start) + formattedText + editorContent.substring(end);
    setEditorContent(newContent);
    setContent(newContent);
  };

  const handleApplySuggestion = (suggestion: string) => {
    setContent(suggestion);
  };

  const handleSaveDraft = (newTitle?: string) => {
    onSaveDraft(newTitle);
  };

  return (
    <div className="flex flex-1">
      <div className="flex-1 flex flex-col">
        <AIPromptDialog 
          onContentGenerated={setContent} 
          isOpen={showAIPrompt} 
          onOpenChange={setShowAIPrompt}
        />
        <SaveDraftDialog
          isOpen={showSaveDialog}
          onOpenChange={setShowSaveDialog}
          content={content}
          onSave={handleSaveDraft}
        />
        <EditorArea
          content={editorContent}
          setContent={(newContent) => {
            setEditorContent(newContent);
            setContent(newContent);
          }}
          title={title}
          setTitle={setTitle}
        />
      </div>
      {analysis && showAnalysis && (
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={() => setShowAnalysis(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          <AnalysisSidebar
            analysis={analysis}
            onApply={handleApplySuggestion}
            content={content}
          />
        </div>
      )}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-50">
        <div className="container max-w-screen-xl mx-auto">
          <FormattingToolbar
            onFormat={formatText}
            onExport={onExport}
            onCopy={onCopy}
            onHistory={onHistory}
            onFileUpload={onFileUpload}
            onRewrite={onRewrite}
            onAnalyze={() => {
              setShowAnalysis(true);
              onAnalyze();
            }}
            onSaveDraft={() => setShowSaveDialog(true)}
            isLoading={isLoading}
            hasContent={!!content}
            hasContentId={!!currentContentId}
          />
        </div>
      </div>
    </div>
  );
};