import { Chat, Contact, ChatMessage } from './types';

// Initial mock contacts array
export const mockContacts: Contact[] = [
  {
    id: 'contact1',
    name: 'Emily Johnson',
    role: 'patient',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=contact1',
    isOnline: true
  },
  {
    id: 'contact2',
    name: 'Dr. Michael Chen',
    role: 'doctor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=contact2',
    isOnline: true
  }
];

// Add two specific contacts for testing live chat
export const testContacts: Contact[] = [
  {
    id: 'patient-test',
    name: 'John Doe',
    role: 'patient',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=patient-test',
    isOnline: true
  },
  {
    id: 'doctor-test',
    name: 'Dr. Emily Chen',
    role: 'doctor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=doctor-test',
    isOnline: true
  }
];

// Combine contacts
mockContacts.push(...testContacts);

// Mock chat data
export const mockChats: Chat[] = [
  {
    id: 'chat1',
    contactId: 'contact1',
    contactName: 'Emily Johnson',
    contactAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=contact1',
    lastMessage: {
      text: 'Hello! How can I help you today?',
      timestamp: new Date().toISOString(),
      senderId: 'contact1',
      status: 'read'
    },
    unreadCount: 0,
    isOnline: true
  },
  {
    id: 'chat2',
    contactId: 'contact2',
    contactName: 'Dr. Michael Chen',
    contactAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=contact2',
    lastMessage: {
      text: 'Good morning! Please provide your updated health records.',
      timestamp: new Date().toISOString(),
      senderId: 'contact2',
      status: 'delivered'
    },
    unreadCount: 1,
    isOnline: true
  },
  {
    id: 'chat3',
    contactId: 'patient-test',
    contactName: 'John Doe',
    contactAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=patient-test',
    lastMessage: {
      text: 'I have a question about my appointment.',
      timestamp: new Date().toISOString(),
      senderId: 'patient-test',
      status: 'sent'
    },
    unreadCount: 0,
    isOnline: true
  },
  {
    id: 'chat4',
    contactId: 'doctor-test',
    contactName: 'Dr. Emily Chen',
    contactAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=doctor-test',
    lastMessage: {
      text: 'Please review the lab results.',
      timestamp: new Date().toISOString(),
      senderId: 'doctor-test',
      status: 'read'
    },
    unreadCount: 0,
    isOnline: true
  },
];

// Mock messages
export const mockMessages: ChatMessage[] = [
  {
    id: 'message1',
    text: 'Hello! How can I help you today?',
    senderId: 'contact1',
    timestamp: new Date().toISOString(),
    status: 'read',
  },
  {
    id: 'message2',
    text: 'Good morning! Please provide your updated health records.',
    senderId: 'contact2',
    timestamp: new Date().toISOString(),
    status: 'delivered',
  },
  {
    id: 'message3',
    text: 'I have a question about my appointment.',
    senderId: 'patient-test',
    timestamp: new Date().toISOString(),
    status: 'sent',
  },
  {
    id: 'message4',
    text: 'Please review the lab results.',
    senderId: 'doctor-test',
    timestamp: new Date().toISOString(),
    status: 'read',
  },
];

export default {
  mockContacts,
  testContacts,
  mockChats,
  mockMessages
};
