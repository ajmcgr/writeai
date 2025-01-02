import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/layout/Navigation";
import { FormattingToolbar } from "@/components/content/FormattingToolbar";
import { VersionHistory } from "@/components/content/VersionHistory";
import { DocumentSidebar } from "@/components/content/DocumentSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { EditorArea } from "@/components/content/EditorArea";
import { AnalysisSidebar } from "@/components/content/AnalysisSidebar";
import { AuthCheck } from "@/components/auth/AuthCheck";

const Write = () => {
  const { id } = useParams();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentContentId, setCurrentContentId] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const loadDocument = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from("content")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error loading document:", error);
        toast({
          title: "Error",
          description: "Failed to load document",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setContent(data.content);
        setCurrentContentId(data.id);
      }
    };

    loadDocument();
  }, [id, toast]);

  const saveDraft = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save drafts",
          variant: "destructive",
        });
        return;
      }

      let contentId = currentContentId;

      if (!contentId) {
        const { data: newContent, error: contentError } = await supabase
          .from('content')
          .insert({
            content,
            type: 'press_release',
            title: 'Draft Press Release',
            is_draft: true,
            user_id: session.user.id
          })
          .select()
          .single();

        if (contentError) throw contentError;
        contentId = newContent.id;
        setCurrentContentId(contentId);
      } else {
        const { error: updateError } = await supabase
          .from('content')
          .update({ 
            content, 
            updated_at: new Date().toISOString(),
            user_id: session.user.id
          })
          .eq('id', contentId);

        if (updateError) throw updateError;
      }

      const { data: versions } = await supabase
        .from('content_versions')
        .select('version')
        .eq('content_id', contentId)
        .order('version', { ascending: false })
        .limit(1);

      const nextVersion = versions && versions.length > 0 ? versions[0].version + 1 : 1;

      await supabase
        .from('content_versions')
        .insert({
          content_id: contentId,
          content,
          version: nextVersion
        });

      setLastSaved(new Date());
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
  }, [content, currentContentId, toast]);

  useEffect(() => {
    if (!content || !currentContentId) return;

    console.log("Setting up auto-save timer...");
    const timer = setTimeout(() => {
      console.log("Auto-saving document...");
      saveDraft();
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, [content, currentContentId, saveDraft]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/plain" && file.type !== "application/msword" && 
        file.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      toast({
        title: "Invalid file type",
        description: "Please upload a .txt or .doc/.docx file",
        variant: "destructive",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data, error } = await supabase.functions.invoke("process-document", {
        body: formData,
      });

      if (error) throw error;
      setContent(data.text);
    } catch (error) {
      console.error("Error processing document:", error);
      toast({
        title: "Error",
        description: "Failed to process document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatText = (type: string) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let formattedText = '';
    switch (type) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `_${selectedText}_`;
        break;
      case 'heading':
        formattedText = `# ${selectedText}`;
        break;
      case 'bullet':
        formattedText = `• ${selectedText}`;
        break;
      case 'number':
        formattedText = `1. ${selectedText}`;
        break;
      default:
        return;
    }

    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);
  };

  const exportToDocx = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("export-to-docx", {
        body: { content },
      });

      if (error) throw error;

      const link = document.createElement('a');
      link.href = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${data.file}`;
      link.download = 'press_release.docx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting to DOCX:", error);
      toast({
        title: "Error",
        description: "Failed to export document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
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

  const rewriteContent = async () => {
    if (!content) {
      toast({
        title: "No content",
        description: "Please enter some content to rewrite.",
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
      
      // Replace the existing content with the generated content
      setContent(data.generatedText);
      
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to rewrite content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeContent = async () => {
    if (!content) {
      toast({
        title: "No content",
        description: "Please enter some content to analyze.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsAnalyzing(true);
      const { data, error } = await supabase.functions.invoke("analyze-content", {
        body: { content }
      });

      if (error) throw error;
      setAnalysis(data.analysis);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to analyze content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applySuggestion = (suggestion: string) => {
    setContent(suggestion);
  };

  if (!isAuthenticated) {
    return <AuthCheck isAuthenticated={isAuthenticated} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <SidebarProvider>
        <div className="container flex-grow py-8 mt-16 flex w-full relative">
          <DocumentSidebar />
          <div className="flex flex-1">
            <EditorArea 
              content={content}
              setContent={setContent}
            />
            <AnalysisSidebar 
              analysis={analysis} 
              onApply={applySuggestion}
            />
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-50">
          <div className="container max-w-screen-xl mx-auto">
            <FormattingToolbar
              onFormat={formatText}
              onExport={exportToDocx}
              onCopy={copyToClipboard}
              onHistory={() => setShowVersionHistory(true)}
              onFileUpload={handleFileUpload}
              onRewrite={rewriteContent}
              onAnalyze={analyzeContent}
              isLoading={isLoading || isAnalyzing}
              hasContent={!!content}
              hasContentId={!!currentContentId}
            />
          </div>
        </div>
      </SidebarProvider>

      <VersionHistory
        contentId={currentContentId}
        onVersionSelect={setContent}
        isOpen={showVersionHistory}
        onOpenChange={setShowVersionHistory}
      />
    </div>
  );
};

export default Write;
