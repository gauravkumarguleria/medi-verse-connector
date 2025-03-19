
import React, { ReactNode, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarProvider, 
  SidebarTrigger 
} from '@/components/ui/sidebar';
import { useUser } from '@/contexts/UserContext';

// Import our new components
import SidebarMenu from './dashboard/SidebarMenu';
import SidebarFooterContent from './dashboard/SidebarFooter';
import SidebarToggle from './dashboard/SidebarToggle';
import { getMenuItems } from './dashboard/MenuItems';
import { useAuthCheck } from './dashboard/AuthCheck';
import { useLogoutHandler } from './dashboard/LogoutHandler';
import { useNavigation } from './dashboard/NavigationUtils';
import Navbar from './Navbar';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const { user } = useUser();
  const { handleNavigation } = useNavigation();
  const { handleLogout } = useLogoutHandler();

  // Check authentication on component mount
  useAuthCheck();

  const toggleSidebar = () => {
    setSidebarHidden(!sidebarHidden);
  };

  // Get menu items based on user role
  const menuItems = getMenuItems(user, location, handleNavigation);

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
                <SidebarMenu menuItems={menuItems} />
              </SidebarContent>
              <SidebarFooter className="p-4">
                <SidebarFooterContent 
                  user={user}
                  handleLogout={handleLogout}
                />
              </SidebarFooter>
            </Sidebar>
          )}
          <div className={`flex flex-col flex-1 ${!sidebarHidden ? 'ml-[calc(var(--sidebar-width)_-_1px)]' : ''} transition-all duration-300`}>
            <div className="flex items-center p-2 border-b">
              <SidebarToggle 
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
