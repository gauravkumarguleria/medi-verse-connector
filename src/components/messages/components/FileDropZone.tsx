
import React from 'react';
import { File } from 'lucide-react';

interface FileDropZoneProps {
  isDragging: boolean;
}

const FileDropZone = ({ isDragging }: FileDropZoneProps) => {
  if (!isDragging) return null;

  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-md border-2 border-dashed border-primary z-50">
      <div className="text-center p-4">
        <File className="h-12 w-12 text-primary mx-auto mb-2" />
        <h3 className="text-lg font-medium">Drop files here</h3>
        <p className="text-muted-foreground">Upload files to share (max 10MB)</p>
      </div>
    </div>
  );
};

export default FileDropZone;
