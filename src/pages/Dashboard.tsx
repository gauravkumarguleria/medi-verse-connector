import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  FileText, 
  Layout, 
  MessageSquare, 
  User, 
  Heart, 
  PillBottle, 
  Stethoscope,
  BookOpen,
  Activity,
  Clock,
  Search,
  Bell as BellIcon,
  LogOut as LogOutIcon,
  Weight as WeightIcon,
  Droplets as DropletsIcon,
  BarChart2,
  LineChart,
  Server,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedButton from '@/components/ui/AnimatedButton';
import AppointmentPage from '@/components/appointments/AppointmentPage';
import MedicationPage from '@/components/medications/MedicationPage';
import HealthRecordsPage from '@/components/records/HealthRecordsPage';
import MessagesPage from '@/components/messages/MessagesPage';
import HealthChart from '@/components/dashboard/HealthChart';
import MedicalReminders from '@/components/dashboard/MedicalReminders';
import HealthArticles from '@/components/dashboard/HealthArticles';
import HealthSummary from '@/components/dashboard/HealthSummary';

// Mock user data (in a real app, this would come from authentication context)
const user = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'patient' as const,
  avatar: 'https://i.pravatar.cc/150?img=8'
};

// Mock appointments data
const upcomingAppointments = [
  {
    id: '1',
    doctor: 'Dr. Sarah Williams',
    specialty: 'Cardiologist',
    date: '2023-06-15',
    time: '10:00 AM',
    type: 'video' as const,
    status: 'confirmed' as const
  },
  {
    id: '2',
    doctor: 'Dr. Michael Chen',
    specialty: 'Dermatologist',
    date: '2023-06-20',
    time: '2:30 PM',
    type: 'in-person' as const,
    status: 'confirmed' as const
  }
];

// Mock medications data
const medications = [
  {
    id: '1',
    name: 'Amoxicillin',
    dosage: '500mg',
    frequency: 'Twice daily',
    time: '8:00 AM, 8:00 PM',
    remaining: 5
  },
  {
    id: '2',
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    time: '9:00 AM',
    remaining: 15
  },
  {
    id: '3',
    name: 'Metformin',
    dosage: '850mg',
    frequency: 'Three times daily',
    time: '8:00 AM, 2:00 PM, 8:00 PM',
    remaining: 10
  }
];

// Mock health metrics data
const healthMetrics = [
  { id: '1', name: 'Blood Pressure', value: '120/80', unit: 'mmHg', status: 'normal' },
  { id: '2', name: 'Heart Rate', value: '72', unit: 'bpm', status: 'normal' },
  { id: '3', name: 'Weight', value: '70', unit: 'kg', status: 'normal' },
  { id: '4', name: 'Blood Glucose', value: '95', unit: 'mg/dL', status: 'normal' }
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeMetric, setActiveMetric] = useState('bloodPressure');

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="bg-background border-b sticky top-0 z-30">
        <div className="container px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-xl font-bold text-primary">MediVerse</Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Input 
              placeholder="Search..." 
              className="w-64"
              prefixIcon={<Search className="h-4 w-4 text-muted-foreground" />}
            />
            <Badge variant="outline" className="py-1">
              Patient Dashboard
            </Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <BellIcon className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="hidden md:inline font-medium">{user.name}</span>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-16 md:w-64 fixed left-0 top-16 bottom-0 bg-background border-r z-20">
          <div className="py-6 flex flex-col h-full">
            <nav className="space-y-1 px-2">
              <Button
                variant={activeTab === 'overview' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('overview')}
              >
                <Layout className="h-5 w-5 mr-2" />
                <span className="hidden md:inline">Overview</span>
              </Button>
              <Button
                variant={activeTab === 'appointments' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('appointments')}
              >
                <Calendar className="h-5 w-5 mr-2" />
                <span className="hidden md:inline">Appointments</span>
              </Button>
              <Button
                variant={activeTab === 'medications' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('medications')}
              >
                <PillBottle className="h-5 w-5 mr-2" />
                <span className="hidden md:inline">Medications</span>
              </Button>
              <Button
                variant={activeTab === 'records' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('records')}
              >
                <FileText className="h-5 w-5 mr-2" />
                <span className="hidden md:inline">Health Records</span>
              </Button>
              <Button
                variant={activeTab === 'messages' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('messages')}
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                <span className="hidden md:inline">Messages</span>
              </Button>
              <Button
                variant={activeTab === 'iot' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('iot')}
              >
                <Server className="h-5 w-5 mr-2" />
                <span className="hidden md:inline">IoT Reports</span>
              </Button>
              <Button
                variant={activeTab === 'profile' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('profile')}
              >
                <User className="h-5 w-5 mr-2" />
                <span className="hidden md:inline">Profile</span>
              </Button>
            </nav>
            
            <div className="mt-auto px-2">
              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOutIcon className="h-5 w-5 mr-2" />
                <span className="hidden md:inline">Log Out</span>
              </Button>
            </div>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="ml-16 md:ml-64 p-4 md:p-8 w-[calc(100%-4rem)] md:w-[calc(100%-16rem)]">
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-up">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {user.name}</h1>
                  <p className="text-muted-foreground">Here's your health overview for today</p>
                </div>
                <Button asChild>
                  <Link to="/appointments">Book Appointment</Link>
                </Button>
              </div>
              
              {/* Health Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {healthMetrics.map((metric, index) => (
                  <GlassCard key={metric.id} className="text-center">
                    <div className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${
                      metric.status === 'normal' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 
                      metric.status === 'warning' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 
                      'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                    } mb-3`}>
                      {index === 0 ? <Activity className="h-5 w-5" /> :
                       index === 1 ? <Heart className="h-5 w-5" /> :
                       index === 2 ? <WeightIcon className="h-5 w-5" /> :
                       <DropletsIcon className="h-5 w-5" />}
                    </div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">{metric.name}</h3>
                    <p className="text-2xl font-semibold">
                      {metric.value} <span className="text-sm font-normal text-muted-foreground">{metric.unit}</span>
                    </p>
                  </GlassCard>
                ))}
              </div>
              
              {/* Health Chart and Summary */}
              <div className="grid md:grid-cols-4 gap-6">
                <HealthChart activeMetric={activeMetric} />
                <HealthSummary />
              </div>
              
              {/* Chart Controls */}
              <div className="flex flex-wrap gap-2 justify-center">
                <Button 
                  variant={activeMetric === 'bloodPressure' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setActiveMetric('bloodPressure')}
                >
                  <Activity className="h-4 w-4 mr-1" />
                  Blood Pressure
                </Button>
                <Button 
                  variant={activeMetric === 'heartRate' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setActiveMetric('heartRate')}
                >
                  <Heart className="h-4 w-4 mr-1" />
                  Heart Rate
                </Button>
                <Button 
                  variant={activeMetric === 'bloodGlucose' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setActiveMetric('bloodGlucose')}
                >
                  <DropletsIcon className="h-4 w-4 mr-1" />
                  Blood Glucose
                </Button>
                <Button 
                  variant={activeMetric === 'weight' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setActiveMetric('weight')}
                >
                  <WeightIcon className="h-4 w-4 mr-1" />
                  Weight
                </Button>
              </div>
              
              {/* Medical Reminders */}
              <MedicalReminders />
              
              {/* Appointments & Articles Section */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Upcoming Appointments */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle>Upcoming Appointments</CardTitle>
                      <CardDescription>Your scheduled appointments</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/appointments">View All</Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {upcomingAppointments.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingAppointments.map((appointment) => (
                          <div 
                            key={appointment.id} 
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <div className="flex items-center gap-4">
                              <div className="bg-primary/10 p-3 rounded-full">
                                <Stethoscope className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium">{appointment.doctor}</h4>
                                <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(appointment.date).toLocaleDateString('en-US', { 
                                      month: 'short', 
                                      day: 'numeric', 
                                      year: 'numeric' 
                                    })}
                                  </span>
                                  <Clock className="h-3.5 w-3.5 ml-2 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">{appointment.time}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={appointment.type === 'video' ? 'outline' : 'secondary'}>
                                {appointment.type === 'video' ? 'Video Call' : 'In-Person'}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                        <h3 className="text-lg font-medium mb-1">No Upcoming Appointments</h3>
                        <p className="text-muted-foreground mb-4">Book a consultation with a doctor</p>
                        <Button>Book Appointment</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Health Articles */}
                <HealthArticles />
              </div>
              
              {/* Medications & Health Records */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Medications */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle>Medications</CardTitle>
                      <CardDescription>Your prescribed medications</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/medications">View All</Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {medications.slice(0, 2).map((medication) => (
                        <div 
                          key={medication.id} 
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-medical-orange/10 p-2 rounded-full">
                              <PillBottle className="h-5 w-5 text-medical-orange" />
                            </div>
                            <div>
                              <h4 className="font-medium">{medication.name}</h4>
                              <p className="text-xs text-muted-foreground">{medication.dosage} • {medication.frequency}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="ml-auto">
                            {medication.remaining} left
                          </Badge>
                        </div>
                      ))}
                      {medications.length > 2 && (
                        <p className="text-sm text-muted-foreground text-center">
                          +{medications.length - 2} more medications
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Health Records */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle>Health Records</CardTitle>
                      <CardDescription>Your recent medical documents</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/records">View All</Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="bg-medical-blue/10 p-2 rounded-full">
                            <FileText className="h-5 w-5 text-medical-blue" />
                          </div>
                          <div>
                            <h4 className="font-medium">Blood Test Results</h4>
                            <p className="text-xs text-muted-foreground">Uploaded on May 14, 2023</p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">View</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="bg-medical-green/10 p-2 rounded-full">
                            <BookOpen className="h-5 w-5 text-medical-green" />
                          </div>
                          <div>
                            <h4 className="font-medium">Prescription</h4>
                            <p className="text-xs text-muted-foreground">Dr. Williams • April 28, 2023</p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">View</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <GlassCard className="flex flex-col items-center justify-center text-center">
                  <div className="bg-medical-blue/10 p-3 rounded-full mb-3">
                    <Search className="h-6 w-6 text-medical-blue" />
                  </div>
                  <h3 className="font-medium">Find Doctor</h3>
                  <p className="text-xs text-muted-foreground mb-4">Search by specialty</p>
                  <Button size="sm" variant="outline" className="mt-auto">Search</Button>
                </GlassCard>
                <GlassCard className="flex flex-col items-center justify-center text-center">
                  <div className="bg-medical-green/10 p-3 rounded-full mb-3">
                    <PillBottle className="h-6 w-6 text-medical-green" />
                  </div>
                  <h3 className="font-medium">Order Medicine</h3>
                  <p className="text-xs text-muted-foreground mb-4">Refill or new order</p>
                  <Button size="sm" variant="outline" className="mt-auto">Order</Button>
                </GlassCard>
                <GlassCard className="flex flex-col items-center justify-center text-center">
                  <div className="bg-medical-purple/10 p-3 rounded-full mb-3">
                    <MessageSquare className="h-6 w-6 text-medical-purple" />
                  </div>
                  <h3 className="font-medium">Chat Support</h3>
                  <p className="text-xs text-muted-foreground mb-4">Get help instantly</p>
                  <Button size="sm" variant="outline" className="mt-auto">Chat</Button>
                </GlassCard>
                <GlassCard className="flex flex-col items-center justify-center text-center">
                  <div className="bg-medical-orange/10 p-3 rounded-full mb-3">
                    <FileText className="h-6 w-6 text-medical-orange" />
                  </div>
                  <h3 className="font-medium">Upload Records</h3>
                  <p className="text-xs text-muted-foreground mb-4">Add new documents</p>
                  <Button size="sm" variant="outline" className="mt-auto">Upload</Button>
                </GlassCard>
              </div>
            </div>
          )}
          
          {activeTab === 'appointments' && <AppointmentPage />}
          
          {activeTab === 'medications' && <MedicationPage />}
          
          {activeTab === 'records' && <HealthRecordsPage />}
          
          {activeTab === 'messages' && <MessagesPage />}
          
          {activeTab === 'iot' && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
              <div className="mb-6 text-muted-foreground">
                <Server className="h-16 w-16" />
              </div>
              <h2 className="text-2xl font-bold mb-2">IoT Reports Dashboard</h2>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                View and download your IoT device reports and adjust your system settings based on device data.
              </p>
              <Button asChild>
                <Link to="/iot-reports">
                  <Download className="h-4 w-4 mr-2" />
                  Go to IoT Reports
                </Link>
              </Button>
            </div>
          )}
          
          {(activeTab !== 'overview' && 
            activeTab !== 'appointments' && 
            activeTab !== 'medications' && 
            activeTab !== 'records' && 
            activeTab !== 'messages' &&
            activeTab !== 'iot') && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
              <div className="mb-6 text-muted-foreground">
                {activeTab === 'medications' && <PillBottle className="h-16 w-16" />}
                {activeTab === 'records' && <FileText className="h-16 w-16" />}
                {activeTab === 'messages' && <MessageSquare className="h-16 w-16" />}
                {activeTab === 'profile' && <User className="h-16 w-16" />}
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h2>
              <p className="text-muted-foreground mb-6 text-center">
                This section is under construction and will be available soon.
              </p>
              <Button onClick={() => setActiveTab('overview')}>
                Return to Overview
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
