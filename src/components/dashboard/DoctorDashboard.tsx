
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CalendarClock, User, ClipboardCheck, MessageSquare, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsDesktop } from '@/hooks/use-mobile';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
  
  // Mock data for appointments
  const upcomingAppointments = [
    { id: '1', patient: 'Sarah Johnson', time: '10:00 AM', date: 'Today', type: 'Video' },
    { id: '2', patient: 'Michael Chen', time: '11:30 AM', date: 'Today', type: 'In-person' },
    { id: '3', patient: 'Emily Rodriguez', time: '2:15 PM', date: 'Tomorrow', type: 'Video' },
    { id: '4', patient: 'David Wilson', time: '9:00 AM', date: 'Jun 10, 2023', type: 'In-person' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 p-4 sm:p-6 animate-fade-up">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Doctor Dashboard</h1>
        <p className="text-muted-foreground">Manage your appointments and patient care</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Appointments</CardTitle>
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Patients</CardTitle>
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Reports</CardTitle>
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">5</div>
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Appointments Table */}
      <Card>
        <CardHeader className="px-6 py-4">
          <div className="flex items-center justify-between">
            <CardTitle>Upcoming Appointments</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/appointments')}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px] w-full">
            <div className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead className="hidden sm:table-cell">Time</TableHead>
                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                    <TableHead className="hidden md:table-cell">Type</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">{appointment.patient}</TableCell>
                      <TableCell className="hidden sm:table-cell">{appointment.time}</TableCell>
                      <TableCell className="hidden sm:table-cell">{appointment.date}</TableCell>
                      <TableCell className="hidden md:table-cell">{appointment.type}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                            Reschedule
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      
      {/* Charts and Recent Patients */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Patient Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Activity className="h-10 w-10" />
                <p>Activity chart will be displayed here</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Recent Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Sarah Johnson', 'Michael Chen', 'Emily Rodriguez'].map((patient, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{patient}</p>
                    <p className="text-sm text-muted-foreground">Last visit: yesterday</p>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorDashboard;
