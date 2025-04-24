
import { CalendarClock, ClipboardList, Pill, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';

export const DoctorTools = ({ currentPath }: { currentPath: string }) => {
  const navigate = useNavigate();

  const tools = [
    {
      label: 'Appointments',
      icon: <CalendarClock className="h-5 w-5" />,
      path: '/dashboard/appointments'
    },
    {
      label: 'Patient Records',
      icon: <ClipboardList className="h-5 w-5" />,
      path: '/dashboard/records'
    },
    {
      label: 'Prescriptions',
      icon: <Pill className="h-5 w-5" />,
      path: '/dashboard/medications'
    }
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Doctor Tools</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {tools.map((tool) => (
            <SidebarMenuItem key={tool.label}>
              <SidebarMenuButton
                onClick={() => navigate(tool.path)}
                isActive={currentPath === tool.path}
                tooltip={tool.label}
              >
                {tool.icon}
                <span>{tool.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
