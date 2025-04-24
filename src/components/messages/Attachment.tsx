
import React from 'react';
import { File, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export interface AttachmentProps {
  file: {
    name: string;
    size: number;
    type?: string;
    url?: string;
  };
  className?: string;
  onDownload?: () => void;
  onShare?: () => void;
}

const Attachment = ({
  file,
  className,
  onDownload,
  onShare
}: AttachmentProps) => {
  // Format file size 
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  
  // Get file extension from name
  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toLowerCase() || '';
  };
  
  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      toast({
        title: "Download started",
        description: `Downloading ${file.name}...`
      });
      
      // Simulate a download (in a real app, would use file.url)
      setTimeout(() => {
        toast({
          title: "Download complete",
          description: `${file.name} has been downloaded.`
        });
      }, 1500);
    }
  };
  
  const handleShare = () => {
    if (onShare) {
      onShare();
    } else if (navigator.share) {
      navigator.share({
        title: 'Shared file',
        text: `Shared file: ${file.name}`,
        url: file.url || window.location.href,
      })
      .then(() => {
        toast({
          title: "File shared successfully",
        });
      })
      .catch(() => {
        // Fallback for error in sharing
        navigator.clipboard.writeText(`Shared file: ${file.name}`);
        toast({
          title: "Link copied to clipboard",
          description: "You can now paste and share it"
        });
      });
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(`Shared file: ${file.name}`);
      toast({
        title: "Link copied to clipboard",
        description: "You can now paste and share it"
      });
    }
  };
  
  // Get icon based on file type
  const getFileIcon = () => {
    return <File className="h-5 w-5 text-muted-foreground" />;
  };
  
  return (
    <div className={cn(
      "flex items-center gap-2 rounded-md p-2 shadow-sm",
      className
    )}>
      <div className="flex-shrink-0">
        {getFileIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <p className="text-xs opacity-70">{formatFileSize(file.size)}</p>
      </div>
      
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleDownload}
          className="h-7 w-7"
          title="Download"
        >
          <Download className="h-3.5 w-3.5" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleShare}
          className="h-7 w-7"
          title="Share"
        >
          <Share2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default Attachment;
