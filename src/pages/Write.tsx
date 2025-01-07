import { useState, useEffect } from "react";
import { WritingInterface } from "@/components/content/WritingInterface";
import { useToast } from "@/hooks/use-toast";
import { useWriteAuth } from "@/hooks/useWriteAuth";
import { AuthCheck } from "@/components/auth/AuthCheck";
import { supabase } from "@/integrations/supabase/client";
import { LoadingState } from "@/components/ui/loading-state";

const Write = () => {
  const [content, setContent] = useState("<p>Start writing here...</p>");
  const [title, setTitle] = useState("");
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentContentId, setCurrentContentId] = useState<string | null>(null);
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useWriteAuth();

  useEffect(() => {
    console.log("Write component mounted, auth status:", isAuthenticated);
    console.log("Current content:", content);
    console.log("Current title:", title);
  }, [isAuthenticated, content, title]);

  const handleSaveDraft = async (newTitle?: string) => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to save drafts",
          variant: "destructive",
        });
        return;
      }

      const draftData = {
        user_id: session.user.id,
        title: newTitle || title,
        content: content,
        type: 'draft',
        is_draft: true,
      };

      const { data, error } = await supabase
        .from('content')
        .insert([draftData])
        .select()
        .single();

      if (error) {
        console.error("Error saving draft:", error);
        toast({
          title: "Error",
          description: "Failed to save draft. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setCurrentContentId(data.id);
      toast({
        title: "Success",
        description: "Draft saved successfully",
      });
    } catch (error) {
      console.error("Error in handleSaveDraft:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    console.log("Exporting content");
  };

  const handleCopy = async () => {
    try {
      const selection = window.getSelection();
      const selectedText = selection?.toString() || '';
      
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
    console.log("Opening history");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File uploaded:", event.target.files?.[0]);
  };

  const handleRewrite = async () => {
    console.log("Rewriting content");
  };

  const handleAnalyze = async () => {
    console.log("Analyzing content");
  };

  if (authLoading) {
    return <LoadingState />;
  }

  if (!isAuthenticated) {
    return <AuthCheck isAuthenticated={false} />;
  }

  console.log("Rendering WritingInterface with content:", content);

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