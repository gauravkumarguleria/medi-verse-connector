
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import AnimatedButton from '../ui/AnimatedButton';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'py-3 bg-white/80 backdrop-blur-lg shadow-sm'
          : 'py-5 bg-transparent'
      )}
    >
      <div className="container px-4 md:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">MediVerse</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive('/') ? "text-primary" : "text-foreground/70"
            )}>
            Home
          </Link>
          <Link 
            to="/features" 
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive('/features') ? "text-primary" : "text-foreground/70"
            )}>
            Features
          </Link>
          <Link 
            to="/about" 
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive('/about') ? "text-primary" : "text-foreground/70"
            )}>
            About
          </Link>
          <Link 
            to="/contact" 
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive('/contact') ? "text-primary" : "text-foreground/70"
            )}>
            Contact
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link to="/auth?type=login">Login</Link>
          </Button>
          <AnimatedButton asChild size="sm">
            <Link to="/auth?type=register">Get Started</Link>
          </AnimatedButton>
        </div>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden" 
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          'md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg shadow-sm overflow-hidden transition-all duration-300 ease-in-out',
          mobileMenuOpen ? 'max-h-[400px] py-4' : 'max-h-0 py-0'
        )}
      >
        <div className="container px-4 flex flex-col gap-4">
          <Link 
            to="/" 
            className={cn(
              "py-2 text-base font-medium transition-colors hover:text-primary",
              isActive('/') ? "text-primary" : "text-foreground/70"
            )}>
            Home
          </Link>
          <Link 
            to="/features" 
            className={cn(
              "py-2 text-base font-medium transition-colors hover:text-primary",
              isActive('/features') ? "text-primary" : "text-foreground/70"
            )}>
            Features
          </Link>
          <Link 
            to="/about" 
            className={cn(
              "py-2 text-base font-medium transition-colors hover:text-primary",
              isActive('/about') ? "text-primary" : "text-foreground/70"
            )}>
            About
          </Link>
          <Link 
            to="/contact" 
            className={cn(
              "py-2 text-base font-medium transition-colors hover:text-primary",
              isActive('/contact') ? "text-primary" : "text-foreground/70"
            )}>
            Contact
          </Link>
          <div className="flex gap-4 py-2">
            <Button asChild variant="outline" className="flex-1">
              <Link to="/auth?type=login">Login</Link>
            </Button>
            <AnimatedButton asChild className="flex-1">
              <Link to="/auth?type=register">Get Started</Link>
            </AnimatedButton>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
