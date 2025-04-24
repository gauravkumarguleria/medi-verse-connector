
import { useNavigate } from 'react-router-dom';
import { Home, Settings, User, Pill, CalendarClock, ClipboardList, MessageSquare, CircuitBoard } from 'lucide-react';

export const useMenuItems = () => {
  const navigate = useNavigate();

  const getCommonItems = () => [
    {
      group: 'Main Navigation',
      items: [
        {
          label: 'Dashboard',
          icon: <Home className="h-5 w-5" />,
          onClick: () => navigate('/dashboard'),
          isActive: (path: string) => 
            path === '/dashboard' && !path.includes('/dashboard/'),
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
          isActive: (path: string) => path === '/dashboard/profile',
        },
        {
          label: 'Settings',
          icon: <Settings className="h-5 w-5" />,
          onClick: () => navigate('/dashboard/settings'),
          isActive: (path: string) => path === '/dashboard/settings',
        },
      ],
    },
  ];

  const getDoctorItems = () => [
    ...getCommonItems().slice(0, 1),
    {
      group: 'Doctor Tools',
      items: [
        {
          label: 'Appointments',
          icon: <CalendarClock className="h-5 w-5" />,
          onClick: () => navigate('/dashboard/appointments'),
          isActive: (path: string) => path === '/dashboard/appointments',
        },
        {
          label: 'Patient Records',
          icon: <ClipboardList className="h-5 w-5" />,
          onClick: () => navigate('/dashboard/records'),
          isActive: (path: string) => path === '/dashboard/records',
        },
        {
          label: 'Prescriptions',
          icon: <Pill className="h-5 w-5" />,
          onClick: () => navigate('/dashboard/medications'),
          isActive: (path: string) => path === '/dashboard/medications',
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
          isActive: (path: string) => path === '/dashboard/messages',
        },
      ],
    },
    ...getCommonItems().slice(1),
  ];

  const getPatientItems = () => [
    ...getCommonItems().slice(0, 1),
    {
      group: 'Health Management',
      items: [
        {
          label: 'Appointments',
          icon: <CalendarClock className="h-5 w-5" />,
          onClick: () => navigate('/dashboard/appointments'),
          isActive: (path: string) => path === '/dashboard/appointments',
        },
        {
          label: 'Medications',
          icon: <Pill className="h-5 w-5" />,
          onClick: () => navigate('/dashboard/medications'),
          isActive: (path: string) => path === '/dashboard/medications',
        },
        {
          label: 'Health Records',
          icon: <ClipboardList className="h-5 w-5" />,
          onClick: () => navigate('/dashboard/records'),
          isActive: (path: string) => path === '/dashboard/records',
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
          isActive: (path: string) => path === '/dashboard/messages',
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
          isActive: (path: string) => path === '/dashboard/iot-devices',
        },
      ],
    },
    ...getCommonItems().slice(1),
  ];

  return {
    getMenuItems: (role: string, currentPath: string) => 
      (role === 'doctor' ? getDoctorItems() : getPatientItems())
        .map(group => ({
          ...group,
          items: group.items.map(item => ({
            ...item,
            isActive: item.isActive(currentPath),
          })),
        })),
  };
};
