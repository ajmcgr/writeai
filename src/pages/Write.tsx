import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { FormattingToolbar } from "@/components/content/FormattingToolbar";
import { VersionHistory } from "@/components/content/VersionHistory";
import { DocumentSidebar } from "@/components/content/DocumentSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AIActions } from "@/components/content/AIActions";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Write = () => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentContentId, setCurrentContentId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/signin");
      }
    };
    checkAuth();
  }, [navigate]);

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

  const saveDraft = async () => {
    try {
      setIsLoading(true);
      let contentId = currentContentId;

      if (!contentId) {
        const { data: newContent, error: contentError } = await supabase
          .from('content')
          .insert({
            content,
            type: 'press_release',
            title: 'Draft Press Release',
            is_draft: true
          })
          .select()
          .single();

        if (contentError) throw contentError;
        contentId = newContent.id;
        setCurrentContentId(contentId);
      } else {
        const { error: updateError } = await supabase
          .from('content')
          .update({ content, updated_at: new Date().toISOString() })
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <SidebarProvider>
        <div className="container flex-grow py-8 mt-16 flex w-full">
          <DocumentSidebar />
          <div className="flex-1 space-y-6">
            <FormattingToolbar
              onFormat={formatText}
              onSave={saveDraft}
              onExport={exportToDocx}
              onCopy={copyToClipboard}
              onHistory={() => setShowVersionHistory(true)}
              onFileUpload={handleFileUpload}
              isLoading={isLoading}
              hasContent={!!content}
              hasContentId={!!currentContentId}
            />

            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing or generate content..."
              className="min-h-[600px] p-4"
            />

            <AIActions
              content={content}
              onContentGenerated={setContent}
              onAnalysis={setAnalysis}
            />

            {analysis && (
              <Alert>
                <AlertDescription className="whitespace-pre-wrap">
                  {analysis}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </SidebarProvider>

      <VersionHistory
        contentId={currentContentId}
        onVersionSelect={setContent}
        isOpen={showVersionHistory}
        onOpenChange={setShowVersionHistory}
      />

      <Footer />
    </div>
  );
};

export default Write;