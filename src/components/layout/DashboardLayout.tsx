
import React, { ReactNode, useState } from 'react';
import Navbar from './Navbar';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarProvider, 
  SidebarTrigger 
} from '@/components/ui/sidebar';
import SidebarMenuGroups from './SidebarMenuGroups';
import SidebarToggleButton from './SidebarToggleButton';
import SidebarUserFooter from './SidebarUserFooter';

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
              <SidebarContent>
                <SidebarMenuGroups />
              </SidebarContent>
              <SidebarFooter className="p-4">
                <SidebarUserFooter />
              </SidebarFooter>
            </Sidebar>
          )}
          <div className={`flex flex-col flex-1 ${!sidebarHidden ? 'ml-[calc(var(--sidebar-width)_-_1px)]' : ''} transition-all duration-300`}>
            <div className="flex items-center p-2 border-b">
              <SidebarToggleButton 
                sidebarHidden={sidebarHidden} 
                toggleSidebar={toggleSidebar} 
              />
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
