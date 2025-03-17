
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import HealthSummary from '@/components/dashboard/HealthSummary';
import HealthChart from '@/components/dashboard/HealthChart';
import MedicalReminders from '@/components/dashboard/MedicalReminders';
import HealthArticles from '@/components/dashboard/HealthArticles';

const Dashboard: React.FC = () => {
  const [activeMetric, setActiveMetric] = useState<string>('bloodPressure');
  
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-up">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to your health dashboard</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <HealthSummary />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="md:col-span-2">
            <HealthChart activeMetric={activeMetric} />
          </div>
          <div>
            <MedicalReminders />
          </div>
        </div>
        
        <HealthArticles />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
