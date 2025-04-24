
import { 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import { Heart, Calendar, PillIcon, AlarmClock, WifiIcon, Activity, Database } from 'lucide-react';

interface PatientToolsProps {
  currentPath: string;
}

export const PatientTools = ({ currentPath }: PatientToolsProps) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Health Tools</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton 
            asChild
            isActive={currentPath === '/dashboard/medications'}
            tooltip="Medications"
          >
            <a href="/dashboard/medications">
              <PillIcon size={18} />
              <span>Medications</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
        
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
            isActive={currentPath === '/dashboard/records'}
            tooltip="Health Records"
          >
            <a href="/dashboard/records">
              <Heart size={18} />
              <span>Health Records</span>
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
        
        <SidebarMenuItem>
          <SidebarMenuButton 
            asChild
            isActive={currentPath === '/dashboard/iot-reports'}
            tooltip="Health Reports"
          >
            <a href="/dashboard/iot-reports">
              <Activity size={18} />
              <span>Health Reports</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
};
