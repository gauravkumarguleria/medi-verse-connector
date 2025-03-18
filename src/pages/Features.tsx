
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FeatureSection from '@/components/sections/FeatureSection';
import AnimatedButton from '@/components/ui/AnimatedButton';
import CircleBackground from '@/components/ui/CircleBackground';

const Features = () => {
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
              <span className="flex h-2 w-2 rounded-full bg-medical-green mr-2"></span>
              Comprehensive Solutions
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 animate-fade-up">
              Powerful Features For Modern Healthcare
            </h1>
            <p className="text-xl text-muted-foreground mb-8 animate-fade-up">
              Discover the tools and features that make our platform the ideal solution for patients, doctors, and pharmacists.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up">
              <AnimatedButton size="lg" asChild>
                <Link to="/auth?type=register">Get Started</Link>
              </AnimatedButton>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Feature Section (reusing the FeatureSection component) */}
      <FeatureSection />
      
      {/* Additional Features Overview */}
      <section className="py-20 bg-background relative">
        <CircleBackground />
        <div className="container px-4 md:px-6 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-sm font-medium text-muted-foreground mb-4">
              <span className="flex h-2 w-2 rounded-full bg-medical-orange mr-2"></span>
              Why Choose Us
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built With Your Needs In Mind</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform is designed with attention to detail and a focus on user experience across all healthcare roles.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-xl font-semibold mb-3 text-medical-blue">Intuitive Design</h3>
              <p className="text-muted-foreground">Simple and clean interface that makes navigation effortless for users of all technical backgrounds.</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-xl font-semibold mb-3 text-medical-green">Data Security</h3>
              <p className="text-muted-foreground">Advanced encryption and security protocols to keep your sensitive health information protected.</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-xl font-semibold mb-3 text-medical-orange">Continuous Updates</h3>
              <p className="text-muted-foreground">Regular feature enhancements and improvements based on healthcare trends and user feedback.</p>
            </div>
          </div>
          
          <div className="text-center">
            <AnimatedButton size="lg" asChild>
              <Link to="/auth?type=register">Experience All Features</Link>
            </AnimatedButton>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-4">Ready to transform your healthcare experience?</h2>
              <p className="text-muted-foreground mb-6">Join thousands of users who are already benefiting from our comprehensive platform.</p>
              <AnimatedButton asChild>
                <Link to="/auth?type=register">Get Started Now</Link>
              </AnimatedButton>
            </div>
            <div className="flex-1 flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                alt="Healthcare technology" 
                className="rounded-xl shadow-lg max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Features;
