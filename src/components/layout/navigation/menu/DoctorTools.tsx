
import { MenuGroup, MenuLink } from '@/components/ui/sidebar';
import { Users, Calendar, ClipboardList, Heart, Database, Activity } from 'lucide-react';

interface DoctorToolsProps {
  currentPath: string;
}

export const DoctorTools = ({ currentPath }: DoctorToolsProps) => {
  return (
    <MenuGroup title="Doctor Tools">
      <MenuLink 
        href="/dashboard/appointments" 
        icon={<Calendar size={18} />}
        isActive={currentPath === '/dashboard/appointments'}
      >
        Appointments
      </MenuLink>
      <MenuLink 
        href="/dashboard/medications" 
        icon={<ClipboardList size={18} />}
        isActive={currentPath === '/dashboard/medications'}
      >
        Prescriptions
      </MenuLink>
      <MenuLink 
        href="/dashboard/records" 
        icon={<Heart size={18} />}
        isActive={currentPath === '/dashboard/records'}
      >
        Patient Records
      </MenuLink>
      <MenuLink 
        href="/dashboard/iot-devices" 
        icon={<Database size={18} />}
        isActive={currentPath === '/dashboard/iot-devices'}
        className="text-primary font-medium"
      >
        IoT Devices
      </MenuLink>
      <MenuLink 
        href="/dashboard/iot-reports" 
        icon={<Activity size={18} />}
        isActive={currentPath === '/dashboard/iot-reports'}
      >
        Health Reports
      </MenuLink>
    </MenuGroup>
  );
};
