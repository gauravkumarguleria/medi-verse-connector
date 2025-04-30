
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CalendarClock, User, ClipboardCheck, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  
  // Mock data for appointments
  const upcomingAppointments = [
    { id: '1', patient: 'Sarah Johnson', time: '10:00 AM', date: 'Today', type: 'Video' },
    { id: '2', patient: 'Michael Chen', time: '11:30 AM', date: 'Today', type: 'In-person' },
    { id: '3', patient: 'Emily Rodriguez', time: '2:15 PM', date: 'Tomorrow', type: 'Video' },
    { id: '4', patient: 'David Wilson', time: '9:00 AM', date: 'Jun 10, 2023', type: 'In-person' },
  ];

  return (
    <div className="grid gap-6 animate-fade-up">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Doctor Dashboard</h1>
        <p className="text-muted-foreground">Manage your appointments and patient care</p>
      </div>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
              <CalendarClock className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">124</div>
              <User className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">7</div>
              <ClipboardCheck className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unread Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">5</div>
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="px-6 py-4">
          <div className="flex items-center justify-between">
            <CardTitle>Upcoming Appointments</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/appointments')}>View All</Button>
          </div>
        </CardHeader>
        <CardContent className="px-6 py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="font-medium">{appointment.patient}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>{appointment.date}</TableCell>
                  <TableCell>{appointment.type}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">View</Button>
                      <Button variant="outline" size="sm">Reschedule</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorDashboard;
