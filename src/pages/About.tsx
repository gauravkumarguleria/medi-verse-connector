
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnimatedButton from '@/components/ui/AnimatedButton';
import CircleBackground from '@/components/ui/CircleBackground';
import { Award, Building, Clock, Heart, Users, Book, Globe, BarChart } from 'lucide-react';

const About = () => {
  // Scroll to the top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
        <CircleBackground />
        <div className="container px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-sm font-medium text-muted-foreground mb-6 animate-fade-down">
              <span className="flex h-2 w-2 rounded-full bg-medical-purple mr-2"></span>
              Our Story
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 animate-fade-up">
              About MediVerse
            </h1>
            <p className="text-xl text-muted-foreground mb-8 animate-fade-up">
              We're on a mission to transform healthcare through technology, making it more accessible, efficient, and personalized for everyone.
            </p>
          </div>
        </div>
      </section>
      
      {/* Vision and Mission */}
      <section className="py-16 bg-background relative">
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="rounded-xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Medical professionals collaborating" 
                className="w-full h-auto"
              />
            </div>
            <div>
              <div className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-sm font-medium text-muted-foreground mb-4">
                <span className="flex h-2 w-2 rounded-full bg-medical-blue mr-2"></span>
                Our Vision
              </div>
              <h2 className="text-3xl font-bold mb-4">Revolutionizing Healthcare Access</h2>
              <p className="text-muted-foreground mb-6">
                At MediVerse, we envision a world where quality healthcare is accessible to everyone, regardless of their location or circumstances. We're building a comprehensive digital ecosystem that connects patients, doctors, and pharmacists in meaningful ways.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/10 p-2 rounded-full">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Patient-Centered Care</h3>
                    <p className="text-sm text-muted-foreground">Putting patients first in every feature we develop</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/10 p-2 rounded-full">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Global Accessibility</h3>
                    <p className="text-sm text-muted-foreground">Making healthcare accessible across geographic boundaries</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/10 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Time Efficiency</h3>
                    <p className="text-sm text-muted-foreground">Streamlining processes to save valuable time for all users</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Team */}
      <section className="py-16 bg-primary/5">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-sm font-medium text-muted-foreground mb-4">
              <span className="flex h-2 w-2 rounded-full bg-medical-green mr-2"></span>
              Our Team
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet The Experts Behind MediVerse</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our diverse team of healthcare professionals, technologists, and innovators are dedicated to transforming the healthcare experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Team Member 1 */}
            <div className="bg-white dark:bg-background rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80" 
                alt="Dr. Sarah Johnson" 
                className="w-24 h-24 object-cover rounded-full mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold text-center">Dr. Sarah Johnson</h3>
              <p className="text-sm text-center text-medical-blue mb-3">Chief Medical Officer</p>
              <p className="text-sm text-muted-foreground text-center">
                Former head of telemedicine at Mayo Clinic with 15+ years of experience in healthcare innovation.
              </p>
            </div>
            
            {/* Team Member 2 */}
            <div className="bg-white dark:bg-background rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80" 
                alt="Michael Chen" 
                className="w-24 h-24 object-cover rounded-full mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold text-center">Michael Chen</h3>
              <p className="text-sm text-center text-medical-blue mb-3">Chief Technology Officer</p>
              <p className="text-sm text-muted-foreground text-center">
                Former tech lead at Google Health, specialized in AI and machine learning for healthcare applications.
              </p>
            </div>
            
            {/* Team Member 3 */}
            <div className="bg-white dark:bg-background rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80" 
                alt="Dr. Maria Rodriguez" 
                className="w-24 h-24 object-cover rounded-full mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold text-center">Dr. Maria Rodriguez</h3>
              <p className="text-sm text-center text-medical-blue mb-3">Head of Patient Experience</p>
              <p className="text-sm text-muted-foreground text-center">
                Renowned physician with expertise in patient-centered care design and healthcare UX research.
              </p>
            </div>
            
            {/* Team Member 4 */}
            <div className="bg-white dark:bg-background rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80" 
                alt="David Wilson" 
                className="w-24 h-24 object-cover rounded-full mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold text-center">David Wilson</h3>
              <p className="text-sm text-center text-medical-blue mb-3">Head of Security</p>
              <p className="text-sm text-muted-foreground text-center">
                Cybersecurity expert with specialized focus on healthcare data protection and HIPAA compliance.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Statistics */}
      <section className="py-16 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4 mx-auto">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-2">500K+</h3>
              <p className="text-muted-foreground">Active Users</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4 mx-auto">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-2">1,200+</h3>
              <p className="text-muted-foreground">Healthcare Partners</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4 mx-auto">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-2">15+</h3>
              <p className="text-muted-foreground">Industry Awards</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4 mx-auto">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-2">98%</h3>
              <p className="text-muted-foreground">User Satisfaction</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Values */}
      <section className="py-16 bg-primary/5">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-sm font-medium text-muted-foreground mb-4">
              <span className="flex h-2 w-2 rounded-full bg-medical-orange mr-2"></span>
              Our Values
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Stand For</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our core values guide everything we do, from product development to customer service.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-background rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="p-3 bg-medical-blue/10 inline-block rounded-full mb-4">
                <Book className="h-6 w-6 text-medical-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-muted-foreground">
                We constantly push the boundaries of what's possible in healthcare technology, developing innovative solutions to complex problems.
              </p>
            </div>
            
            <div className="bg-white dark:bg-background rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="p-3 bg-medical-green/10 inline-block rounded-full mb-4">
                <Users className="h-6 w-6 text-medical-green" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Compassion</h3>
              <p className="text-muted-foreground">
                We approach healthcare with empathy and understanding, recognizing that behind every user is a human being seeking care and support.
              </p>
            </div>
            
            <div className="bg-white dark:bg-background rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="p-3 bg-medical-orange/10 inline-block rounded-full mb-4">
                <Heart className="h-6 w-6 text-medical-orange" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Integrity</h3>
              <p className="text-muted-foreground">
                We operate with the highest ethical standards, ensuring security, privacy, and transparency in all our services and operations.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Us In Transforming Healthcare</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Experience the future of healthcare with MediVerse. Whether you're a patient, doctor, or healthcare provider, our platform is designed to meet your unique needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AnimatedButton size="lg" asChild>
                <Link to="/auth?type=register">Get Started</Link>
              </AnimatedButton>
              <Button variant="outline" size="lg" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default About;
