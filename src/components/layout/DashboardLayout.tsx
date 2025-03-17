
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
  Stethoscope, 
  Calendar, 
  MessageSquare, 
  FileText, 
  Settings, 
  LogOut,
  CircuitBoard, 
  User,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { Button } from '../ui/button';
import { ThemeModeToggle } from '../ui/ThemeModeToggle';
import { Checkbox } from '../ui/checkbox';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarHidden, setSidebarHidden] = useState(false);

  const isActiveRoute = (route: string) => {
    return location.pathname === route;
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
            <Sidebar side="left" variant="sidebar" collapsible="icon">
              <SidebarHeader className="p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-primary">MediVerse</h2>
                  <SidebarTrigger />
                </div>
              </SidebarHeader>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          onClick={() => navigate('/dashboard')}
                          isActive={isActiveRoute('/dashboard')}
                          tooltip="Dashboard"
                        >
                          <Home className="h-5 w-5" />
                          <span>Dashboard</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          onClick={() => navigate('/iot-reports')}
                          isActive={isActiveRoute('/iot-reports')}
                          tooltip="IoT Reports"
                        >
                          <CircuitBoard className="h-5 w-5" />
                          <span>IoT Reports</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
                
                <SidebarGroup>
                  <SidebarGroupLabel>Medical</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          onClick={() => navigate('/appointments')}
                          isActive={isActiveRoute('/appointments')}
                          tooltip="Appointments"
                        >
                          <Calendar className="h-5 w-5" />
                          <span>Appointments</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Medical Records">
                          <FileText className="h-5 w-5" />
                          <span>Medical Records</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Medications">
                          <Stethoscope className="h-5 w-5" />
                          <span>Medications</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Messages">
                          <MessageSquare className="h-5 w-5" />
                          <span>Messages</span>
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
          <div className="flex flex-col flex-1">
            <div className="flex items-center p-2 border-b">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSidebar} 
                className="mr-2"
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
