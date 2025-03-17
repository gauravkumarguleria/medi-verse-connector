
export type UserRole = 'patient' | 'doctor' | 'pharmacist' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface Testimonial {
  id: string;
  content: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  avatar: string;
  availableSlots?: string[];
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  type: 'in-person' | 'video';
}

export interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  inStock: boolean;
  requiresPrescription: boolean;
  image?: string;
}

// IoT-related types
export interface IoTDevice {
  id: string;
  name: string;
  type: string;
  connectionStatus: 'connected' | 'disconnected';
  lastSync: string;
  batteryLevel: number;
}

export interface CloudReport {
  id: string;
  deviceId: string;
  type: string;
  timestamp: string;
  data: Record<string, any>;
  size: string;
}
