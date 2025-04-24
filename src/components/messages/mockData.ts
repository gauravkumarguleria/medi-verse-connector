
import { Chat, Contact } from './types';

// Mock contacts data (doctors and medical staff)
export const mockContacts: Contact[] = [
  {
    id: 'dr-smith',
    name: 'Dr. Sarah Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dr-smith',
    role: 'Cardiologist',
    lastSeen: new Date(Date.now() - 15 * 60000).toISOString() // 15 min ago
  },
  {
    id: 'dr-jones',
    name: 'Dr. Michael Jones',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dr-jones',
    role: 'Neurologist',
    lastSeen: new Date(Date.now() - 2 * 3600000).toISOString() // 2 hours ago
  },
  {
    id: 'nurse-williams',
    name: 'Nurse Lisa Williams',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nurse-williams',
    role: 'Primary Care Nurse',
    lastSeen: new Date().toISOString() // now
  },
  {
    id: 'dr-patel',
    name: 'Dr. Ravi Patel',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dr-patel',
    role: 'Endocrinologist',
    lastSeen: new Date(Date.now() - 5 * 60000).toISOString() // 5 min ago
  },
  {
    id: 'dr-chen',
    name: 'Dr. Amy Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dr-chen',
    role: 'Dermatologist',
    lastSeen: new Date(Date.now() - 30 * 60000).toISOString() // 30 min ago
  },
  {
    id: 'tech-johnson',
    name: 'Tech Robert Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech-johnson',
    role: 'Radiology Technician',
    lastSeen: new Date(Date.now() - 1 * 86400000).toISOString() // 1 day ago
  }
];

// Generate some mock chat messages
const generateMockMessages = (contactId: string, count: number = 5) => {
  const messages = [];
  const now = Date.now();
  
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now - (count - i) * 3600000 * (Math.random() + 0.5));
    const isUserMessage = Math.random() > 0.5;
    
    messages.push({
      id: `msg-${contactId}-${i}`,
      senderId: isUserMessage ? 'user' : contactId,
      text: isUserMessage 
        ? getRandomUserMessage() 
        : getRandomDoctorMessage(contactId),
      timestamp: timestamp.toISOString(),
      status: isUserMessage ? (Math.random() > 0.3 ? 'read' : 'delivered') : 'delivered'
    });
  }
  
  return messages;
};

// Mock doctor messages
function getRandomDoctorMessage(contactId: string): string {
  const doctorMessages = [
    "Your test results look good. The white blood cell count is now normal.",
    "How are you feeling after taking the new medication?",
    "Don't forget to take your blood pressure readings this week.",
    "I'd like to schedule a follow-up appointment next month.",
    "The MRI shows significant improvement since your last visit.",
    "Remember to stay hydrated and continue the exercises we discussed.",
    "Your prescription refill has been sent to the pharmacy.",
    "Please let me know if you experience any side effects from the medication.",
    "Your recovery is progressing well based on your latest results.",
    "I've attached some educational materials about managing your condition."
  ];
  
  // Return different messages based on the doctor
  if (contactId === 'dr-smith') {
    return doctorMessages[0];
  } else if (contactId === 'dr-jones') {
    return doctorMessages[1];
  } else if (contactId === 'nurse-williams') {
    return doctorMessages[2];
  } else {
    return doctorMessages[Math.floor(Math.random() * doctorMessages.length)];
  }
}

// Mock user messages
function getRandomUserMessage(): string {
  const userMessages = [
    "Thank you, doctor. I've been taking the medication as prescribed.",
    "I'm still experiencing some pain in my lower back.",
    "When should I schedule my next appointment?",
    "The new medication seems to be working well.",
    "My symptoms have improved since last week.",
    "I've been monitoring my blood pressure as you suggested.",
    "Should I continue with the same dosage?",
    "I've attached my health diary from the past week.",
    "I have a question about the side effects we discussed.",
    "Is it normal to feel dizzy after taking this medication?"
  ];
  
  return userMessages[Math.floor(Math.random() * userMessages.length)];
}

// Mock chats data
export const mockChats: Chat[] = [
  {
    id: 'chat-1',
    contactId: 'dr-smith',
    contactName: 'Dr. Sarah Smith',
    contactAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dr-smith',
    lastMessage: {
      text: "Your test results look good. The white blood cell count is now normal.",
      timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
      senderId: 'dr-smith'
    },
    unreadCount: 2,
    isOnline: true,
    messages: generateMockMessages('dr-smith', 8)
  },
  {
    id: 'chat-2',
    contactId: 'dr-jones',
    contactName: 'Dr. Michael Jones',
    contactAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dr-jones',
    lastMessage: {
      text: "I've sent your prescription to the pharmacy. It should be ready in an hour.",
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
      senderId: 'dr-jones'
    },
    unreadCount: 0,
    isOnline: false,
    messages: generateMockMessages('dr-jones', 5)
  },
  {
    id: 'chat-3',
    contactId: 'nurse-williams',
    contactName: 'Nurse Lisa Williams',
    contactAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nurse-williams',
    lastMessage: {
      text: "When should I schedule my next appointment?",
      timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
      senderId: 'user'
    },
    unreadCount: 0,
    isOnline: true,
    messages: generateMockMessages('nurse-williams', 12)
  },
  {
    id: 'chat-4',
    contactId: 'dr-patel',
    contactName: 'Dr. Ravi Patel',
    contactAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dr-patel',
    lastMessage: {
      text: "Your lab results show improvement in your blood sugar levels.",
      timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
      senderId: 'dr-patel'
    },
    unreadCount: 0,
    isOnline: false,
    messages: generateMockMessages('dr-patel', 7)
  }
];

// Original message history for compatibility
export const messageHistory = [
  {
    id: "msg1",
    sender: "user",
    text: "Hello, I need to reschedule my appointment from tomorrow.",
    time: "09:30 AM",
    status: "delivered"
  },
  {
    id: "msg2",
    sender: "recipient",
    text: "Good morning! I'd be happy to help you reschedule. Let me check our availability. What time works best for you?",
    time: "09:32 AM",
    status: "delivered"
  },
  {
    id: "msg3",
    sender: "user",
    text: "Would next Monday at 2pm work?",
    time: "09:33 AM",
    status: "delivered"
  },
  {
    id: "msg4",
    sender: "recipient",
    text: "I've checked our schedule and Monday at 2pm is available. I'll make that change for you right away.",
    time: "09:35 AM",
    status: "delivered"
  },
  {
    id: "msg5",
    sender: "recipient",
    text: "Your appointment has been rescheduled for Monday at 2:00 PM. You'll receive a confirmation email shortly.",
    time: "09:36 AM",
    status: "delivered"
  },
  {
    id: "msg6",
    sender: "user",
    text: "Perfect, thank you so much!",
    time: "09:37 AM",
    status: "delivered"
  },
];

// Original conversations for compatibility
export const conversations = [
  {
    id: "conv1",
    recipient: {
      id: "doctor1",
      name: "Dr. Sarah Miller",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      status: "online",
      role: "Cardiologist"
    },
    lastMessage: {
      text: "Your appointment has been rescheduled for Monday at 2:00 PM.",
      time: "09:36 AM",
      isRead: true,
      sender: "recipient"
    },
    unread: 0
  },
  {
    id: "conv2",
    recipient: {
      id: "doctor2",
      name: "Dr. James Wilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
      status: "offline",
      role: "Neurologist"
    },
    lastMessage: {
      text: "Here are the test results we discussed during your last visit.",
      time: "Yesterday",
      isRead: false,
      sender: "recipient"
    },
    unread: 1
  },
  {
    id: "conv3",
    recipient: {
      id: "nurse1",
      name: "Nurse Robert Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
      status: "online",
      role: "Registered Nurse"
    },
    lastMessage: {
      text: "Just checking in. How are you feeling today?",
      time: "Yesterday",
      isRead: false,
      sender: "recipient"
    },
    unread: 1
  },
  {
    id: "conv4",
    recipient: {
      id: "admin1",
      name: "Medical Records",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Records",
      status: "offline",
      role: "Administration"
    },
    lastMessage: {
      text: "I'll need a copy of my medical history for my insurance.",
      time: "Monday",
      isRead: true,
      sender: "user"
    },
    unread: 0
  },
  {
    id: "conv5",
    recipient: {
      id: "doctor3",
      name: "Dr. Emily Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
      status: "offline",
      role: "Dermatologist"
    },
    lastMessage: {
      text: "Remember to apply the cream twice daily as prescribed.",
      time: "Last week",
      isRead: true,
      sender: "recipient"
    },
    unread: 0
  }
];
