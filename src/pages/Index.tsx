
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Calendar, 
  PillBottle, 
  Activity, 
  Bell, 
  AlertCircle,
  Stethoscope,
  Users
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnimatedButton from '@/components/ui/AnimatedButton';
import GlassCard from '@/components/ui/GlassCard';
import CircleBackground from '@/components/ui/CircleBackground';
import FeatureCard from '@/components/ui/FeatureCard';
import { Feature } from '@/types';

const Index = () => {
  const features: Feature[] = [
    {
      title: 'Doctor Consultation',
      description: 'Find specialists, book appointments, and get video consultations from the comfort of your home.',
      icon: <Stethoscope className="h-6 w-6" />,
    },
    {
      title: 'Health Records',
      description: 'Store all your health records securely in one place and share them with your doctors when needed.',
      icon: <Activity className="h-6 w-6" />,
    },
    {
      title: 'Medicine Ordering',
      description: 'Order prescription and over-the-counter medicines online with doorstep delivery.',
      icon: <PillBottle className="h-6 w-6" />,
    },
    {
      title: 'Health Tracking',
      description: 'Monitor your vitals, track medications, and get timely reminders for a healthier lifestyle.',
      icon: <Heart className="h-6 w-6" />,
    },
  ];

  const roleFeatures = [
    {
      role: 'Patient',
      icon: <Users className="h-12 w-12 text-medical-blue" />,
      description: 'Book appointments, track health metrics, buy medicines, and get emergency assistance.',
      link: '/auth?type=register&role=patient'
    },
    {
      role: 'Doctor',
      icon: <Stethoscope className="h-12 w-12 text-medical-green" />,
      description: 'Manage appointments, consult patients online, prescribe medicines, and track patient health.',
      link: '/auth?type=register&role=doctor'
    },
    {
      role: 'Pharmacist',
      icon: <PillBottle className="h-12 w-12 text-medical-orange" />,
      description: 'Manage inventory, process orders, verify prescriptions, and provide medicine information.',
      link: '/auth?type=register&role=pharmacist'
    },
    {
      role: 'Admin',
      icon: <AlertCircle className="h-12 w-12 text-medical-purple" />,
      description: 'Monitor users, generate reports, handle disputes, and ensure security compliance.',
      link: '/auth?type=register&role=admin'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <CircleBackground />
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-sm font-medium text-muted-foreground mb-6 animate-fade-down">
                <span className="flex h-2 w-2 rounded-full bg-medical-green mr-2"></span>
                Healthcare Simplified
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-up">
                Your Health, <span className="text-primary">Connected</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto md:mx-0 animate-fade-up">
                A comprehensive platform connecting patients, doctors, and pharmacists for seamless healthcare experiences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-fade-up">
                <AnimatedButton size="lg" href="/auth?type=register">
                  Get Started
                </AnimatedButton>
                <AnimatedButton size="lg" variant="outline" href="#learn-more">
                  Learn More
                </AnimatedButton>
              </div>
            </div>
            <div className="flex-1 perspective">
              <div className="relative w-full h-[400px] preserve-3d animate-float">
                <img 
                  src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80" 
                  alt="Healthcare professionals" 
                  className="absolute inset-0 w-full h-full object-cover rounded-2xl shadow-xl preserve-3d transform rotate-3"
                />
                <div className="absolute -bottom-4 -right-4 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute -top-4 -left-4 w-48 h-48 bg-medical-green/10 rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="learn-more" className="py-20 bg-gradient-to-b from-background to-secondary/20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Comprehensive Healthcare Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform provides a wide range of features designed to make healthcare accessible, convenient, and effective.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-20 bg-background relative">
        <CircleBackground />
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tailored For Everyone</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform is designed to meet the specific needs of different healthcare stakeholders.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {roleFeatures.map((role, index) => (
              <GlassCard 
                key={index} 
                className="text-center flex flex-col items-center animate-fade-up"
                style={{animationDelay: `${index * 100}ms`}}
              >
                <div className="mb-4">{role.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{role.role}</h3>
                <p className="text-sm text-muted-foreground mb-6">{role.description}</p>
                <AnimatedButton 
                  variant="outline" 
                  className="mt-auto" 
                  href={role.link}
                >
                  Register as {role.role}
                </AnimatedButton>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent opacity-70"></div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Healthcare Experience?</h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of users who are already benefiting from our comprehensive healthcare platform.
            </p>
            <AnimatedButton size="lg" href="/auth?type=register">
              Get Started Now
            </AnimatedButton>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
