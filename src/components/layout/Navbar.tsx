
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

// Import refactored components
import Logo from './navbar/Logo';
import NavItems from './navbar/NavItems';
import NavbarActions from './navbar/NavbarActions';
import MobileMenu from './navbar/MobileMenu';
import { useScrollEffect } from './navbar/NavbarUtils';

const Navbar: React.FC = () => {
  const isScrolled = useScrollEffect();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading } = useUser();

  // Close mobile menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error logging out:', error);
        toast({
          title: "Logout Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Successfully logged out, redirect to home
        console.log('User logged out successfully');
        toast({
          title: "Logged Out",
          description: "You have been successfully logged out",
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Logout Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleProfileClick = () => {
    navigate('/dashboard/profile');
  };
  
  const handleSettingsClick = () => {
    navigate('/dashboard/settings');
  };

  // Determine if we're on the dashboard
  const isDashboard = location.pathname.includes('/dashboard');

  // Navigation items
  const navItems = [
    { name: 'Home', href: '/', active: location.pathname === '/' },
    { name: 'Features', href: '/features', active: location.pathname === '/features' },
    { name: 'About', href: '/about', active: location.pathname === '/about' },
    { name: 'Contact', href: '/contact', active: location.pathname === '/contact' },
  ];

  // Check if the user is authenticated and loaded
  const isAuthenticated = !isLoading && user && user.id !== "1";

  return (
    <div
      className={cn(
        "fixed top-0 left-0 w-full z-50 bg-background/90 backdrop-blur-md transition-all duration-300 border-b border-border",
        isScrolled ? "shadow-md" : ""
      )}
    >
      <div className="container flex items-center justify-between h-16">
        {/* Logo (Left) */}
        <Logo />

        {/* Navigation Items (Center) */}
        <div className="hidden md:flex items-center justify-center flex-1">
          <NavItems items={navItems} className="items-center gap-6" />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </div>

        {/* Actions (Right) */}
        <div className="hidden md:flex items-center">
          <NavbarActions isAuthenticated={isAuthenticated} user={user} />
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={mobileMenuOpen}
        navItems={navItems}
        isAuthenticated={isAuthenticated}
        user={user}
        onProfileClick={handleProfileClick}
        onSettingsClick={handleSettingsClick}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default Navbar;
