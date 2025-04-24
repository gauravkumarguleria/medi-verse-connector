
import React from 'react';
import { File, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AttachmentPreviewProps {
  attachments: File[];
  onRemoveAttachment: (index: number) => void;
}

const AttachmentPreview = ({ attachments, onRemoveAttachment }: AttachmentPreviewProps) => {
  if (attachments.length === 0) return null;

  return (
    <div className="px-4 pt-2 border-t bg-card/50">
      <div className="flex flex-wrap gap-2">
        {attachments.map((file, index) => (
          <div 
            key={index}
            className="flex items-center gap-2 p-2 bg-background rounded-md border"
          >
            <File className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm truncate max-w-[150px]">{file.name}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
              onClick={() => onRemoveAttachment(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttachmentPreview;
