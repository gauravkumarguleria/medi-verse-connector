export interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor';
  profilePicture?: string;
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
