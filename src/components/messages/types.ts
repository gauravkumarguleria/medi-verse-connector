
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
  size: string | number;
  type: string;
  url?: string;
  data?: File;
}

export interface Message {
  id: string;
  text: string;
  time: string;
  sender: 'user' | 'recipient';
  status: 'delivered' | 'read' | 'sending' | 'error';
  attachment?: Attachment;
}
