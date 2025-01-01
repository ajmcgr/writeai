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
    <div className="flex flex-col space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onFormat("bold")}
                className="w-full"
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
                className="w-full"
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
                className="w-full"
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
                className="w-full"
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
                className="w-full"
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
                className="w-full"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Numbered List</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".txt,.doc,.docx"
                  onChange={onFileUpload}
                />
                <label htmlFor="file-upload" className="w-full">
                  <Button variant="outline" className="w-full cursor-pointer">
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
                className="w-full"
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
                className="w-full"
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
                className="w-full"
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
                className="w-full"
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