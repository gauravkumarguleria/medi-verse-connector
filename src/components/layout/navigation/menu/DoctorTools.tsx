
import { 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import { Users, Calendar, ClipboardList, Heart, Database } from 'lucide-react';

interface DoctorToolsProps {
  currentPath: string;
}

export const DoctorTools = ({ currentPath }: DoctorToolsProps) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Doctor Tools</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton 
            asChild
            isActive={currentPath === '/dashboard/appointments'}
            tooltip="Appointments"
          >
            <a href="/dashboard/appointments">
              <Calendar size={18} />
              <span>Appointments</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
        
        <SidebarMenuItem>
          <SidebarMenuButton 
            asChild
            isActive={currentPath === '/dashboard/medications'}
            tooltip="Prescriptions"
          >
            <a href="/dashboard/medications">
              <ClipboardList size={18} />
              <span>Prescriptions</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
        
        <SidebarMenuItem>
          <SidebarMenuButton 
            asChild
            isActive={currentPath === '/dashboard/records'}
            tooltip="Patient Records"
          >
            <a href="/dashboard/records">
              <Heart size={18} />
              <span>Patient Records</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
        
        <SidebarMenuItem>
          <SidebarMenuButton 
            asChild
            isActive={currentPath === '/dashboard/iot-devices'}
            tooltip="IoT Devices"
            className={currentPath === '/dashboard/iot-devices' ? "text-primary font-medium" : ""}
          >
            <a href="/dashboard/iot-devices">
              <Database size={18} />
              <span>IoT Devices</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
};
