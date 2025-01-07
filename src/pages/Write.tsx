import { useState, useEffect } from "react";
import { WritingInterface } from "@/components/content/WritingInterface";
import { useToast } from "@/hooks/use-toast";
import { useWriteAuth } from "@/hooks/useWriteAuth";
import { AuthCheck } from "@/components/auth/AuthCheck";
import { supabase } from "@/integrations/supabase/client";

const Write = () => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentContentId, setCurrentContentId] = useState<string | null>(null);
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useWriteAuth();

  useEffect(() => {
    console.log("Write component mounted, auth status:", isAuthenticated);
  }, [isAuthenticated]);

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
    // Export functionality to be implemented
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
    // History functionality to be implemented
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File uploaded:", event.target.files?.[0]);
    // File upload functionality to be implemented
  };

  const handleRewrite = async () => {
    console.log("Rewriting content");
    // Rewrite functionality to be implemented
  };

  const handleAnalyze = async () => {
    console.log("Analyzing content");
    // Analysis functionality to be implemented
  };

  if (authLoading) {
    return null; // or a loading spinner
  }

  if (!isAuthenticated) {
    return <AuthCheck isAuthenticated={false} />;
  }

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