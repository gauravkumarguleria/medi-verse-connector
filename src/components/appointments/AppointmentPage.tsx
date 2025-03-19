
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Appointment } from '@/types';
import { format } from 'date-fns';
import { mockDoctors, mockAppointments } from './data/mockData';
import BookAppointmentForm from './components/BookAppointmentForm';
import AppointmentFilters from './components/AppointmentFilters';
import AppointmentList from './components/AppointmentList';

interface AppointmentPageProps {
  hideLayout?: boolean;
}

const AppointmentPage: React.FC<AppointmentPageProps> = ({ hideLayout = false }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [viewMode, setViewMode] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const [showBookDialog, setShowBookDialog] = useState(false);

  // Filter appointments based on view mode
  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (viewMode === 'upcoming') {
      return appointmentDate >= today && appointment.status !== 'cancelled';
    } else if (viewMode === 'past') {
      return appointmentDate < today || appointment.status === 'completed';
    }
    return true;
  });

  // Find doctor by ID
  const getDoctorById = (id: string) => {
    return mockDoctors.find(doctor => doctor.id === id);
  };

  // Handle booking form submission
  const onSubmit = (data: any) => {
    // In a real app, this would be an API call to book the appointment
    const newAppointment: Appointment = {
      id: (appointments.length + 1).toString(),
      doctorId: data.doctorId,
      patientId: '1', // Current user ID
      date: format(data.date, 'yyyy-MM-dd'),
      time: data.time,
      status: 'scheduled',
      type: data.type
    };

    setAppointments([...appointments, newAppointment]);
    setShowBookDialog(false);
  };

  // Handle appointment cancellation
  const handleCancelAppointment = (id: string) => {
    setAppointments(appointments.map(appointment => 
      appointment.id === id ? { ...appointment, status: 'cancelled' } : appointment
    ));
  };

  const content = (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Appointments</h1>
          <p className="text-muted-foreground">Manage your upcoming and past appointments</p>
        </div>
        <Button onClick={() => setShowBookDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Book Appointment
        </Button>
      </div>

      {/* Appointment Filters */}
      <AppointmentFilters 
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Appointments List */}
      <AppointmentList
        appointments={filteredAppointments}
        viewMode={viewMode}
        getDoctorById={getDoctorById}
        handleCancelAppointment={handleCancelAppointment}
      />

      {/* Book Appointment Dialog */}
      <Dialog open={showBookDialog} onOpenChange={setShowBookDialog}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Book an Appointment</DialogTitle>
            <DialogDescription>
              Choose a doctor, date, and time for your appointment.
            </DialogDescription>
          </DialogHeader>
          
          <BookAppointmentForm 
            doctors={mockDoctors}
            onSubmit={onSubmit}
            onCancel={() => setShowBookDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );

  if (hideLayout) {
    return content;
  }

  return (
    <DashboardLayout>
      {content}
    </DashboardLayout>
  );
};

export default AppointmentPage;
