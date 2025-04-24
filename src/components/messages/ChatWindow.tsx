
import React, { useState, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Chat, ChatMessage } from './types';
import ChatHeader from './components/ChatHeader';
import MessageInput from './components/MessageInput';
import AttachmentPreview from './components/AttachmentPreview';
import FileDropZone from './components/FileDropZone';
import MessageItem from './MessageItem';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const selectedChat = chats.find(chat => chat.id === selectedChatId);
  
  const handleSendMessage = () => {
    if (newMessage.trim() || attachments.length > 0) {
      onSendMessage(newMessage, attachments);
      setNewMessage('');
      setAttachments([]);
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
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      const validFiles = droppedFiles.filter(file => file.size <= 10 * 1024 * 1024);
      setAttachments(prev => [...prev, ...validFiles]);
    }
  };

  if (!selectedChatId || !selectedChat) {
    return (
      <div className={cn("flex flex-col items-center justify-center bg-background", className)}>
        <div className="text-center p-8">
          <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
          <p className="text-muted-foreground">Choose a chat to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn("flex flex-col bg-background relative", className)}
      onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
      onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }}
      onDrop={handleDrop}
    >
      <ChatHeader 
        onBack={onBack}
        contactName={selectedChat.contactName}
        contactAvatar={selectedChat.contactAvatar}
        isOnline={selectedChat.isOnline}
      />
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3 min-h-[calc(100vh-20rem)]">
          {selectedChat.messages?.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              isCurrentUser={message.senderId === currentUserId}
            />
          ))}
          <div ref={scrollRef} />
        </div>
        
        <FileDropZone isDragging={isDragging} />
      </ScrollArea>
      
      <AttachmentPreview 
        attachments={attachments}
        onRemoveAttachment={(index) => {
          setAttachments(prev => prev.filter((_, i) => i !== index));
        }}
      />
      
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        multiple
      />
      
      <MessageInput
        message={newMessage}
        onMessageChange={setNewMessage}
        onSendMessage={handleSendMessage}
        onAttachmentClick={() => fileInputRef.current?.click()}
        hasAttachments={attachments.length > 0}
      />
    </div>
  );
};

export default ChatWindow;
