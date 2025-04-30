
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
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

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const currentPath = location.pathname.split('/').pop() || 'overview';
  
  const handleTabChange = (value: string) => {
    navigate(`/dashboard/${value === 'overview' ? '' : value}`);
  };
  
  return (
    <DashboardLayout>
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
        <Route path="/iot-devices" element={<LiveSensorData />} />
        <Route path="/profile" element={<ProfileSection />} />
        <Route path="/vitals" element={<LiveSensorData />} />
        <Route path="/settings" element={<SettingsSection />} />
        <Route path="/pharmacy" element={<PharmacyStore />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;
