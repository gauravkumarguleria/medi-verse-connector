
import React from 'react';
import { CheckCheck, Check, Clock, AlertCircle } from 'lucide-react';
import FileAttachment from './FileAttachment';
import { Message } from './types';

interface MessageItemProps {
  message: Message;
  onDownload: (fileName: string) => void;
  onShare: (fileName: string) => void;
}

const MessageItem = ({ message, onDownload, onShare }: MessageItemProps) => {
  // Render the appropriate status icon
  const renderStatusIcon = () => {
    if (message.sender === 'recipient') return null;
    
    switch (message.status) {
      case 'sending':
        return <Clock className="h-3 w-3 text-muted-foreground" />;
      case 'delivered':
        return <Check className="h-3 w-3 text-muted-foreground" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-primary" />;
      case 'error':
        return <AlertCircle className="h-3 w-3 text-destructive" />;
      default:
        return null;
    }
  };
  
  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
          message.sender === 'user'
            ? 'bg-primary text-primary-foreground rounded-br-none'
            : 'bg-muted rounded-bl-none'
        }`}
      >
        {message.text && <p className="break-words">{message.text}</p>}
        {message.attachment && (
          <div className="mt-2">
            <FileAttachment 
              file={message.attachment}
              onDownload={() => onDownload(message.attachment.name)}
              onShare={() => onShare(message.attachment.name)}
              className={`${message.sender === 'user' ? 'bg-primary/80' : 'bg-background/50 dark:bg-background/10'}`}
            />
          </div>
        )}
        <div className={`flex items-center gap-1 text-xs mt-1 ${
          message.sender === 'user' ? 'text-primary-foreground/80' : 'text-muted-foreground'
        }`}>
          {message.time}
          {renderStatusIcon()}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
