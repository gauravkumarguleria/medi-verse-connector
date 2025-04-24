
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardMain from '@/components/dashboard/DashboardMain';
import DoctorDashboard from '@/components/dashboard/DoctorDashboard';
import IoTDevicesPage from '@/components/iot/IoTDevicesPage';
import AppointmentPage from '@/components/appointments/AppointmentPage';
import DoctorAppointmentView from '@/components/dashboard/DoctorAppointmentView';
import MedicationPage from '@/components/medications/MedicationPage';
import DoctorMedicationPage from '@/components/medications/DoctorMedicationPage';
import HealthRecordsPage from '@/components/records/HealthRecordsPage';
import MessagesPage from '@/components/messages/MessagesPage';
import ProfileSection from '@/components/profile/ProfileSection';
import SettingsSection from '@/components/settings/SettingsSection';
import { useUser } from '@/contexts/UserContext';
import { useEffect } from 'react';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useUser();
  
  // Add effect to redirect to login page if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log("Dashboard: User not authenticated, redirecting to auth");
      navigate('/auth', { replace: true });
    } else if (!isLoading && isAuthenticated) {
      console.log("Dashboard: User authenticated:", user);
    }
  }, [isAuthenticated, isLoading, navigate, user]);

  // Show nothing while checking authentication
  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  // Don't render dashboard if not authenticated
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={user.role === 'doctor' ? <DoctorDashboard /> : <DashboardMain />} />
        <Route path="/overview" element={user.role === 'doctor' ? <DoctorDashboard /> : <DashboardMain />} />
        <Route path="/appointments" element={
          user.role === 'doctor' 
            ? <DoctorAppointmentView /> 
            : <AppointmentPage hideLayout />
        } />
        <Route path="/medications" element={
          user.role === 'doctor'
            ? <DoctorMedicationPage />
            : <MedicationPage />
        } />
        <Route path="/records" element={<HealthRecordsPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/iot-devices" element={<IoTDevicesPage hideLayout />} />
        <Route path="/profile" element={<ProfileSection />} />
        <Route path="/settings" element={<SettingsSection />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;
