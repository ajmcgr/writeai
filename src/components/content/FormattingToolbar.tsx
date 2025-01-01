import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  List,
  ListOrdered,
  Upload,
  Save,
  FileText,
  Copy,
  History,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FormattingToolbarProps {
  onFormat: (type: string) => void;
  onSave: () => void;
  onExport: () => void;
  onCopy: () => void;
  onHistory: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  hasContent: boolean;
  hasContentId: boolean;
}

export const FormattingToolbar = ({
  onFormat,
  onSave,
  onExport,
  onCopy,
  onHistory,
  onFileUpload,
  isLoading,
  hasContent,
  hasContentId,
}: FormattingToolbarProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onFormat("bold")}
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
                onClick={() => onFormat("italic")}
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
                onClick={() => onFormat("underline")}
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
                onClick={() => onFormat("heading")}
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
                onClick={() => onFormat("bullet")}
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
                onClick={() => onFormat("number")}
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
              <div>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".txt,.doc,.docx"
                  onChange={onFileUpload}
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

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={onSave}
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
                onClick={onExport}
                disabled={!hasContent}
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
                onClick={onCopy}
                disabled={!hasContent}
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
                onClick={onHistory}
                disabled={!hasContentId}
              >
                <History className="h-4 w-4 mr-2" />
                History
              </Button>
            </TooltipTrigger>
            <TooltipContent>Version History</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};