
import { useState } from 'react';
import HealthSummary from '@/components/dashboard/HealthSummary';
import HealthChart from '@/components/dashboard/HealthChart';
import MedicalReminders from '@/components/dashboard/MedicalReminders';
import HealthArticles from '@/components/dashboard/HealthArticles';
import { useUser } from '@/contexts/UserContext';

const DashboardMain = () => {
  const [activeMetric, setActiveMetric] = useState('bloodPressure');
  const { user } = useUser();
  
  // Get the first name for the welcome message
  const firstName = user.name.split(' ')[0];
  
  return (
    <div className="grid gap-6 animate-fade-up">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Welcome Back, {firstName}</h1>
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

export default DashboardMain;
