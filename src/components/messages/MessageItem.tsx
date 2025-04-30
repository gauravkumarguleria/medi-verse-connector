
import React from 'react';
import FileAttachment from './FileAttachment';
import { Message } from './types';

interface MessageItemProps {
  message: Message;
  onDownload: (fileName: string) => void;
  onShare: (fileName: string) => void;
}

const MessageItem = ({ message, onDownload, onShare }: MessageItemProps) => {
  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
          message.sender === 'user'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        }`}
      >
        {message.text && <p>{message.text}</p>}
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
        <div className={`text-xs mt-1 ${
          message.sender === 'user' ? 'text-primary-foreground/80' : 'text-muted-foreground'
        }`}>
          {message.time}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
