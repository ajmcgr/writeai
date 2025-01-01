import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload } from "lucide-react";

const Write = () => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const generateContent = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke("generate-content", {
        body: { type: "generate" },
      });

      if (error) throw error;
      setContent(data.generatedText);
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const rewriteContent = async () => {
    if (!content) {
      toast({
        title: "No content",
        description: "Please enter some content to rewrite",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke("generate-content", {
        body: { type: "rewrite", content },
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

  const analyzeContent = async () => {
    if (!content) {
      toast({
        title: "No content",
        description: "Please enter some content to analyze",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke("analyze-content", {
        body: { content },
      });

      if (error) throw error;
      toast({
        title: "Analysis Complete",
        description: data.analysis,
      });
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
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-x-4">
              <Button
                onClick={generateContent}
                disabled={isLoading}
              >
                AI Generate
              </Button>
              <Button
                onClick={rewriteContent}
                disabled={isLoading || !content}
              >
                AI Re-write
              </Button>
              <Button
                onClick={analyzeContent}
                disabled={isLoading || !content}
              >
                AI Analyze
              </Button>
            </div>
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
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
              </label>
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
    </div>
  );
};

export default Write;