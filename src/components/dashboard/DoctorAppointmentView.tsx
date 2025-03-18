
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { CalendarIcon, Clock, User, FileText, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Appointment } from '@/types';

// Mock appointments data
const mockAppointments: Appointment[] = [
  {
    id: '1',
    doctorId: '1',
    patientId: '1',
    date: '2024-05-20',
    time: '10:00 AM',
    status: 'scheduled',
    type: 'video',
    patientName: 'Sarah Johnson',
    patientEmail: 'sarah.j@example.com',
    reason: 'Annual checkup'
  },
  {
    id: '2',
    doctorId: '1',
    patientId: '2',
    date: '2024-05-20',
    time: '02:30 PM',
    status: 'scheduled',
    type: 'in-person',
    patientName: 'Michael Chen',
    patientEmail: 'michael.c@example.com',
    reason: 'Follow-up consultation'
  },
  {
    id: '3',
    doctorId: '1',
    patientId: '3',
    date: '2024-05-22',
    time: '08:00 AM',
    status: 'scheduled',
    type: 'video',
    patientName: 'Emily Rodriguez',
    patientEmail: 'emily.r@example.com',
    reason: 'Skin condition'
  },
  {
    id: '4',
    doctorId: '1',
    patientId: '4',
    date: '2024-05-15',
    time: '09:30 AM',
    status: 'completed',
    type: 'in-person',
    patientName: 'David Wilson',
    patientEmail: 'david.w@example.com',
    reason: 'Prescription renewal'
  },
  {
    id: '5',
    doctorId: '1',
    patientId: '5',
    date: '2024-05-10',
    time: '11:00 AM',
    status: 'cancelled',
    type: 'video',
    patientName: 'Olivia Thompson',
    patientEmail: 'olivia.t@example.com',
    reason: 'Flu symptoms'
  }
];

const DoctorAppointmentView = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [viewTab, setViewTab] = useState<string>('upcoming');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [appointments] = useState<Appointment[]>(mockAppointments);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  
  // Filter appointments based on selected date and tab
  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Format date to compare with appointment date
    const selectedDateStr = date ? format(date, 'yyyy-MM-dd') : '';
    const appointmentDateStr = appointment.date;
    
    // Filter by date if date is selected
    const matchesDate = !date || selectedDateStr === appointmentDateStr;
    
    // Filter by tab
    if (viewTab === 'upcoming') {
      return matchesDate && appointmentDate >= today && appointment.status === 'scheduled';
    } else if (viewTab === 'past') {
      return matchesDate && (appointmentDate < today || appointment.status === 'completed');
    } else if (viewTab === 'cancelled') {
      return matchesDate && appointment.status === 'cancelled';
    } else {
      return matchesDate;
    }
  });
  
  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsDialog(true);
  };
  
  // Update appointment status
  const updateAppointmentStatus = (id: string, status: 'scheduled' | 'completed' | 'cancelled') => {
    // In a real app, this would be an API call
    console.log(`Updating appointment ${id} status to ${status}`);
    setShowDetailsDialog(false);
  };
  
  // Get appointment status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Scheduled</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Manage Appointments</h1>
        <p className="text-muted-foreground">View and manage patient appointments</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Appointment Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Today</span>
                <Badge className="bg-primary">{appointments.filter(a => a.date === format(new Date(), 'yyyy-MM-dd')).length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">This Week</span>
                <Badge className="bg-primary">12</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">This Month</span>
                <Badge className="bg-primary">45</Badge>
              </div>
              <div className="border-t pt-4 mt-2">
                <Button variant="outline" className="w-full" onClick={() => setDate(undefined)}>
                  Reset Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Tabs defaultValue="upcoming" value={viewTab} onValueChange={setViewTab}>
            <TabsList className="grid grid-cols-4 w-[400px]">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
            
            {['upcoming', 'past', 'cancelled', 'all'].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-6">
                {filteredAppointments.length > 0 ? (
                  <Card>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Patient</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredAppointments.map((appointment) => (
                            <TableRow key={appointment.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="h-5 w-5 text-primary" />
                                  </div>
                                  <div>
                                    <p className="font-medium">{appointment.patientName}</p>
                                    <p className="text-xs text-muted-foreground">{appointment.patientEmail}</p>
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
                                {getStatusBadge(appointment.status)}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleViewDetails(appointment)}
                                  >
                                    Details
                                  </Button>
                                  
                                  {appointment.status === 'scheduled' && (
                                    <Button 
                                      size="sm"
                                      onClick={() => appointment.type === 'video' ? 
                                        window.open('https://meet.google.com', '_blank') : 
                                        handleViewDetails(appointment)
                                      }
                                    >
                                      {appointment.type === 'video' ? 'Join Call' : 'Check In'}
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
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
                      <p className="text-muted-foreground text-center max-w-md">
                        {tab === 'upcoming'
                          ? "You don't have any upcoming appointments for the selected date."
                          : tab === 'past'
                          ? "You don't have any past appointments for the selected date."
                          : tab === 'cancelled'
                          ? "You don't have any cancelled appointments for the selected date."
                          : "You don't have any appointments for the selected date."}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
      
      {/* Appointment Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[550px]">
          {selectedAppointment && (
            <>
              <DialogHeader>
                <DialogTitle>Appointment Details</DialogTitle>
                <DialogDescription>
                  Complete information about this appointment
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{selectedAppointment.patientName}</h3>
                    <p className="text-sm text-muted-foreground">{selectedAppointment.patientEmail}</p>
                    {getStatusBadge(selectedAppointment.status)}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Date</h4>
                    <p className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      {format(new Date(selectedAppointment.date), 'PPP')}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Time</h4>
                    <p className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {selectedAppointment.time}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Type</h4>
                    <p className="capitalize">{selectedAppointment.type}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                    <p className="capitalize">{selectedAppointment.status}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Reason for Visit</h4>
                  <p>{selectedAppointment.reason || 'No reason provided'}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Notes</h4>
                  <p className="text-sm">No additional notes for this appointment.</p>
                </div>
              </div>
              
              <DialogFooter className="flex justify-between">
                {selectedAppointment.status === 'scheduled' && (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => updateAppointmentStatus(selectedAppointment.id, 'cancelled')}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={() => updateAppointmentStatus(selectedAppointment.id, 'completed')}
                      className="border-green-200 text-green-600 hover:bg-green-50"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Mark as Completed
                    </Button>
                  </div>
                )}
                
                <Button onClick={() => setShowDetailsDialog(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorAppointmentView;
