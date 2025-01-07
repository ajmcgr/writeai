import { useState } from "react";
import { WritingInterface } from "@/components/content/WritingInterface";
import { useToast } from "@/hooks/use-toast";

const Write = () => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentContentId, setCurrentContentId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSaveDraft = async (newTitle?: string) => {
    // ... Implement save draft functionality
    console.log("Saving draft with title:", newTitle);
  };

  const handleExport = async () => {
    // ... Implement export functionality
    console.log("Exporting content");
  };

  const handleCopy = async () => {
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

  const handleHistory = () => {
    // ... Implement history functionality
    console.log("Opening history");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    // ... Implement file upload functionality
    console.log("File uploaded:", event.target.files?.[0]);
  };

  const handleRewrite = async () => {
    // ... Implement rewrite functionality
    console.log("Rewriting content");
  };

  const handleAnalyze = async () => {
    // ... Implement analyze functionality
    console.log("Analyzing content");
  };

  return (
    <WritingInterface
      content={content}
      setContent={setContent}
      title={title}
      setTitle={setTitle}
      onSaveDraft={handleSaveDraft}
      onExport={handleExport}
      onCopy={handleCopy}
      onHistory={handleHistory}
      onFileUpload={handleFileUpload}
      onRewrite={handleRewrite}
      onAnalyze={handleAnalyze}
      isLoading={isLoading}
      analysis={analysis}
      currentContentId={currentContentId}
    />
  );
};

export default Write;
