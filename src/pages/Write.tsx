import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/layout/Navigation";
import { VersionHistory } from "@/components/content/VersionHistory";
import { DocumentSidebar } from "@/components/content/DocumentSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthCheck } from "@/components/auth/AuthCheck";
import { useUsageCheck } from "@/utils/usageCheck";
import { WritingInterface } from "@/components/content/WritingInterface";

const Write = () => {
  const { id } = useParams();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("Untitled Document");
  const [isLoading, setIsLoading] = useState(false);
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
        setTitle(data.title || "Untitled Document");
        setCurrentContentId(data.id);
      }
    };

    loadDocument();
  }, [id, toast]);

  const { checkUsageLimit } = useUsageCheck();

  const saveDraft = useCallback(async () => {
    try {
      const canProceed = await checkUsageLimit();
      if (!canProceed) return;

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
            title,
            type: 'press_release',
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
            title,
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
  }, [content, title, currentContentId, toast, checkUsageLimit]);

  useEffect(() => {
    if (!content || !currentContentId) return;

    console.log("Setting up auto-save timer...");
    const timer = setTimeout(() => {
      console.log("Auto-saving document...");
      saveDraft();
    }, 10000);

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

  const exportToDocx = async () => {
    const canProceed = await checkUsageLimit();
    if (!canProceed) return;

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
    const canProceed = await checkUsageLimit();
    if (!canProceed) return;

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
      setIsLoading(true);
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
      setIsLoading(false);
    }
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
          <WritingInterface
            content={content}
            setContent={setContent}
            title={title}
            setTitle={setTitle}
            onSaveDraft={saveDraft}
            onExport={exportToDocx}
            onCopy={copyToClipboard}
            onHistory={() => setShowVersionHistory(true)}
            onFileUpload={handleFileUpload}
            onRewrite={rewriteContent}
            onAnalyze={analyzeContent}
            isLoading={isLoading}
            analysis={analysis}
            currentContentId={currentContentId}
          />
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