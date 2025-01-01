import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Bold, Italic, Underline, Heading1, List, ListOrdered, Image, Save, FileText, Copy, History } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Write = () => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [versions, setVersions] = useState<any[]>([]);
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

      // Save version
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

      // Create a link to download the file
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

  const loadVersionHistory = async () => {
    if (!currentContentId) return;

    try {
      const { data, error } = await supabase
        .from('content_versions')
        .select('*')
        .eq('content_id', currentContentId)
        .order('version', { ascending: false });

      if (error) throw error;
      setVersions(data);
      setShowVersionHistory(true);
    } catch (error) {
      console.error("Error loading version history:", error);
      toast({
        title: "Error",
        description: "Failed to load version history. Please try again.",
        variant: "destructive",
      });
    }
  };

  const restoreVersion = (versionContent: string) => {
    setContent(versionContent);
    setShowVersionHistory(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <div className="container flex-grow py-8 mt-16">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => formatText('bold')}
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Bold</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => formatText('italic')}
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Italic</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => formatText('underline')}
                    >
                      <Underline className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Underline</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => formatText('heading')}
                    >
                      <Heading1 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Heading</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => formatText('bullet')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Bullet List</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => formatText('number')}
                    >
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Numbered List</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={saveDraft}
                      disabled={isLoading}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Draft
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Save Draft</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={exportToDocx}
                      disabled={!content}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Export to DOCX
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Export to DOCX</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={copyToClipboard}
                      disabled={!content}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy to Clipboard</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={loadVersionHistory}
                      disabled={!currentContentId}
                    >
                      <History className="h-4 w-4 mr-2" />
                      History
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Version History</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept=".txt,.doc,.docx"
                        onChange={handleFileUpload}
                      />
                      <label htmlFor="file-upload">
                        <Button variant="outline" className="cursor-pointer">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                      </label>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Upload Document</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing or generate content..."
            className="min-h-[600px] p-4"
          />
        </div>
      </div>

      <Dialog open={showVersionHistory} onOpenChange={setShowVersionHistory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Version History</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {versions.map((version) => (
              <div
                key={version.id}
                className="p-4 border rounded-lg cursor-pointer hover:bg-accent"
                onClick={() => restoreVersion(version.content)}
              >
                <div className="flex justify-between items-center">
                  <span>Version {version.version}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(version.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Write;