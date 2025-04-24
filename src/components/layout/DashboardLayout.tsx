
import React, { ReactNode, useState } from 'react';
import Navbar from './Navbar';
import { 
  Sidebar, 
  SidebarProvider, 
  SidebarHeader, 
  SidebarFooter,
  SidebarTrigger 
} from '@/components/ui/sidebar';
import { Button } from '../ui/button';
import { PanelLeftOpen, PanelLeftClose } from 'lucide-react';
import { SidebarMenuContent } from './navigation/SidebarMenuContent';
import { UserProfileSection } from './navigation/UserProfileSection';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarHidden, setSidebarHidden] = useState(false);

  const toggleSidebar = () => {
    setSidebarHidden(!sidebarHidden);
  };

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
              <SidebarMenuContent />
              <SidebarFooter className="p-4">
                <UserProfileSection />
              </SidebarFooter>
            </Sidebar>
          )}
          <div className={`flex flex-col flex-1 ${!sidebarHidden ? 'ml-[calc(var(--sidebar-width)_-_1px)]' : ''} transition-all duration-300`}>
            <div className="flex items-center p-2 border-b">
              <Button 
                variant="sidebar" 
                size="icon" 
                onClick={toggleSidebar} 
                className="ml-2 mr-auto"
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
