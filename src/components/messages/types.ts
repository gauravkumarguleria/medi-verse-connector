
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
}
