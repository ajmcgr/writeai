import { useState, useEffect } from "react";
import { EditorArea } from "./EditorArea";
import { FormattingToolbar } from "./FormattingToolbar";
import { AnalysisSidebar } from "./AnalysisSidebar";
import { AIPromptDialog } from "./AIPromptDialog";
import { SaveDraftDialog } from "./SaveDraftDialog";
import { Button } from "@/components/ui/button";
import { X, Save, FileText, Copy, History, Upload, Wand2, LineChart } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const isMobile = useIsMobile();

  const formatText = (type: string) => {
    document.execCommand(type, false);
  };

  const handleApplySuggestion = (suggestion: string) => {
    setContent(suggestion);
  };

  const handleSaveDraft = (newTitle?: string) => {
    onSaveDraft(newTitle);
  };

  const MobileBottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 flex justify-around items-center md:hidden">
      <Button
        variant="ghost"
        size="sm"
        className="flex flex-col items-center text-xs gap-1"
        onClick={() => setShowSaveDialog(true)}
      >
        <Save className="h-5 w-5" />
        Save
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="flex flex-col items-center text-xs gap-1"
        onClick={onExport}
      >
        <FileText className="h-5 w-5" />
        Export
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="flex flex-col items-center text-xs gap-1"
        onClick={onCopy}
      >
        <Copy className="h-5 w-5" />
        Copy
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="flex flex-col items-center text-xs gap-1"
        onClick={onHistory}
      >
        <History className="h-5 w-5" />
        History
      </Button>
    </div>
  );

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
        <div className="flex-1 overflow-hidden pb-16 md:pb-0">
          <EditorArea
            content={content}
            setContent={setContent}
            title={title}
            setTitle={setTitle}
          />
        </div>
        {!isMobile && (
          <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border z-50">
            <div className="container max-w-screen-xl mx-auto">
              <FormattingToolbar
                onFormat={formatText}
                onExport={onExport}
                onCopy={onCopy}
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
        )}
        {isMobile && <MobileBottomNav />}
      </div>
      {analysis && showAnalysis && (
        <div className={`relative ${isMobile ? 'fixed inset-0 z-50 bg-white' : ''}`}>
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