
import { Doctor, Appointment } from '@/types';

// Mock data for doctors
export const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Geeta Sharma',
    specialty: 'Cardiologist',
    experience: 10,
    rating: 4.8,
    avatar: 'https://i.pravatar.cc/150?img=32',
    availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM']
  },
  {
    id: '2',
    name: 'Dr. Partik Patel',
    specialty: 'Dermatologist',
    experience: 8,
    rating: 4.7,
    avatar: 'https://i.pravatar.cc/150?img=60',
    availableSlots: ['09:30 AM', '10:30 AM', '01:30 PM', '02:30 PM', '04:30 PM']
  },
  {
    id: '3',
    name: 'Dr. Riya Gupta',
    specialty: 'Neurologist',
    experience: 12,
    rating: 4.9,
    avatar: 'https://i.pravatar.cc/150?img=47',
    availableSlots: ['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM']
  },
  {
    id: '4',
    name: 'Dr.  R. Reddy',
    specialty: 'Pediatrician',
    experience: 15,
    rating: 4.9,
    avatar: 'https://i.pravatar.cc/150?img=51',
    availableSlots: ['08:30 AM', '09:30 AM', '11:30 AM', '01:30 PM', '03:30 PM']
  },
  {
    id: '5',
    name: 'Dr. Sonia Singh',
    specialty: 'Psychiatrist',
    experience: 9,
    rating: 4.6,
    avatar: 'https://i.pravatar.cc/150?img=45',
    availableSlots: ['10:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM']
  }
];

// Mock appointments data
export const mockAppointments: Appointment[] = [
  {
    id: '1',
    doctorId: '1',
    patientId: '1',
    date: '2024-05-20',
    time: '10:00 AM',
    status: 'scheduled',
    type: 'video'
  },
  {
    id: '2',
    doctorId: '2',
    patientId: '1',
    date: '2024-05-25',
    time: '02:30 PM',
    status: 'scheduled',
    type: 'in-person'
  },
  {
    id: '3',
    doctorId: '3',
    patientId: '1',
    date: '2024-06-05',
    time: '08:00 AM',
    status: 'scheduled',
    type: 'video'
  },
  {
    id: '4',
    doctorId: '4',
    patientId: '1',
    date: '2024-05-15',
    time: '09:30 AM',
    status: 'completed',
    type: 'in-person'
  },
  {
    id: '5',
    doctorId: '5',
    patientId: '1',
    date: '2024-05-10',
    time: '11:00 AM',
    status: 'cancelled',
    type: 'video'
  }
];
