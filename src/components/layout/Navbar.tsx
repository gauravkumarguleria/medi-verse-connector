
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import AnimatedButton from '../ui/AnimatedButton';
import { Menu, X, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { ThemeModeToggle } from '../ui/ThemeModeToggle';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/contexts/UserContext';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Use the user context instead of mock data
  const { user } = useUser();
  const userInitials = user.name.split(' ').map(n => n[0]).join('');

  // Check if user is on the dashboard to show different navigation
  const isOnDashboard = location.pathname.includes('/dashboard');

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

  const handleLogout = () => {
    // In a real application, this would call your logout function
    // For now, we'll just redirect to home
    window.location.href = '/';
  };

  const handleProfileClick = () => {
    navigate('/dashboard/profile');
  };

  const handleSettingsClick = () => {
    navigate('/dashboard/settings');
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'py-3 bg-white/80 dark:bg-background/80 backdrop-blur-lg shadow-sm'
          : 'py-5 bg-transparent'
      )}
    >
      <div className="container px-4 md:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">MediVerse</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {!isOnDashboard ? (
            <>
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
            </>
          ) : (
            <div className="text-sm font-medium text-foreground/70">
              Dashboard
            </div>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <ThemeModeToggle />
          
          {isOnDashboard ? (
            <div className="flex items-center gap-3">
              <div className="text-sm font-medium mr-1">
                <span className="text-muted-foreground">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 h-9 px-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">{user.name}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={handleProfileClick}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={handleSettingsClick}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/auth?type=login">Login</Link>
              </Button>
              <AnimatedButton asChild size="sm">
                <Link to="/auth?type=register">Get Started</Link>
              </AnimatedButton>
            </>
          )}
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
          'md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-background/95 backdrop-blur-lg shadow-sm overflow-hidden transition-all duration-300 ease-in-out',
          mobileMenuOpen ? 'max-h-[400px] py-4' : 'max-h-0 py-0'
        )}
      >
        <div className="container px-4 flex flex-col gap-4">
          {!isOnDashboard ? (
            <>
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
            </>
          ) : (
            <div className="flex items-center py-2 border-b">
              <Avatar className="h-8 w-8 mr-3">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium">{user.name}</span>
                <span className="text-sm text-muted-foreground">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
              </div>
            </div>
          )}
          
          {isOnDashboard && (
            <>
              <button 
                onClick={handleProfileClick}
                className="py-2 text-base font-medium flex items-center gap-2 text-foreground/70 hover:text-primary"
              >
                <User className="h-5 w-5" />
                Profile
              </button>
              <button 
                onClick={handleSettingsClick}
                className="py-2 text-base font-medium flex items-center gap-2 text-foreground/70 hover:text-primary"
              >
                <Settings className="h-5 w-5" />
                Settings
              </button>
              <button 
                onClick={handleLogout}
                className="py-2 text-base font-medium flex items-center gap-2 text-foreground/70 hover:text-primary"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </>
          )}
          
          <div className="flex items-center justify-between py-2">
            <ThemeModeToggle />
            {!isOnDashboard && (
              <div className="flex gap-4 ml-4">
                <Button asChild variant="outline" className="flex-1">
                  <Link to="/auth?type=login">Login</Link>
                </Button>
                <AnimatedButton asChild className="flex-1">
                  <Link to="/auth?type=register">Get Started</Link>
                </AnimatedButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
