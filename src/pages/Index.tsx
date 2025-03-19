import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Calendar, 
  PillBottle, 
  Activity, 
  Bell, 
  AlertCircle,
  Stethoscope,
  Users,
  Star,
  Quote,
  Clock,
  CheckCircle,
  ArrowRight,
  ChevronRight,
  Medal,
  Smartphone,
  Shield
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnimatedButton from '@/components/ui/AnimatedButton';
import GlassCard from '@/components/ui/GlassCard';
import CircleBackground from '@/components/ui/CircleBackground';
import FeatureCard from '@/components/ui/FeatureCard';
import FeatureSection from '@/components/sections/FeatureSection';
import VideoBackground from '@/components/ui/VideoBackground';
import AnimatedGradient from '@/components/ui/AnimatedGradient';
import AnimatedLogo from '@/components/ui/AnimatedLogo';
import ScrollFadeIn from '@/components/ui/ScrollFadeIn';
import { Feature } from '@/types';

const Index = () => {
  // Reference for animations
  const statsRef = useRef<HTMLDivElement>(null);
  const featuresSectionRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const handleIntersection = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    // Observe all sections
    [statsRef, featuresSectionRef, howItWorksRef, benefitsRef, testimonialsRef, ctaRef].forEach(ref => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

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

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Patient",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      quote: "This platform has transformed how I manage my health. I can track my medications, book appointments, and access my records all in one place!",
      rating: 5
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      role: "Cardiologist",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      quote: "As a doctor, this platform has streamlined my practice. I can easily communicate with patients, manage appointments, and access medical histories.",
      rating: 5
    },
    {
      id: 3,
      name: "Lisa Rodriguez",
      role: "Pharmacist",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      quote: "The medication management system is excellent. I can verify prescriptions quickly and communicate directly with doctors for any clarifications.",
      rating: 4
    }
  ];

  const statsData = [
    { value: "50k+", label: "Registered Users", icon: <Users className="h-8 w-8 text-medical-blue" /> },
    { value: "1000+", label: "Medical Professionals", icon: <Stethoscope className="h-8 w-8 text-medical-green" /> },
    { value: "24/7", label: "Support Available", icon: <Clock className="h-8 w-8 text-medical-orange" /> },
    { value: "99.9%", label: "Uptime Reliability", icon: <CheckCircle className="h-8 w-8 text-medical-purple" /> }
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Create an Account",
      description: "Sign up as a patient, doctor, or pharmacist to access personalized features.",
      icon: <Users className="h-10 w-10 text-primary" />
    },
    {
      step: 2,
      title: "Complete Your Profile",
      description: "Add your health information, medical history, or professional credentials.",
      icon: <CheckCircle className="h-10 w-10 text-primary" />
    },
    {
      step: 3,
      title: "Access Services",
      description: "Book appointments, order medicines, consult with doctors, and more.",
      icon: <Stethoscope className="h-10 w-10 text-primary" />
    }
  ];

  const benefits = [
    {
      title: "Time Saving",
      description: "Book appointments and consult doctors without waiting in queues.",
      icon: <Clock className="h-8 w-8 text-medical-green" />
    },
    {
      title: "Secure & Private",
      description: "Your health data is encrypted and protected with industry-standard security.",
      icon: <Shield className="h-8 w-8 text-medical-blue" />
    },
    {
      title: "Always Available",
      description: "Access your health information and services 24/7 from anywhere.",
      icon: <Smartphone className="h-8 w-8 text-medical-orange" />
    },
    {
      title: "Trusted Professionals",
      description: "Connect with verified doctors, specialists, and healthcare providers.",
      icon: <Medal className="h-8 w-8 text-medical-purple" />
    }
  ];

  // Sample videos for the hero background
  const sampleVideos = [
    "https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-white-sand-beach-and-palm-trees-1564-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-the-sea-and-sand-with-mountains-45056-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-clouds-and-blue-sky-2408-large.mp4"
  ];

  // Randomly select a background video
  const randomVideo = sampleVideos[Math.floor(Math.random() * sampleVideos.length)];

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section with enhanced animations */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <VideoBackground 
          videoSrc={randomVideo} 
          overlayOpacity={70}
        />
        <CircleBackground className="z-10" />
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center rounded-full border border-border bg-background/80 backdrop-blur-sm px-3 py-1 text-sm font-medium text-muted-foreground mb-6 animate-fade-down" style={{animationDelay: '200ms'}}>
                <span className="flex h-2 w-2 rounded-full bg-medical-green mr-2"></span>
                <AnimatedLogo size="sm" className="mr-2" />
                Healthcare Simplified
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-up" style={{animationDelay: '300ms'}}>
                Your Health, <span className="text-primary relative animate-background-shine inline-block bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] dark:bg-[linear-gradient(110deg,#ffffff,45%,#93c5fd,55%,#ffffff)] dark:bg-[length:200%_100%] bg-clip-text text-transparent">Connected</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto md:mx-0 animate-fade-up" style={{animationDelay: '400ms'}}>
                A comprehensive platform connecting patients, doctors, and pharmacists for seamless healthcare experiences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-fade-up" style={{animationDelay: '500ms'}}>
                <AnimatedButton size="lg" href="/auth?type=register" shine={true}>
                  Get Started
                </AnimatedButton>
                <AnimatedButton size="lg" variant="outline" href="#learn-more" shine={true}>
                  Learn More
                </AnimatedButton>
              </div>
            </div>
            <div className="flex-1 perspective animate-fade-up" style={{animationDelay: '600ms'}}>
              <div className="relative w-full h-[400px] preserve-3d animate-float grid grid-cols-2 gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80" 
                  alt="Healthcare professionals" 
                  className="w-full h-full object-cover rounded-2xl shadow-xl preserve-3d transform hover:rotate-2 transition-transform duration-300 cursor-pointer bg-white/10 backdrop-blur-sm"
                />
                <img 
                  src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80" 
                  alt="Telehealth consultation" 
                  className="w-full h-full object-cover rounded-2xl shadow-xl preserve-3d transform hover:rotate-6 transition-transform duration-300 cursor-pointer bg-white/10 backdrop-blur-sm"
                />
                <div className="absolute -bottom-4 -right-4 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -top-4 -left-4 w-48 h-48 bg-medical-green/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview Section */}
      <section id="learn-more" className="py-20 bg-gradient-to-b from-background to-secondary/20">
        <ScrollFadeIn>
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Comprehensive Healthcare Features</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our platform provides a wide range of features designed to make healthcare accessible, convenient, and effective.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <ScrollFadeIn key={index} delay={index * 100} direction="up">
                  <FeatureCard feature={feature} index={index} />
                </ScrollFadeIn>
              ))}
            </div>
          </div>
        </ScrollFadeIn>
      </section>

      {/* Detailed Feature Section */}
      <ScrollFadeIn>
        <FeatureSection />
      </ScrollFadeIn>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-background to-primary/5">
        <ScrollFadeIn>
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Getting started with our platform is simple and straightforward.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {howItWorks.map((step) => (
                <ScrollFadeIn key={step.step} delay={step.step * 100} direction="up">
                  <div className="relative transform hover:scale-105 transition-transform duration-300">
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-6">
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center group">
                          <div className="transform group-hover:scale-110 transition-transform duration-300">
                            {step.icon}
                          </div>
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold animate-bounce" style={{animationDuration: '2s', animationDelay: `${step.step * 0.2}s`}}>
                          {step.step}
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                    
                    {step.step < howItWorks.length && (
                      <div className="hidden md:block absolute top-1/4 right-0 transform translate-x-1/2 animate-pulse">
                        <ChevronRight className="h-8 w-8 text-primary/30" />
                      </div>
                    )}
                  </div>
                </ScrollFadeIn>
              ))}
            </div>
          </div>
        </ScrollFadeIn>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-secondary/10 relative overflow-hidden">
        <CircleBackground />
        <ScrollFadeIn>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Hear from doctors, patients, and pharmacists who use our platform.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <ScrollFadeIn key={testimonial.id} delay={testimonial.id * 100} direction="up">
                  <GlassCard 
                    className="p-6 transform hover:scale-105 transition-transform duration-300 hover:shadow-lg"
                  >
                    <div className="flex items-center mb-4">
                      <div className="mr-4 overflow-hidden rounded-full">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name} 
                          className="w-14 h-14 rounded-full object-cover transform hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="mb-4 flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400 animate-pulse' : 'text-gray-300'}`} 
                          style={{animationDuration: '3s', animationDelay: `${i * 0.1}s`}}
                        />
                      ))}
                    </div>
                    <div className="mb-4">
                      <Quote className="h-6 w-6 text-primary/40 mb-2 transform hover:rotate-12 transition-transform duration-300" />
                      <p className="text-muted-foreground italic">{testimonial.quote}</p>
                    </div>
                  </GlassCard>
                </ScrollFadeIn>
              ))}
            </div>
          </div>
        </ScrollFadeIn>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary/5">
        <ScrollFadeIn>
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
              {statsData.map((stat, index) => (
                <ScrollFadeIn key={index} delay={index * 100} direction="up">
                  <div className="text-center transform hover:scale-105 transition-transform duration-300">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 rounded-full bg-primary/10 transform hover:rotate-12 transition-transform duration-300">
                        {stat.icon}
                      </div>
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-primary mb-2 animate-count">{stat.value}</div>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </div>
                </ScrollFadeIn>
              ))}
            </div>
          </div>
        </ScrollFadeIn>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-background">
        <ScrollFadeIn>
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose Our Platform</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We offer numerous advantages that make healthcare management easier and more efficient.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <ScrollFadeIn key={index} delay={index * 100} direction="up">
                  <GlassCard
                    className="p-6 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
                  >
                    <div className="flex justify-center mb-4">
                      <div className="p-3 rounded-full bg-primary/10 group">
                        <div className="transform group-hover:rotate-12 transition-transform duration-300">
                          {benefit.icon}
                        </div>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </GlassCard>
                </ScrollFadeIn>
              ))}
            </div>
          </div>
        </ScrollFadeIn>
      </section>

      {/* Newsletter Section with gradient animation */}
      <section className="py-20 bg-gradient-to-b from-secondary/10 to-background relative overflow-hidden">
        <AnimatedGradient className="absolute inset-0" />
        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 animate-fade-up">Stay Updated</h2>
            <p className="text-muted-foreground mb-8 animate-fade-up" style={{animationDelay: '100ms'}}>
              Subscribe to our newsletter to receive health tips, platform updates, and special offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto animate-fade-up" style={{animationDelay: '200ms'}}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 focus:scale-105"
              />
              <AnimatedButton size="default" shine={true}>
                Subscribe <ArrowRight className="ml-2 h-4 w-4 animate-pulse" />
              </AnimatedButton>
            </div>
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
              <ScrollFadeIn key={index} delay={index * 100} direction="up">
                <GlassCard 
                  className="text-center flex flex-col items-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl group"
                >
                  <div className="mb-4 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">{role.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{role.role}</h3>
                  <p className="text-sm text-muted-foreground mb-6">{role.description}</p>
                  <AnimatedButton 
                    variant="outline" 
                    className="mt-auto" 
                    href={role.link}
                    shine={true}
                  >
                    Register as {role.role}
                  </AnimatedButton>
                </GlassCard>
              </ScrollFadeIn>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary/5 relative overflow-hidden">
        <ScrollFadeIn>
          <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent opacity-70"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Healthcare Experience?</h2>
              <p className="text-muted-foreground mb-8">
                Join thousands of users who are already benefiting from our comprehensive healthcare platform.
              </p>
              <AnimatedButton size="lg" href="/auth?type=register" shine={true} className="animate-pulse-slow">
                Get Started Now
              </AnimatedButton>
            </div>
          </div>
        </ScrollFadeIn>
      </section>

      {/* Add keyframes animations */}
      <style>
        {`
        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        
        @keyframes count {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .animate-count {
          animation: count 1s forwards;
        }
        `}
      </style>

      <Footer />
    </div>
  );
};

export default Index;
