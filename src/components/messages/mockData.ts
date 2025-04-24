
import { Chat, Contact } from './types';

// Add two specific contacts for testing live chat
export const testContacts: Contact[] = [
  {
    id: 'patient-test',
    name: 'John Doe',
    role: 'patient',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=patient-test',
    lastSeen: new Date().toISOString(),
    isOnline: true
  },
  {
    id: 'doctor-test',
    name: 'Dr. Emily Chen',
    role: 'doctor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=doctor-test',
    lastSeen: new Date().toISOString(),
    isOnline: true
  }
];

// Extend the existing mockContacts array
mockContacts.push(...testContacts);
