
import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import DashboardMain from '@/components/dashboard/DashboardMain';
import DoctorDashboard from '@/components/dashboard/DoctorDashboard';
import IoTReportsPage from '@/components/iot/IoTReportsPage';
import LiveSensorData from '@/components/iot/LiveSensorData';
import AppointmentPage from '@/components/appointments/AppointmentPage';
import DoctorAppointmentView from '@/components/dashboard/DoctorAppointmentView';
import MedicationPage from '@/components/medications/MedicationPage';
import DoctorMedicationPage from '@/components/medications/DoctorMedicationPage';
import HealthRecordsPage from '@/components/records/HealthRecordsPage';
import MessagesPage from '@/components/messages/MessagesPage';
import ProfileSection from '@/components/profile/ProfileSection';
import SettingsSection from '@/components/settings/SettingsSection';
import PharmacyStore from '@/components/pharmacy/PharmacyStore';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading } = useUser();
  
  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data || !data.session) {
          console.log('User not authenticated, redirecting to login');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        navigate('/login');
      }
    };
    
    if (!isLoading) {
      checkAuth();
    }
  }, [navigate, isLoading]);
  
  // Handle tab changes
  const handleTabChange = (value: string) => {
    navigate(`/dashboard/${value === 'overview' ? '' : value}`);
  };
  
  // If still loading user data, don't render components yet
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  return (
    <Routes>
      <Route path="/" element={user.role === 'doctor' ? <DoctorDashboard /> : <DashboardMain />} />
      <Route path="/overview" element={user.role === 'doctor' ? <DoctorDashboard /> : <DashboardMain />} />
      <Route path="/iot-reports" element={<IoTReportsPage hideLayout />} />
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
      <Route path="/iot-devices" element={<IoTReportsPage hideLayout />} />
      <Route path="/profile" element={<ProfileSection />} />
      <Route path="/vitals" element={<LiveSensorData />} />
      <Route path="/settings" element={<SettingsSection />} />
      <Route path="/pharmacy" element={<PharmacyStore />} />
    </Routes>
  );
};

export default Dashboard;
