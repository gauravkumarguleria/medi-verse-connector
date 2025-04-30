
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import { 
  Home, 
  Settings, 
  User, 
  Pill, 
  CalendarClock, 
  MessageSquare, 
  CircuitBoard,
  ClipboardList
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

const SidebarMenuGroups = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  const isActiveRoute = (route: string) => {
    return location.pathname === route || (route !== '/dashboard' && location.pathname.startsWith(route));
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
            onClick: () => navigate('/dashboard'),
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
            onClick: () => navigate('/dashboard/profile'),
            isActive: isActiveRoute('/dashboard/profile'),
          },
          {
            label: 'Settings',
            icon: <Settings className="h-5 w-5" />,
            onClick: () => navigate('/dashboard/settings'),
            isActive: isActiveRoute('/dashboard/settings'),
          },
        ],
      },
    ];

    // Doctor-specific menu items
    if (user.role === 'doctor') {
      return [
        ...commonItems.slice(0, 1),
        {
          group: 'Doctor Tools',
          items: [
            {
              label: 'Appointments',
              icon: <CalendarClock className="h-5 w-5" />,
              onClick: () => navigate('/dashboard/appointments'),
              isActive: isActiveRoute('/dashboard/appointments'),
            },
            {
              label: 'Prescriptions',
              icon: <Pill className="h-5 w-5" />,
              onClick: () => navigate('/dashboard/medications'),
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
              onClick: () => navigate('/dashboard/messages'),
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
            onClick: () => navigate('/dashboard/appointments'),
            isActive: isActiveRoute('/dashboard/appointments'),
          },
          {
            label: 'Medications',
            icon: <Pill className="h-5 w-5" />,
            onClick: () => navigate('/dashboard/medications'),
            isActive: isActiveRoute('/dashboard/medications'),
          },
          {
            label: 'Health Records',
            icon: <ClipboardList className="h-5 w-5" />,
            onClick: () => navigate('/dashboard/records'),
            isActive: isActiveRoute('/dashboard/records'),
          },
        ],
      },
      {
        group: 'Communication',
        items: [
          {
            label: 'Messages',
            icon: <MessageSquare className="h-5 w-5" />,
            onClick: () => navigate('/dashboard/messages'),
            isActive: isActiveRoute('/dashboard/messages'),
          },
        ],
      },
      {
        group: 'Monitoring',
        items: [
          {
            label: 'IoT Devices',
            icon: <CircuitBoard className="h-5 w-5" />,
            onClick: () => navigate('/dashboard/iot-devices'),
            isActive: isActiveRoute('/dashboard/iot-devices'),
          },
        ],
      },
      ...commonItems.slice(1),
    ];
  };

  const menuItems = getMenuItems();

  return (
    <>
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
    </>
  );
};

export default SidebarMenuGroups;
