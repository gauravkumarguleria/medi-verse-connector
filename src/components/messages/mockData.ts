
import { Conversation, Message } from './types';

// Mock data for conversations
export const conversations: Conversation[] = [
  {
    id: '1',
    recipient: {
      id: 'doc1',
      name: 'Dr. Arjun Sharma',
      avatar: 'https://i.pravatar.cc/150?img=32',
      status: 'online',
      role: 'Cardiologist'
    },
    lastMessage: {
      text: 'Your test results look good. I would recommend...',
      time: '10:42 AM',
      isRead: true,
      sender: 'recipient'
    },
    unread: 0
  },
  {
    id: '2',
    recipient: {
      id: 'doc2',
      name: 'Dr. Priya Patel',
      avatar: 'https://i.pravatar.cc/150?img=56',
      status: 'offline',
      role: 'Dermatologist'
    },
    lastMessage: {
      text: 'Please let me know if the new medication has improved your skin condition.',
      time: 'Yesterday',
      isRead: false,
      sender: 'recipient'
    },
    unread: 1
  },
  {
    id: '3',
    recipient: {
      id: 'phar1',
      name: 'MediVerse Pharmacy',
      avatar: 'https://i.pravatar.cc/150?img=68',
      status: 'online',
      role: 'Pharmacy'
    },
    lastMessage: {
      text: 'Your prescription refill is ready for pickup.',
      time: 'Yesterday',
      isRead: false,
      sender: 'recipient'
    },
    unread: 1
  },
  {
    id: '4',
    recipient: {
      id: 'support1',
      name: 'Support Team',
      avatar: 'https://i.pravatar.cc/150?img=23',
      status: 'online',
      role: 'Customer Support'
    },
    lastMessage: {
      text: 'How can we help you today?',
      time: 'May 10',
      isRead: true,
      sender: 'recipient'
    },
    unread: 0
  }
];

// Message history
export const messageHistory: Message[] = [
  {
    id: 'm1',
    text: 'Hello Dr. Sharma, I\'ve been experiencing some chest discomfort lately.',
    time: '10:30 AM',
    sender: 'user',
    status: 'delivered'
  },
  {
    id: 'm2',
    text: 'I\'m sorry to hear that. Can you describe the discomfort in more detail? When does it occur?',
    time: '10:35 AM',
    sender: 'recipient',
    status: 'delivered'
  },
  {
    id: 'm3',
    text: 'It happens mostly when I exert myself, like climbing stairs. It\'s a tight feeling in my chest that lasts for a few minutes.',
    time: '10:38 AM',
    sender: 'user',
    status: 'delivered'
  },
  {
    id: 'm4',
    text: 'Your test results look good. I would recommend scheduling an appointment so we can discuss this further and perhaps run some additional tests to be sure.',
    time: '10:42 AM',
    sender: 'recipient',
    status: 'delivered'
  },
  {
    id: 'm5',
    text: '',
    time: '10:45 AM',
    sender: 'recipient',
    status: 'delivered',
    attachment: {
      name: 'test_results.pdf',
      size: '2.3 MB',
      type: 'application/pdf',
      url: '#'
    }
  },
  {
    id: 'm6',
    text: 'I\'ve also attached my recent blood work results for your review.',
    time: '10:50 AM',
    sender: 'user',
    status: 'delivered',
    attachment: {
      name: 'blood_work_results.pdf',
      size: '1.8 MB',
      type: 'application/pdf',
      url: '#'
    }
  }
];
