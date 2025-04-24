
export interface Recipient {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
  role: string;
}

export interface LastMessage {
  text: string;
  time: string;
  isRead: boolean;
  sender: 'user' | 'recipient';
}

export interface Conversation {
  id: string;
  recipient: Recipient;
  lastMessage: LastMessage;
  unread: number;
}

export interface Attachment {
  name: string;
  size: number;
  type: string;
  url?: string;
}

export interface Message {
  id: string;
  text: string;
  time: string;
  sender: 'user' | 'recipient';
  status: 'delivered' | 'read' | 'sending' | 'error';
  attachment?: Attachment;
}

// New WhatsApp-like interfaces
export interface MessageAttachment {
  name: string;
  size: number;
  type?: string;
  url?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  timestamp: string;
  senderId: string;
  status: 'sent' | 'delivered' | 'read' | 'error';
  attachments?: MessageAttachment[];
}

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  role: string;
  lastSeen?: string;
}

export interface Chat {
  id: string;
  contactId: string;
  contactName: string;
  contactAvatar: string;
  lastMessage?: {
    text: string;
    timestamp: string;
    senderId: string;
  };
  unreadCount: number;
  isOnline: boolean;
  messages?: ChatMessage[];
}
