
export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'error';
  attachments?: {
    name: string;
    size: number;
    type?: string;
    url?: string;
  }[];
}

export interface Chat {
  id: string;
  contactId: string;
  contactName: string;
  contactAvatar?: string;
  lastMessage?: {
    text: string;
    timestamp: string;
    senderId: string;
    status: 'sent' | 'delivered' | 'read';
  };
  messages?: ChatMessage[];
  unreadCount: number;
  isOnline: boolean;
}

export interface Contact {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  isOnline?: boolean;
  // Add this property since it's being used in mockData.ts
  lastSeen?: string;
}

// Add these interfaces for components still using the old types
export interface Conversation {
  id: string;
  recipient: {
    id: string;
    name: string;
    avatar: string;
    status: string;
    role: string;
  };
  lastMessage: {
    text: string;
    time: string;
    isRead: boolean;
    sender: string;
  };
  unread: number;
}

export interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
  status: string;
  attachment?: {
    name: string;
    size: number;
    type?: string;
    url?: string;
  };
}
