
import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import HealthSummary from '@/components/dashboard/HealthSummary';
import HealthChart from '@/components/dashboard/HealthChart';
import MedicalReminders from '@/components/dashboard/MedicalReminders';
import HealthArticles from '@/components/dashboard/HealthArticles';
import IoTReportsPage from '@/components/iot/IoTReportsPage';
import AppointmentPage from '@/components/appointments/AppointmentPage';
import MedicationPage from '@/components/medications/MedicationPage';
import HealthRecordsPage from '@/components/records/HealthRecordsPage';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

const DashboardMain = () => {
  const [activeMetric, setActiveMetric] = useState('bloodPressure');
  
  return (
    <div className="grid gap-6 animate-fade-up">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Welcome Back, John</h1>
        <p className="text-muted-foreground">Here's your health overview for today</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <HealthSummary />
        <div className="md:col-span-2">
          <HealthChart activeMetric={activeMetric} />
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <MedicalReminders className="lg:col-span-2" />
        <HealthArticles />
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop() || 'overview';
  
  const handleTabChange = (value: string) => {
    navigate(`/dashboard/${value === 'overview' ? '' : value}`);
  };
  
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<DashboardMain />} />
        <Route path="/overview" element={<DashboardMain />} />
        <Route path="/iot-reports" element={<IoTReportsPage hideLayout />} />
        <Route path="/appointments" element={<AppointmentPage hideLayout />} />
        <Route path="/medications" element={<MedicationPage />} />
        <Route path="/records" element={<HealthRecordsPage />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;
