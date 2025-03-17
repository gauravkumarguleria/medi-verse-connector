
import React from 'react';
import { 
  Heart, 
  Shield, 
  Zap, 
  Clock, 
  CalendarDays,
  MessageSquare,
  PillBottle,
  File,
  Video
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Feature } from '@/types';

interface FeatureCategoryProps {
  title: string;
  description: string;
  features: Feature[];
  className?: string;
}

const FeatureCategory: React.FC<FeatureCategoryProps> = ({ title, description, features, className }) => {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="text-center max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="bg-white/70 backdrop-blur-sm border border-white/20 hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-foreground/80">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const FeatureSection = () => {
  const patientFeatures: Feature[] = [
    {
      title: 'Virtual Consultations',
      description: 'Connect with doctors through high-quality video calls from the comfort of your home.',
      icon: <Video className="h-5 w-5" />,
    },
    {
      title: 'Appointment Management',
      description: 'Book, reschedule, or cancel appointments with your preferred healthcare providers.',
      icon: <CalendarDays className="h-5 w-5" />,
    },
    {
      title: 'Health Records',
      description: 'Store and access your medical history, test results, and prescriptions securely.',
      icon: <File className="h-5 w-5" />,
    },
    {
      title: 'Medication Tracking',
      description: 'Set reminders for your medications and track your prescription refills.',
      icon: <PillBottle className="h-5 w-5" />,
    },
    {
      title: 'Health Monitoring',
      description: 'Track vital signs and health metrics with personalized insights and trends.',
      icon: <Heart className="h-5 w-5" />,
    },
    {
      title: 'Quick Response Time',
      description: 'Get faster responses for your medical queries with our priority messaging system.',
      icon: <Zap className="h-5 w-5" />,
    },
  ];

  const doctorFeatures: Feature[] = [
    {
      title: 'Patient Management',
      description: 'Efficiently manage your patient roster with detailed profiles and medical histories.',
      icon: <File className="h-5 w-5" />,
    },
    {
      title: 'Schedule Control',
      description: 'Customize your availability and manage appointments with an intuitive calendar interface.',
      icon: <CalendarDays className="h-5 w-5" />,
    },
    {
      title: 'Telehealth Platform',
      description: 'Conduct secure video consultations with built-in notes and prescription capabilities.',
      icon: <Video className="h-5 w-5" />,
    },
    {
      title: 'E-Prescriptions',
      description: 'Prescribe medications digitally with automatic pharmacy integration and verification.',
      icon: <PillBottle className="h-5 w-5" />,
    },
    {
      title: 'Secure Messaging',
      description: 'Communicate with patients and colleagues through our HIPAA-compliant messaging system.',
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      title: 'Analytics Dashboard',
      description: 'Access insights on patient demographics, appointment metrics, and practice performance.',
      icon: <Zap className="h-5 w-5" />,
    },
  ];

  const pharmacyFeatures: Feature[] = [
    {
      title: 'Inventory Management',
      description: 'Track and manage medication stock levels with automated reordering suggestions.',
      icon: <PillBottle className="h-5 w-5" />,
    },
    {
      title: 'Prescription Processing',
      description: 'Receive and process electronic prescriptions with verification and insurance checks.',
      icon: <File className="h-5 w-5" />,
    },
    {
      title: 'Delivery Scheduling',
      description: 'Coordinate medication deliveries with route optimization and real-time tracking.',
      icon: <Clock className="h-5 w-5" />,
    },
    {
      title: 'Patient Communication',
      description: 'Send automated refill reminders and availability notifications to patients.',
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      title: 'Compliance Monitoring',
      description: 'Ensure regulatory compliance with automatic checks and documentation.',
      icon: <Shield className="h-5 w-5" />,
    },
    {
      title: 'Integration Capabilities',
      description: 'Seamlessly connect with hospital systems, insurance providers, and healthcare networks.',
      icon: <Zap className="h-5 w-5" />,
    },
  ];

  return (
    <section id="features" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/50 pointer-events-none"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-medical-blue/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-medical-green/5 rounded-full blur-3xl"></div>
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-sm font-medium text-muted-foreground mb-4">
            <span className="flex h-2 w-2 rounded-full bg-medical-orange mr-2"></span>
            Comprehensive Solution
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Tailored Features For All Healthcare Needs</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform provides specialized tools for patients, doctors, and pharmacists to streamline healthcare delivery and management.
          </p>
        </div>
        
        <Tabs defaultValue="patient" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-3 w-fit">
              <TabsTrigger value="patient" className="px-8">Patients</TabsTrigger>
              <TabsTrigger value="doctor" className="px-8">Doctors</TabsTrigger>
              <TabsTrigger value="pharmacy" className="px-8">Pharmacy</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="patient" className="mt-0 animate-fade-up">
            <FeatureCategory 
              title="Patient-Centered Care" 
              description="Experience healthcare that revolves around your needs with features designed to make managing your health simpler and more effective."
              features={patientFeatures}
            />
          </TabsContent>
          
          <TabsContent value="doctor" className="mt-0 animate-fade-up">
            <FeatureCategory 
              title="Efficient Practice Management" 
              description="Streamline your medical practice with tools designed to reduce administrative burden and enhance patient care capabilities."
              features={doctorFeatures}
            />
          </TabsContent>
          
          <TabsContent value="pharmacy" className="mt-0 animate-fade-up">
            <FeatureCategory 
              title="Optimized Pharmacy Operations" 
              description="Manage your pharmacy more effectively with integrated tools for inventory, prescriptions, and patient communications."
              features={pharmacyFeatures}
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default FeatureSection;
