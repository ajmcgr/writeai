import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  History,
  Copy,
  FileUp,
  Download,
  Wand2,
  Search,
  Save,
  Sparkles,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ActionButtonsProps {
  onHistory: () => void;
  onCopy: () => void;
  onAIGenerate: () => void;
  onRewrite: () => void;
  onAnalyze: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveDraft?: () => void;
  onExport: () => void;
  isLoading: boolean;
  hasContent: boolean;
  hasContentId: boolean;
}

export const ActionButtons = ({
  onHistory,
  onCopy,
  onAIGenerate,
  onRewrite,
  onAnalyze,
  onFileUpload,
  onSaveDraft,
  onExport,
  isLoading,
  hasContent,
  hasContentId,
}: ActionButtonsProps) => {
  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onHistory}
              disabled={!hasContentId || isLoading}
            >
              <History className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Version History (Ctrl+H)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCopy}
              disabled={!hasContent || isLoading}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copy to Clipboard (Ctrl+C)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onAIGenerate}>
              <Sparkles className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Generate with AI</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRewrite}
              disabled={!hasContent || isLoading}
            >
              <Wand2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Rewrite Content</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onAnalyze}
              disabled={!hasContent || isLoading}
            >
              <Search className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Analyze Content</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Input
                type="file"
                className="hidden"
                onChange={onFileUpload}
                accept=".txt,.doc,.docx"
                id="file-upload"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => document.getElementById("file-upload")?.click()}
                disabled={isLoading}
              >
                <FileUp className="h-4 w-4" />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Upload Document (.txt, .doc, .docx)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onSaveDraft}
              disabled={!hasContent || isLoading}
            >
              <Save className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Save Draft (Ctrl+S)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onExport}
              disabled={!hasContent || isLoading}
            >
              <Download className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Export to Word</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};