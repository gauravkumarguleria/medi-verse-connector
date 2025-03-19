
import React, { ReactNode, useState, useEffect } from 'react';
import Navbar from './Navbar';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider, 
  SidebarTrigger 
} from '@/components/ui/sidebar';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Settings, 
  LogOut,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  Pill,
  CalendarClock,
  ClipboardList,
  MessageSquare,
  HeartPulse,
  CircuitBoard,
  ShoppingBag
} from 'lucide-react';
import { Button } from '../ui/button';
import { ThemeModeToggle } from '../ui/ThemeModeToggle';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const { user } = useUser();

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data || !data.session) {
          console.log('User not authenticated, redirecting to auth');
          navigate('/auth');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        navigate('/auth');
      }
    };
    
    checkAuth();
  }, [navigate]);

  const isActiveRoute = (route: string) => {
    return location.pathname === route || (route !== '/dashboard' && location.pathname.startsWith(route));
  };

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

  const toggleSidebar = () => {
    setSidebarHidden(!sidebarHidden);
  };

  // Handle navigation with proper path construction
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Get relevant menu items based on user role
  const getMenuItems = () => {
    const commonItems = [
      {
        group: 'Main Navigation',
        items: [
          {
            label: 'Dashboard',
            icon: <Home className="h-5 w-5" />,
            onClick: () => handleNavigation('/dashboard'),
            isActive: isActiveRoute('/dashboard') && !location.pathname.includes('/dashboard/'),
          },
        ],
      },
      {
        group: 'Settings',
        items: [
          {
            label: 'Profile',
            icon: <User className="h-5 w-5" />,
            onClick: () => handleNavigation('/dashboard/profile'),
            isActive: isActiveRoute('/dashboard/profile'),
          },
          {
            label: 'Settings',
            icon: <Settings className="h-5 w-5" />,
            onClick: () => handleNavigation('/dashboard/settings'),
            isActive: isActiveRoute('/dashboard/settings'),
          },
        ],
      },
    ];

    // Doctor-specific menu items
    if (user?.role === 'doctor') {
      return [
        ...commonItems.slice(0, 1),
        {
          group: 'Doctor Tools',
          items: [
            {
              label: 'Appointments',
              icon: <CalendarClock className="h-5 w-5" />,
              onClick: () => handleNavigation('/dashboard/appointments'),
              isActive: isActiveRoute('/dashboard/appointments'),
            },
            {
              label: 'Patient Records',
              icon: <ClipboardList className="h-5 w-5" />,
              onClick: () => handleNavigation('/dashboard/records'),
              isActive: isActiveRoute('/dashboard/records'),
            },
            {
              label: 'Prescriptions',
              icon: <Pill className="h-5 w-5" />,
              onClick: () => handleNavigation('/dashboard/medications'),
              isActive: isActiveRoute('/dashboard/medications'),
            },
          ],
        },
        {
          group: 'Communication',
          items: [
            {
              label: 'Messages',
              icon: <MessageSquare className="h-5 w-5" />,
              onClick: () => handleNavigation('/dashboard/messages'),
              isActive: isActiveRoute('/dashboard/messages'),
            },
          ],
        },
        ...commonItems.slice(1),
      ];
    }

    // Patient-specific menu items
    return [
      ...commonItems.slice(0, 1),
      {
        group: 'Health Management',
        items: [
          {
            label: 'Appointments',
            icon: <CalendarClock className="h-5 w-5" />,
            onClick: () => handleNavigation('/dashboard/appointments'),
            isActive: isActiveRoute('/dashboard/appointments'),
          },
          {
            label: 'Medications',
            icon: <Pill className="h-5 w-5" />,
            onClick: () => handleNavigation('/dashboard/medications'),
            isActive: isActiveRoute('/dashboard/medications'),
          },
          {
            label: 'Health Records',
            icon: <ClipboardList className="h-5 w-5" />,
            onClick: () => handleNavigation('/dashboard/records'),
            isActive: isActiveRoute('/dashboard/records'),
          },
          {
            label: 'Pharmacy Store',
            icon: <ShoppingBag className="h-5 w-5" />,
            onClick: () => handleNavigation('/dashboard/pharmacy'),
            isActive: isActiveRoute('/dashboard/pharmacy'),
          },
        ],
      },
      {
        group: 'Communication',
        items: [
          {
            label: 'Messages',
            icon: <MessageSquare className="h-5 w-5" />,
            onClick: () => handleNavigation('/dashboard/messages'),
            isActive: isActiveRoute('/dashboard/messages'),
          },
        ],
      },
      {
        group: 'Monitoring',
        items: [
          {
            label: 'Vital Signs',
            icon: <HeartPulse className="h-5 w-5" />,
            onClick: () => handleNavigation('/dashboard/vitals'),
            isActive: isActiveRoute('/dashboard/vitals'),
          },
          {
            label: 'IoT Devices',
            icon: <CircuitBoard className="h-5 w-5" />,
            onClick: () => handleNavigation('/dashboard/iot-devices'),
            isActive: isActiveRoute('/dashboard/iot-devices'),
          },
        ],
      },
      ...commonItems.slice(1),
    ];
  };

  const menuItems = getMenuItems();

  return (
    <SidebarProvider>
      <div className="w-full min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 pt-16 flex w-full">
          {!sidebarHidden && (
            <Sidebar side="left" variant="sidebar" collapsible="icon" className="z-30">
              <SidebarHeader className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1"></div>
                  <SidebarTrigger />
                </div>
              </SidebarHeader>
              <SidebarContent>
                {menuItems.map((group, index) => (
                  <SidebarGroup key={index}>
                    <SidebarGroupLabel>{group.group}</SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {group.items.map((item, idx) => (
                          <SidebarMenuItem key={idx}>
                            <SidebarMenuButton 
                              onClick={item.onClick}
                              isActive={item.isActive}
                              tooltip={item.label}
                            >
                              {item.icon}
                              <span>{item.label}</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                ))}
              </SidebarContent>
              <SidebarFooter className="p-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user?.name || 'User'}</span>
                      <span className="text-xs text-muted-foreground capitalize">{user?.role || 'patient'}</span>
                    </div>
                  </div>
                  <ThemeModeToggle />
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center gap-2 mt-2" 
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              </SidebarFooter>
            </Sidebar>
          )}
          <div className={`flex flex-col flex-1 ${!sidebarHidden ? 'ml-[calc(var(--sidebar-width)_-_1px)]' : ''} transition-all duration-300`}>
            <div className="flex items-center p-2 border-b">
              <Button 
                variant="sidebar" 
                size="icon" 
                onClick={toggleSidebar} 
                className="ml-0"
                aria-label={sidebarHidden ? "Show sidebar" : "Hide sidebar"}
              >
                {sidebarHidden ? (
                  <PanelLeftOpen className="h-5 w-5" />
                ) : (
                  <PanelLeftClose className="h-5 w-5" />
                )}
              </Button>
              <div className="flex-1"></div>
            </div>
            <main className="flex-1 p-4 md:p-6 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
