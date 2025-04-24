
import React, { useRef, useState, useCallback } from 'react';
import { 
  Send, 
  MoreVertical, 
  Paperclip, 
  ChevronLeft, 
  File
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import FileAttachment from './FileAttachment';
import { CallActions } from './CallActions';
import { Conversation, Message, ChatMessage } from './types';
import MessageItem from './MessageItem';
import { cn } from '@/lib/utils';
import FileDropZone from './components/FileDropZone';
import AttachmentPreview from './components/AttachmentPreview';

interface MessageContentProps {
  selectedConversation: string | null;
  currentConversation: Conversation | undefined;
  messageHistory: Message[];
  onBack: () => void;
  onSendMessage: (text: string, attachments: File[]) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  className?: string;
}

const MessageContent = ({
  selectedConversation,
  currentConversation,
  messageHistory,
  onBack,
  onSendMessage,
  messagesEndRef,
  className
}: MessageContentProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (newMessage.trim() || attachments.length > 0) {
      // Call the parent component's handler for message sending
      onSendMessage(newMessage, attachments);
      
      // Reset local state
      setNewMessage('');
      setAttachments([]);
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
    return (
      <div className={cn("w-full md:w-2/3 flex flex-col bg-background", className)}>
        <EmptyMessageState />
      </div>
    );
  }

  // Convert Message objects to ChatMessage objects for MessageItem component
  const convertedMessages = messageHistory.map(message => ({
    id: message.id,
    text: message.text,
    timestamp: message.time,
    senderId: message.sender === 'user' ? 'current-user' : 'recipient',
    status: message.status === 'delivered' || message.status === 'read' || 
            message.status === 'error' ? message.status : 'sent',
    attachments: message.attachment ? [{
      name: message.attachment.name,
      size: message.attachment.size,
      type: message.attachment.type,
      url: message.attachment.url
    }] : undefined
  }));

  return (
    <div 
      className={cn("w-full flex flex-col bg-background relative", className)}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Header */}
      <div className="p-4 border-b sticky top-0 bg-background z-10">
        <div className="flex items-center justify-between">
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
              <img src={currentConversation.recipient.avatar} alt={currentConversation.recipient.name} />
            </Avatar>
            <div className="ml-3">
              <h3 className="font-medium">{currentConversation.recipient.name}</h3>
              <p className="text-xs text-muted-foreground">{currentConversation.recipient.role}</p>
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
      </div>

      {/* Message List */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 min-h-[calc(100vh-20rem)]">
          {convertedMessages.map((message) => (
            <MessageItem 
              key={message.id} 
              message={message} 
              isCurrentUser={message.senderId === 'current-user'}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* File drop overlay */}
        <FileDropZone isDragging={isDragging} />
      </ScrollArea>

      {/* Attachments Preview */}
      <AttachmentPreview 
        attachments={attachments}
        onRemoveAttachment={handleRemoveAttachment}
      />

      {/* Message Input */}
      <div className="p-4 border-t sticky bottom-0 bg-background">
        <div className="flex items-end gap-2">
          <Textarea
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="min-h-[80px] resize-none"
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
    <MessageCircle className="h-16 w-16 text-muted-foreground mb-4" />
    <h3 className="text-xl font-medium mb-2">Your Messages</h3>
    <p className="text-muted-foreground mb-6 max-w-md">
      Select a conversation to view messages or start a new conversation with a healthcare provider.
    </p>
    <AnimatedButton>
      <Plus className="h-4 w-4 mr-2" />
      Start New Conversation
    </AnimatedButton>
  </div>
);

import { Plus, MessageCircle } from 'lucide-react';
import AnimatedButton from '@/components/ui/AnimatedButton';

export default MessageContent;
