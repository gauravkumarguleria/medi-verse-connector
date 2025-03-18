
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnimatedButton from '@/components/ui/AnimatedButton';
import CircleBackground from '@/components/ui/CircleBackground';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Clock, ArrowRight } from 'lucide-react';
import ContactMap from '@/components/sections/ContactMap';

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28">
        <CircleBackground />
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Get in <span className="text-primary">Touch</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              We're here to help with any questions about our healthcare platform.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-12 bg-secondary/5">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Our Location</h3>
              <p className="text-muted-foreground">
                MediVerse Headquarters<br />
                Shimla, Himachal Pradesh<br />
                India, 171001
              </p>
            </div>

            <div className="bg-background p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Phone</h3>
              <p className="text-muted-foreground">
                Customer Support: +91 1800-123-4567<br />
                Technical Support: +91 1800-123-7890<br />
                Monday - Friday, 9am - 6pm
              </p>
            </div>

            <div className="bg-background p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <p className="text-muted-foreground">
                General Inquiries: info@mediverse.com<br />
                Support: support@mediverse.com<br />
                Careers: careers@mediverse.com
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12">
        <div className="container px-4 md:px-6">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Find Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Visit our headquarters in the beautiful state of Himachal Pradesh, India
            </p>
          </div>
          
          <div className="h-[500px] rounded-xl overflow-hidden shadow-md">
            <ContactMap />
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-12 bg-secondary/5">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-3xl font-bold mb-4">Send Us a Message</h2>
              <p className="text-muted-foreground mb-6">
                Have questions about our services? Fill out the form and we'll get back to you as soon as possible.
              </p>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Quick Response</h3>
                  <p className="text-sm text-muted-foreground">We respond to messages within 24 hours</p>
                </div>
              </div>
            </div>
            
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Name</label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Your email"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                  <input
                    id="subject"
                    type="text"
                    placeholder="Subject of your message"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Your message"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  ></textarea>
                </div>
                <AnimatedButton className="w-full">
                  Send Message <ArrowRight className="ml-2 h-4 w-4" />
                </AnimatedButton>
              </form>
            </div>
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

export default Contact;
