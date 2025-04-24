
import React, { useRef } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface MessageInputProps {
  message: string;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onAttachmentClick: () => void;
  hasAttachments: boolean;
}

const MessageInput = ({
  message,
  onMessageChange,
  onSendMessage,
  onAttachmentClick,
  hasAttachments
}: MessageInputProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="p-3 border-t sticky bottom-0 bg-background">
      <div className="flex items-end gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onAttachmentClick}
          className="rounded-full flex-shrink-0"
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        
        <Textarea
          placeholder="Type a message..."
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyDown={handleKeyPress}
          className="min-h-[50px] max-h-[150px] resize-none"
          rows={1}
        />
        
        <Button 
          onClick={onSendMessage}
          className="rounded-full w-10 h-10 p-0 flex-shrink-0"
          disabled={!message.trim() && !hasAttachments}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
