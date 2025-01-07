import { useState } from "react";
import { EditorArea } from "@/components/content/EditorArea";
import { FormattingToolbar } from "@/components/content/FormattingToolbar";
import { AnalysisSidebar } from "@/components/content/AnalysisSidebar";
import { AIPromptDialog } from "@/components/content/AIPromptDialog";
import { SaveDraftDialog } from "@/components/content/SaveDraftDialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

const WritingInterface = ({
  content,
  setContent,
  title,
  setTitle,
  onSaveDraft,
  onExport,
  onHistory,
  onFileUpload,
  onRewrite,
  onAnalyze,
  isLoading,
  analysis,
  currentContentId,
}: WritingInterfaceProps) => {
  const [showAnalysis, setShowAnalysis] = useState(true);
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const { toast } = useToast();

  const formatText = (type: string) => {
    document.execCommand(type, false);
  };

  const handleApplySuggestion = (suggestion: string) => {
    setContent(suggestion);
  };

  const handleSaveDraft = (newTitle?: string) => {
    onSaveDraft(newTitle);
  };

  const copyToClipboard = async () => {
    try {
      const selection = window.getSelection();
      const selectedText = selection?.toString() || '';
      
      // If there's selected text, copy that. Otherwise, copy all content
      const textToCopy = selectedText || content;
      
      await navigator.clipboard.writeText(textToCopy);
      toast({
        title: "Success",
        description: selectedText 
          ? "Selected text copied to clipboard" 
          : "Content copied to clipboard",
      });
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast({
        title: "Error",
        description: "Failed to copy content. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-1">
      <div className="flex-1 flex flex-col h-[calc(100vh-64px)] relative">
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
        <div className="flex-1 overflow-hidden">
          <EditorArea
            content={content}
            setContent={setContent}
            title={title}
            setTitle={setTitle}
          />
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border z-50">
          <div className="container max-w-screen-xl mx-auto">
            <FormattingToolbar
              onFormat={formatText}
              onExport={onExport}
              onCopy={copyToClipboard}
              onHistory={onHistory}
              onFileUpload={onFileUpload}
              onRewrite={onRewrite}
              onAnalyze={onAnalyze}
              onAIGenerate={() => setShowAIPrompt(true)}
              onSaveDraft={() => setShowSaveDialog(true)}
              isLoading={isLoading}
              hasContent={!!content}
              hasContentId={!!currentContentId}
            />
          </div>
        </div>
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
      {isLoading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="bg-background/95 backdrop-blur-sm p-8 rounded-lg shadow-lg flex flex-col items-center space-y-4">
            <div className="w-12 h-12">
              <svg className="animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            <p className="text-sm font-medium">AI is processing your request...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WritingInterface;