
import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  CheckCircle2, 
  XCircle, 
  Filter, 
  Plus,
  VideoIcon,
  MapPin
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Doctor, Appointment } from '@/types';

// Mock data for doctors
const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Williams',
    specialty: 'Cardiologist',
    experience: 10,
    rating: 4.8,
    avatar: 'https://i.pravatar.cc/150?img=32',
    availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM']
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Dermatologist',
    experience: 8,
    rating: 4.7,
    avatar: 'https://i.pravatar.cc/150?img=60',
    availableSlots: ['09:30 AM', '10:30 AM', '01:30 PM', '02:30 PM', '04:30 PM']
  },
  {
    id: '3',
    name: 'Dr. Jessica Brooks',
    specialty: 'Neurologist',
    experience: 12,
    rating: 4.9,
    avatar: 'https://i.pravatar.cc/150?img=47',
    availableSlots: ['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM']
  },
  {
    id: '4',
    name: 'Dr. Robert Kim',
    specialty: 'Pediatrician',
    experience: 15,
    rating: 4.9,
    avatar: 'https://i.pravatar.cc/150?img=51',
    availableSlots: ['08:30 AM', '09:30 AM', '11:30 AM', '01:30 PM', '03:30 PM']
  },
  {
    id: '5',
    name: 'Dr. Emily Patterson',
    specialty: 'Psychiatrist',
    experience: 9,
    rating: 4.6,
    avatar: 'https://i.pravatar.cc/150?img=45',
    availableSlots: ['10:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM']
  }
];

// Mock appointments data
const mockAppointments: Appointment[] = [
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

// Form schema for booking appointments
const appointmentFormSchema = z.object({
  doctorId: z.string({
    required_error: "Please select a doctor.",
  }),
  date: z.date({
    required_error: "Please select a date.",
  }),
  time: z.string({
    required_error: "Please select a time.",
  }),
  type: z.enum(['video', 'in-person'], {
    required_error: "Please select appointment type.",
  }),
  notes: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

const AppointmentPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [viewMode, setViewMode] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const [showBookDialog, setShowBookDialog] = useState(false);

  // Initialize form
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      type: 'video',
      notes: '',
    },
  });

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
  const getDoctorById = (id: string): Doctor | undefined => {
    return mockDoctors.find(doctor => doctor.id === id);
  };

  // Handle booking form submission
  const onSubmit = (data: AppointmentFormValues) => {
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
    form.reset();
  };

  // Handle doctor selection
  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    form.setValue('doctorId', doctor.id);
  };

  // Handle appointment cancellation
  const handleCancelAppointment = (id: string) => {
    setAppointments(appointments.map(appointment => 
      appointment.id === id ? { ...appointment, status: 'cancelled' } : appointment
    ));
  };

  return (
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
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex gap-2">
          <Button 
            variant={viewMode === 'upcoming' ? 'default' : 'outline'} 
            onClick={() => setViewMode('upcoming')}
            size="sm"
          >
            Upcoming
          </Button>
          <Button 
            variant={viewMode === 'past' ? 'default' : 'outline'} 
            onClick={() => setViewMode('past')}
            size="sm"
          >
            Past
          </Button>
          <Button 
            variant={viewMode === 'all' ? 'default' : 'outline'} 
            onClick={() => setViewMode('all')}
            size="sm"
          >
            All
          </Button>
        </div>

        <div className="flex gap-2 items-center ml-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {selectedDate ? format(selectedDate, 'PPP') : 'Select date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Appointments</SheetTitle>
                <SheetDescription>
                  Apply filters to find specific appointments
                </SheetDescription>
              </SheetHeader>
              <div className="py-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Appointment Type</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">All</Button>
                    <Button variant="outline" size="sm">
                      <VideoIcon className="h-4 w-4 mr-2" />
                      Video
                    </Button>
                    <Button variant="outline" size="sm">
                      <MapPin className="h-4 w-4 mr-2" />
                      In-person
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Status</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">All</Button>
                    <Button variant="outline" size="sm">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Completed
                    </Button>
                    <Button variant="outline" size="sm">
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancelled
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Doctor</h3>
                  <Input type="text" placeholder="Search doctor" />
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline">Reset</Button>
                <Button>Apply Filters</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => {
                  const doctor = getDoctorById(appointment.doctorId);
                  return (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full overflow-hidden">
                            <img 
                              src={doctor?.avatar || 'https://i.pravatar.cc/150'} 
                              alt={doctor?.name} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{doctor?.name}</p>
                            <p className="text-xs text-muted-foreground">{doctor?.specialty}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {format(new Date(appointment.date), 'PPP')}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {appointment.time}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {appointment.type === 'video' ? 'Video Call' : 'In-Person'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            appointment.status === 'completed' ? 'default' : 
                            appointment.status === 'cancelled' ? 'destructive' : 
                            'outline'
                          }
                        >
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">Details</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Appointment Details</DialogTitle>
                                <DialogDescription>
                                  View your appointment information
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="flex items-center gap-4">
                                  <div className="h-16 w-16 rounded-full overflow-hidden">
                                    <img 
                                      src={doctor?.avatar || 'https://i.pravatar.cc/150'} 
                                      alt={doctor?.name} 
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-lg">{doctor?.name}</h3>
                                    <p className="text-muted-foreground">{doctor?.specialty}</p>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Date</h4>
                                    <p>{format(new Date(appointment.date), 'PPP')}</p>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Time</h4>
                                    <p>{appointment.time}</p>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Type</h4>
                                    <p>{appointment.type === 'video' ? 'Video Call' : 'In-Person'}</p>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                                    <p>{appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground">Notes</h4>
                                  <p className="text-sm">No additional notes for this appointment.</p>
                                </div>
                              </div>
                              <DialogFooter>
                                {appointment.status === 'scheduled' && (
                                  <Button 
                                    variant="destructive"
                                    onClick={() => handleCancelAppointment(appointment.id)}
                                  >
                                    Cancel Appointment
                                  </Button>
                                )}
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          
                          {appointment.status === 'scheduled' && (
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleCancelAppointment(appointment.id)}
                            >
                              Cancel
                            </Button>
                          )}
                          
                          {appointment.type === 'video' && appointment.status === 'scheduled' && (
                            <Button size="sm">Join Call</Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <CalendarIcon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-1">No appointments found</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              {viewMode === 'upcoming' 
                ? "You don't have any upcoming appointments. Book a consultation with a doctor."
                : "You don't have any past appointments."}
            </p>
            <Button onClick={() => setShowBookDialog(true)}>Book Appointment</Button>
          </CardContent>
        </Card>
      )}

      {/* Book Appointment Dialog */}
      <Dialog open={showBookDialog} onOpenChange={setShowBookDialog}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Book an Appointment</DialogTitle>
            <DialogDescription>
              Choose a doctor, date, and time for your appointment.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Doctor Selection */}
              <FormField
                control={form.control}
                name="doctorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Doctor</FormLabel>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      {mockDoctors.map((doctor) => (
                        <div 
                          key={doctor.id}
                          className={cn(
                            "flex items-center gap-3 p-3 border rounded-md cursor-pointer transition-colors",
                            selectedDoctor?.id === doctor.id 
                              ? "border-primary bg-primary/5" 
                              : "hover:border-primary/50"
                          )}
                          onClick={() => handleDoctorSelect(doctor)}
                        >
                          <div className="h-12 w-12 rounded-full overflow-hidden">
                            <img 
                              src={doctor.avatar} 
                              alt={doctor.name} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{doctor.name}</p>
                            <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Date & Time Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Appointment Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => {
                              // Disable dates in the past
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              return date < today;
                            }}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Appointment Time</FormLabel>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {selectedDoctor?.availableSlots?.map((slot) => (
                          <Button
                            key={slot}
                            type="button"
                            variant={field.value === slot ? "default" : "outline"}
                            className="text-sm"
                            onClick={() => {
                              field.onChange(slot);
                              setSelectedTime(slot);
                            }}
                          >
                            {slot}
                          </Button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Appointment Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Appointment Type</FormLabel>
                    <div className="flex gap-4 mt-2">
                      <Button
                        type="button"
                        variant={field.value === 'video' ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => field.onChange('video')}
                      >
                        <VideoIcon className="h-4 w-4 mr-2" />
                        Video Call
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === 'in-person' ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => field.onChange('in-person')}
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        In-Person
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes (Optional)</FormLabel>
                    <FormControl>
                      <textarea
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none min-h-[100px]"
                        placeholder="Any special requirements or information for the doctor"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowBookDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">Book Appointment</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentPage;
