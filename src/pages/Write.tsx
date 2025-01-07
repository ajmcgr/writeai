import { useState, useEffect } from "react";
import { WritingInterface } from "@/components/content/WritingInterface";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Write = () => {
  const [content, setContent] = useState<string>("<p>Start writing your content here...</p>");
  const [title, setTitle] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [currentContentId, setCurrentContentId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSaveDraft = async (newTitle?: string) => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast({
          title: "Error",
          description: "You must be signed in to save drafts",
          variant: "destructive",
        });
        return;
      }

      const draftData = {
        title: newTitle || title,
        content,
        type: 'press_release',
        is_draft: true,
        user_id: session.user.id,
      };

      if (currentContentId) {
        const { error: updateError } = await supabase
          .from('content')
          .update(draftData)
          .eq('id', currentContentId);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('content')
          .insert([draftData]);

        if (insertError) throw insertError;
      }

      toast({
        title: "Success",
        description: "Draft saved successfully",
      });
    } catch (error) {
      console.error("Error saving draft:", error);
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const blob = new Blob([content], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title || 'document'}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting content:", error);
      toast({
        title: "Error",
        description: "Failed to export content. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(content);
      toast({
        title: "Success",
        description: "Content copied to clipboard",
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
    if (!currentContentId) {
      toast({
        title: "Error",
        description: "Save your content first to access version history",
        variant: "destructive",
      });
      return;
    }
    // Version history logic will be implemented here
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === 'string') {
        setContent(text);
      }
    };
    reader.readAsText(file);
  };

  const handleRewrite = async () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter some content to rewrite",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke("generate-content", {
        body: { type: "rewrite", content }
      });

      if (error) throw error;
      setContent(data.generatedText);
      
    } catch (error) {
      console.error("Error rewriting content:", error);
      toast({
        title: "Error",
        description: "Failed to rewrite content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter some content to analyze",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke("generate-content", {
        body: { type: "analyze", content }
      });

      if (error) throw error;
      setAnalysis(data.analysis);
      
    } catch (error) {
      console.error("Error analyzing content:", error);
      toast({
        title: "Error",
        description: "Failed to analyze content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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