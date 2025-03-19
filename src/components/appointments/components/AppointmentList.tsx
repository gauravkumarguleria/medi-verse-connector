
import React from 'react';
import { format } from 'date-fns';
import { Clock, VideoIcon, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Appointment, Doctor } from '@/types';
import { CalendarIcon } from 'lucide-react';

interface AppointmentListProps {
  appointments: Appointment[];
  viewMode: 'upcoming' | 'past' | 'all';
  getDoctorById: (id: string) => Doctor | undefined;
  handleCancelAppointment: (id: string) => void;
}

const AppointmentList = ({ 
  appointments, 
  viewMode, 
  getDoctorById, 
  handleCancelAppointment 
}: AppointmentListProps) => {
  
  if (appointments.length === 0) {
    return (
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
          <Button>Book Appointment</Button>
        </CardContent>
      </Card>
    );
  }

  return (
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
            {appointments.map((appointment) => {
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
  );
};

export default AppointmentList;
