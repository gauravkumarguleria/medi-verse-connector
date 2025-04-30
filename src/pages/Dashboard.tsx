
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardMain from '@/components/dashboard/DashboardMain';
import DoctorDashboard from '@/components/dashboard/DoctorDashboard';
import AppointmentPage from '@/components/appointments/AppointmentPage';
import DoctorAppointmentView from '@/components/dashboard/DoctorAppointmentView';
import MedicationPage from '@/components/medications/MedicationPage';
import DoctorMedicationPage from '@/components/medications/DoctorMedicationPage';
import HealthRecordsPage from '@/components/records/HealthRecordsPage';
import MessagesPage from '@/components/messages/MessagesPage';
import ProfileSection from '@/components/profile/ProfileSection';
import SettingsSection from '@/components/settings/SettingsSection';
import { useUser } from '@/contexts/UserContext';
import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useUser();
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  
  // Add effect to redirect to login page if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log("Dashboard: User not authenticated, redirecting to auth");
      navigate('/auth', { replace: true });
    } else if (!isLoading && isAuthenticated) {
      console.log("Dashboard: User authenticated:", user);
    }

    // Set a timeout to avoid infinite loading states
    const timer = setTimeout(() => {
      setLoadingTimeout(true);
    }, 3000); // Reduced from 5000ms to 3000ms

    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading, navigate, user]);

  // Show a better loading state with a timeout fallback
  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Spinner size="lg" />
        <p className="mt-4 text-muted-foreground">
          Loading your dashboard...
        </p>
        {loadingTimeout && (
          <div className="mt-4 text-center max-w-md">
            <p className="text-sm text-red-500">
              Loading is taking longer than expected.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Refresh page
            </button>
          </div>
        )}
      </div>
    );
  }

  // Don't render dashboard if not authenticated and show a clearer message
  if (!isAuthenticated) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <p className="text-lg text-muted-foreground">
          You must be logged in to view the dashboard
        </p>
        <button 
          onClick={() => navigate('/auth')}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Go to login page
        </button>
      </div>
    );
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
        <Route path="/profile" element={<ProfileSection />} />
        <Route path="/settings" element={<SettingsSection />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;
