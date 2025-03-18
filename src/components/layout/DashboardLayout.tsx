
import React, { ReactNode, useState } from 'react';
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
  CircuitBoard
} from 'lucide-react';
import { Button } from '../ui/button';
import { ThemeModeToggle } from '../ui/ThemeModeToggle';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarHidden, setSidebarHidden] = useState(true); // Set default to true (sidebar hidden)

  const isActiveRoute = (route: string) => {
    return location.pathname.includes(route);
  };

  const handleLogout = () => {
    // For demo purposes, just navigate to home
    navigate('/');
  };

  const toggleSidebar = () => {
    setSidebarHidden(!sidebarHidden);
  };

  return (
    <SidebarProvider>
      <div className="w-full min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 pt-16 flex w-full">
          {!sidebarHidden && (
            <Sidebar side="left" variant="sidebar" collapsible="icon" className="z-10">
              <SidebarHeader className="p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-primary">MediVerse</h2>
                  <SidebarTrigger />
                </div>
              </SidebarHeader>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          onClick={() => navigate('/dashboard')}
                          isActive={isActiveRoute('/dashboard') && !location.pathname.includes('/dashboard/')}
                          tooltip="Dashboard"
                        >
                          <Home className="h-5 w-5" />
                          <span>Dashboard</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          onClick={() => navigate('/dashboard/appointments')}
                          isActive={isActiveRoute('/dashboard/appointments')}
                          tooltip="Appointments"
                        >
                          <CalendarClock className="h-5 w-5" />
                          <span>Appointments</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          onClick={() => navigate('/dashboard/medications')}
                          isActive={isActiveRoute('/dashboard/medications')}
                          tooltip="Medications"
                        >
                          <Pill className="h-5 w-5" />
                          <span>Medications</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          onClick={() => navigate('/dashboard/records')}
                          isActive={isActiveRoute('/dashboard/records')}
                          tooltip="Health Records"
                        >
                          <ClipboardList className="h-5 w-5" />
                          <span>Health Records</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
                
                <SidebarGroup>
                  <SidebarGroupLabel>Communication</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          onClick={() => navigate('/dashboard/messages')}
                          isActive={isActiveRoute('/dashboard/messages')}
                          tooltip="Messages"
                        >
                          <MessageSquare className="h-5 w-5" />
                          <span>Messages</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
                
                <SidebarGroup>
                  <SidebarGroupLabel>Monitoring</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          onClick={() => navigate('/dashboard/vitals')}
                          isActive={isActiveRoute('/dashboard/vitals')}
                          tooltip="Vital Signs"
                        >
                          <HeartPulse className="h-5 w-5" />
                          <span>Vital Signs</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          onClick={() => navigate('/dashboard/iot-devices')}
                          isActive={isActiveRoute('/dashboard/iot-devices')}
                          tooltip="IoT Devices"
                        >
                          <CircuitBoard className="h-5 w-5" />
                          <span>IoT Devices</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
                
                <SidebarGroup>
                  <SidebarGroupLabel>Settings</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          onClick={() => navigate('/dashboard/profile')}
                          isActive={isActiveRoute('/dashboard/profile')}
                          tooltip="Profile"
                        >
                          <User className="h-5 w-5" />
                          <span>Profile</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          onClick={() => navigate('/dashboard/settings')}
                          isActive={isActiveRoute('/dashboard/settings')}
                          tooltip="Settings"
                        >
                          <Settings className="h-5 w-5" />
                          <span>Settings</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
              <SidebarFooter className="p-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">John Doe</span>
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
