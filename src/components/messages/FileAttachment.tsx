
import React from 'react';
import { File, Download, Share2, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export interface FileAttachmentProps {
  file: {
    name: string;
    size: string | number;
    type?: string;
    url?: string;
    data?: File;
  };
  onRemove?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  className?: string;
  isPending?: boolean;
  showActions?: boolean;
  progress?: number;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const FileAttachment = ({
  file,
  onRemove,
  onDownload,
  onShare,
  className,
  isPending = false,
  showActions = true,
  progress = 100,
}: FileAttachmentProps) => {
  // Format file size if it's a number
  const formattedSize = typeof file.size === 'number' ? formatFileSize(file.size) : file.size;
  
  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else if (file.url) {
      // Fallback download function
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download started",
        description: `Downloading ${file.name}...`
      });
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else if (navigator.share && file.url) {
      navigator.share({
        title: 'Shared medical document',
        text: `Medical document: ${file.name}`,
        url: file.url,
      })
      .then(() => {
        toast({
          title: "File shared successfully",
        });
      })
      .catch((error) => {
        toast({
          title: "Could not share file",
          description: error.message,
          variant: "destructive"
        });
      });
    } else {
      // Fallback for browsers that don't support navigator.share
      if (file.url) {
        navigator.clipboard.writeText(file.url);
        toast({
          title: "Link copied to clipboard",
          description: "You can now paste and share it"
        });
      }
    }
  };

  return (
    <div className={cn(
      "flex items-center gap-2 rounded-md border bg-background/80 p-2 shadow-sm",
      className
    )}>
      <div className="flex-shrink-0">
        <File className="h-5 w-5 text-muted-foreground" />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <div className="flex items-center text-xs text-muted-foreground gap-2">
          <span>{formattedSize}</span>
          
          {isPending && (
            <div className="w-full max-w-24">
              <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {showActions && !isPending && (
        <div className="flex items-center gap-1">
          <Button 
            variant="download" 
            size="icon" 
            onClick={handleDownload}
            title="Download file"
          >
            <Download className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="share" 
            size="icon" 
            onClick={handleShare}
            title="Share file"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          
          {onRemove && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onRemove}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              title="Remove file"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
      
      {isPending && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onRemove}
          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-6 w-6"
          title="Cancel upload"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};

export default FileAttachment;
