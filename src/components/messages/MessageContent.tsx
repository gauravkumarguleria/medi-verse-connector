
import React, { useRef, useState, useCallback } from 'react';
import { 
  Send, 
  MoreVertical, 
  Paperclip, 
  ChevronLeft, 
  File,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import FileAttachment from './FileAttachment';
import { CallActions } from './CallActions';
import { Conversation, Message } from './types';
import MessageItem from './MessageItem';

interface MessageContentProps {
  selectedConversation: string | null;
  currentConversation: Conversation | undefined;
  messageHistory: Message[];
  onBack: () => void;
  onSendMessage: (text: string, attachments: File[]) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const MessageContent = ({
  selectedConversation,
  currentConversation,
  messageHistory,
  onBack,
  onSendMessage,
  messagesEndRef
}: MessageContentProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = () => {
    if (newMessage.trim() || attachments.length > 0) {
      // Call the parent component's handler for message sending
      onSendMessage(newMessage, attachments);
      
      // Reset local state
      setNewMessage('');
      setAttachments([]);
      
      // Focus the textarea for continuous typing
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 0);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      processFiles(newFiles);
    }
  };

  const processFiles = (files: File[]) => {
    // Check if any file is too large (>10MB)
    const tooLargeFiles = files.filter(file => file.size > 10 * 1024 * 1024);
    
    if (tooLargeFiles.length > 0) {
      toast({
        title: "File too large",
        description: "Files must be less than 10MB in size.",
        variant: "destructive"
      });
    }
    
    // Filter out too large files
    const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024);
    
    // Set initial progress for each file
    const newProgress = { ...uploadProgress };
    validFiles.forEach(file => {
      newProgress[file.name] = 0;
    });
    setUploadProgress(newProgress);
    
    // Simulate upload progress
    validFiles.forEach(file => {
      simulateFileUpload(file);
    });
    
    setAttachments(prev => [...prev, ...validFiles]);
  };

  const simulateFileUpload = (file: File) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 100) {
        progress = 100;
        clearInterval(interval);
      }
      
      setUploadProgress(prev => ({
        ...prev,
        [file.name]: progress
      }));
    }, 200);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => {
      const newAttachments = [...prev];
      const removedFile = newAttachments.splice(index, 1)[0];
      
      // Remove from progress tracking
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[removedFile.name];
        return newProgress;
      });
      
      return newAttachments;
    });
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDownloadFile = (fileName: string) => {
    // In a real app, this would download the actual file from your backend
    toast({
      title: "Download started",
      description: `Downloading ${fileName}...`
    });
    
    // Simulate a download (in a real app, you would use a proper file URL)
    setTimeout(() => {
      toast({
        title: "Download complete",
        description: `${fileName} has been downloaded.`
      });
    }, 1500);
  };

  const handleShareFile = (fileName: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Shared medical document',
        text: `Medical document: ${fileName}`,
        url: window.location.href,
      })
      .then(() => {
        toast({
          title: "File shared successfully",
        });
      })
      .catch((error) => {
        console.error("Error sharing:", error);
        // Fallback for error in sharing
        navigator.clipboard.writeText(`${window.location.origin}/shared-file/${fileName}`);
        toast({
          title: "Link copied to clipboard",
          description: "You can now paste and share it"
        });
      });
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(`${window.location.origin}/shared-file/${fileName}`);
      toast({
        title: "Link copied to clipboard",
        description: "You can now paste and share it"
      });
    }
  };

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      processFiles(droppedFiles);
    }
  }, []);

  if (!selectedConversation || !currentConversation) {
    return <EmptyMessageState />;
  }

  return (
    <div 
      className="w-full flex flex-col h-full bg-background"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden mr-2"
            onClick={onBack}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Avatar className="h-10 w-10">
            <img 
              src={currentConversation.recipient.avatar} 
              alt={currentConversation.recipient.name} 
              className="h-full w-full object-cover"
            />
          </Avatar>
          <div className="ml-3">
            <h3 className="font-medium">{currentConversation.recipient.name}</h3>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className={`inline-block h-2 w-2 rounded-full ${
                currentConversation.recipient.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
              } mr-1`}></span>
              {currentConversation.recipient.status === 'online' ? 'Online' : 'Offline'}
              <span className="ml-1">• {currentConversation.recipient.role}</span>
            </div>
          </div>
        </div>
        
        {/* Add Call Actions */}
        <div className="flex items-center gap-2">
          <CallActions recipient={currentConversation.recipient} />
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Message List */}
      <ScrollArea className="flex-1 p-4 relative">
        <div className="space-y-2 pb-2">
          {messageHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-60 text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-medium mb-2">Start a conversation</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Send your first message to {currentConversation.recipient.name}
              </p>
            </div>
          ) : (
            messageHistory.map((message) => (
              <MessageItem 
                key={message.id} 
                message={message} 
                onDownload={handleDownloadFile} 
                onShare={handleShareFile} 
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* File drop overlay */}
        {isDragging && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-md border-2 border-dashed border-primary">
            <div className="text-center p-4">
              <File className="h-12 w-12 text-primary mx-auto mb-2" />
              <h3 className="text-lg font-medium">Drop files here</h3>
              <p className="text-muted-foreground">Upload documents to share with {currentConversation.recipient.name}</p>
            </div>
          </div>
        )}
      </ScrollArea>

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="px-4 py-2 border-t">
          <div className="flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <FileAttachment 
                key={index}
                file={{
                  name: file.name,
                  size: file.size,
                  type: file.type,
                  data: file
                }}
                onRemove={() => handleRemoveAttachment(index)}
                isPending={uploadProgress[file.name] < 100}
                progress={uploadProgress[file.name]}
                showActions={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="px-4 py-3 border-t">
        <div className="flex items-end gap-2">
          <Textarea
            ref={textareaRef}
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="min-h-[60px] max-h-32 resize-none rounded-2xl"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <div className="flex flex-col gap-2">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileUpload}
              multiple
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onClick={triggerFileInput}
              title="Attach file"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button 
              size="icon" 
              className="rounded-full" 
              onClick={handleSendMessage}
              title="Send message"
              disabled={!newMessage.trim() && attachments.length === 0}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Empty state component
const EmptyMessageState = () => (
  <div className="flex flex-col items-center justify-center h-full text-center p-6">
    <div className="bg-primary/10 p-6 rounded-full mb-4">
      <MessageCircle className="h-12 w-12 text-primary" />
    </div>
    <h3 className="text-xl font-medium mb-2">Your Messages</h3>
    <p className="text-muted-foreground mb-6 max-w-md">
      Select a conversation to view messages or start a new conversation with a healthcare provider.
    </p>
  </div>
);

export default MessageContent;
