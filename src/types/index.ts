
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'pharmacist' | 'admin';
  profilePicture?: string;
  avatar?: string;
  createdAt?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  avatar: string;
  availableSlots: string[];
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  type: 'video' | 'in-person';
  patientName?: string;
  patientEmail?: string;
  reason?: string;
}

export type UserRole = 'patient' | 'doctor' | 'pharmacist' | 'admin';

export interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
  userRole?: UserRole;
}
