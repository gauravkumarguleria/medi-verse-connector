
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  ChevronLeft, 
  MoreVertical,
  Phone,
  Video,
  File,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Chat } from './types';
import Attachment from './Attachment';

interface ChatWindowProps {
  selectedChatId: string | null;
  chats: Chat[];
  onBack: () => void;
  onSendMessage: (text: string, attachments?: File[]) => void;
  className?: string;
  currentUserId: string;
}

const ChatWindow = ({
  selectedChatId,
  chats,
  onBack,
  onSendMessage,
  className,
  currentUserId
}: ChatWindowProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const selectedChat = chats.find(chat => chat.id === selectedChatId);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }, [selectedChat?.messages]);
  
  const handleSendMessage = () => {
    if (newMessage.trim() || attachments.length > 0) {
      onSendMessage(newMessage, attachments);
      setNewMessage('');
      setAttachments([]);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const validFiles = newFiles.filter(file => file.size <= 10 * 1024 * 1024);
      
      if (validFiles.length !== newFiles.length) {
        toast({
          title: "File too large",
          description: "Some files were not added because they exceed the 10MB limit",
          variant: "destructive"
        });
      }
      
      setAttachments(prev => [...prev, ...validFiles]);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };
  
  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      const validFiles = droppedFiles.filter(file => file.size <= 10 * 1024 * 1024);
      
      if (validFiles.length !== droppedFiles.length) {
        toast({
          title: "File too large",
          description: "Some files were not added because they exceed the 10MB limit",
          variant: "destructive"
        });
      }
      
      setAttachments(prev => [...prev, ...validFiles]);
    }
  };
  
  // Empty state when no chat is selected
  if (!selectedChatId || !selectedChat) {
    return (
      <div className={cn("flex flex-col items-center justify-center bg-background", className)}>
        <div className="text-center p-8">
          <div className="mx-auto bg-muted rounded-full h-20 w-20 flex items-center justify-center mb-4">
            <Send className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Your Messages</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Select a conversation to start messaging or create a new one.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn("flex flex-col bg-background relative", className)}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Chat Header */}
      <div className="p-3 border-b flex items-center sticky top-0 bg-background z-10 shadow-sm">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden mr-2"
          onClick={onBack}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <Avatar className="h-10 w-10 mr-3">
          <Avatar.Image src={selectedChat.contactAvatar} alt={selectedChat.contactName} />
          <Avatar.Fallback>{selectedChat.contactName.substring(0, 2).toUpperCase()}</Avatar.Fallback>
        </Avatar>
        
        <div className="flex-1">
          <h3 className="font-semibold">{selectedChat.contactName}</h3>
          <p className="text-xs text-muted-foreground">
            {selectedChat.isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
        
        <div className="flex items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Phone className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Call</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Video className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Video call</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>More options</TooltipContent>
          </Tooltip>
        </div>
      </div>
      
      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-3 min-h-[calc(100vh-20rem)]">
          {selectedChat.messages && selectedChat.messages.length > 0 ? (
            selectedChat.messages.map((message) => {
              const isCurrentUser = message.senderId === currentUserId;
              return (
                <div 
                  key={message.id}
                  className={cn(
                    "flex",
                    isCurrentUser ? "justify-end" : "justify-start"
                  )}
                >
                  <div 
                    className={cn(
                      "max-w-[70%] rounded-lg px-4 py-2",
                      isCurrentUser 
                        ? "bg-primary text-primary-foreground rounded-br-none" 
                        : "bg-muted rounded-bl-none"
                    )}
                  >
                    <p className="whitespace-pre-wrap break-words">{message.text}</p>
                    
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {message.attachments.map((attachment, index) => (
                          <Attachment 
                            key={index} 
                            file={attachment} 
                            className={isCurrentUser ? "bg-primary/80" : "bg-background/50"}
                          />
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className={cn(
                        "text-xs",
                        isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}>
                        {format(new Date(message.timestamp), 'HH:mm')}
                      </span>
                      
                      {isCurrentUser && (
                        <span className="text-primary-foreground/70">
                          {message.status === 'read' ? (
                            <span className="text-xs">✓✓</span>
                          ) : (
                            <span className="text-xs">✓</span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex justify-center items-center h-40">
              <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
        
        {/* File drop overlay */}
        {isDragging && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-md border-2 border-dashed border-primary z-50">
            <div className="text-center p-4">
              <File className="h-12 w-12 text-primary mx-auto mb-2" />
              <h3 className="text-lg font-medium">Drop files here</h3>
              <p className="text-muted-foreground">Upload files to share (max 10MB)</p>
            </div>
          </div>
        )}
      </ScrollArea>
      
      {/* Attachments Preview */}
      {attachments.length > 0 && (
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
                  onClick={() => removeAttachment(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Message Input */}
      <div className="p-3 border-t sticky bottom-0 bg-background">
        <div className="flex items-end gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            multiple
          />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={triggerFileInput}
            className="rounded-full flex-shrink-0"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          
          <Textarea
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="min-h-[50px] max-h-[150px] resize-none"
            rows={1}
          />
          
          <Button 
            onClick={handleSendMessage}
            className="rounded-full w-10 h-10 p-0 flex-shrink-0"
            disabled={!newMessage.trim() && attachments.length === 0}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
