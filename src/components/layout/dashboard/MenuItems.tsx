
import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Home, 
  Settings, 
  User,
  Pill,
  CalendarClock,
  ClipboardList,
  MessageSquare,
  HeartPulse,
  CircuitBoard,
  ShoppingBag
} from 'lucide-react';
import { User as UserType } from '@/types';
import { isActiveRoute } from './NavigationUtils';

interface MenuConfig {
  group: string;
  items: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    isActive: boolean;
  }[];
}

export const getMenuItems = (
  user?: UserType,
  location?: { pathname: string },
  handleNavigation?: (path: string) => void
) => {
  if (!location || !handleNavigation) return [];
  
  const commonItems = [
    {
      group: 'Main Navigation',
      items: [
        {
          label: 'Dashboard',
          icon: <Home className="h-5 w-5" />,
          onClick: () => handleNavigation('/dashboard'),
          isActive: isActiveRoute(location, '/dashboard') && !location.pathname.includes('/dashboard/'),
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
          isActive: isActiveRoute(location, '/dashboard/profile'),
        },
        {
          label: 'Settings',
          icon: <Settings className="h-5 w-5" />,
          onClick: () => handleNavigation('/dashboard/settings'),
          isActive: isActiveRoute(location, '/dashboard/settings'),
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
            isActive: isActiveRoute(location, '/dashboard/appointments'),
          },
          {
            label: 'Patient Records',
            icon: <ClipboardList className="h-5 w-5" />,
            onClick: () => handleNavigation('/dashboard/records'),
            isActive: isActiveRoute(location, '/dashboard/records'),
          },
          {
            label: 'Prescriptions',
            icon: <Pill className="h-5 w-5" />,
            onClick: () => handleNavigation('/dashboard/medications'),
            isActive: isActiveRoute(location, '/dashboard/medications'),
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
            isActive: isActiveRoute(location, '/dashboard/messages'),
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
          isActive: isActiveRoute(location, '/dashboard/appointments'),
        },
        {
          label: 'Medications',
          icon: <Pill className="h-5 w-5" />,
          onClick: () => handleNavigation('/dashboard/medications'),
          isActive: isActiveRoute(location, '/dashboard/medications'),
        },
        {
          label: 'Health Records',
          icon: <ClipboardList className="h-5 w-5" />,
          onClick: () => handleNavigation('/dashboard/records'),
          isActive: isActiveRoute(location, '/dashboard/records'),
        },
        {
          label: 'Pharmacy Store',
          icon: <ShoppingBag className="h-5 w-5" />,
          onClick: () => handleNavigation('/dashboard/pharmacy'),
          isActive: isActiveRoute(location, '/dashboard/pharmacy'),
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
          isActive: isActiveRoute(location, '/dashboard/messages'),
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
          isActive: isActiveRoute(location, '/dashboard/vitals'),
        },
        {
          label: 'IoT Devices',
          icon: <CircuitBoard className="h-5 w-5" />,
          onClick: () => handleNavigation('/dashboard/iot-devices'),
          isActive: isActiveRoute(location, '/dashboard/iot-devices'),
        },
      ],
    },
    ...commonItems.slice(1),
  ];
};
