
import { useState } from 'react';
import HealthSummary from '@/components/dashboard/HealthSummary';
import HealthChart from '@/components/dashboard/HealthChart';
import MedicalReminders from '@/components/dashboard/MedicalReminders';
import HealthArticles from '@/components/dashboard/HealthArticles';
import { useUser } from '@/contexts/UserContext';

const DashboardMain = () => {
  const [activeMetric, setActiveMetric] = useState('bloodPressure');
  const { user } = useUser();
  
  const firstName = user.name.split(' ')[0];
  
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 p-4 sm:p-6 animate-fade-up">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Welcome Back, {firstName}</h1>
        <p className="text-muted-foreground">Here's your health overview for today</p>
      </div>
      
      <div className="grid gap-4 sm:gap-6">
        {/* Health Summary and Chart Section */}
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="sm:col-span-1">
            <HealthSummary />
          </div>
          <div className="sm:col-span-1 lg:col-span-2">
            <HealthChart activeMetric={activeMetric} />
          </div>
        </div>
        
        {/* Reminders and Articles Section */}
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="sm:col-span-2">
            <MedicalReminders />
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <HealthArticles />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMain;
