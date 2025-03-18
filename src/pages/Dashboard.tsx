
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardMain from '@/components/dashboard/DashboardMain';
import IoTReportsPage from '@/components/iot/IoTReportsPage';
import AppointmentPage from '@/components/appointments/AppointmentPage';
import MedicationPage from '@/components/medications/MedicationPage';
import HealthRecordsPage from '@/components/records/HealthRecordsPage';
import MessagesPage from '@/components/messages/MessagesPage';
import ProfileSection from '@/components/profile/ProfileSection';
import SettingsSection from '@/components/settings/SettingsSection';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { UserProvider } from '@/contexts/UserContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop() || 'overview';
  
  const handleTabChange = (value: string) => {
    navigate(`/dashboard/${value === 'overview' ? '' : value}`);
  };
  
  return (
    <UserProvider>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<DashboardMain />} />
          <Route path="/overview" element={<DashboardMain />} />
          <Route path="/iot-reports" element={<IoTReportsPage hideLayout />} />
          <Route path="/appointments" element={<AppointmentPage hideLayout />} />
          <Route path="/medications" element={<MedicationPage />} />
          <Route path="/records" element={<HealthRecordsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/iot-devices" element={<IoTReportsPage hideLayout />} />
          <Route path="/profile" element={<ProfileSection />} />
          <Route path="/vitals" element={<div>Vitals Page</div>} />
          <Route path="/settings" element={<SettingsSection />} />
        </Routes>
      </DashboardLayout>
    </UserProvider>
  );
};

export default Dashboard;
