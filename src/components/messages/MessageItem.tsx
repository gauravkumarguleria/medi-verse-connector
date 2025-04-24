
import React from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ChatMessage } from './types';
import Attachment from './Attachment';

interface MessageItemProps {
  message: ChatMessage;
  isCurrentUser: boolean;
}

const MessageItem = ({ message, isCurrentUser }: MessageItemProps) => {
  return (
    <div className={cn("flex", isCurrentUser ? "justify-end" : "justify-start")}>
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
              {message.status === 'read' ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
