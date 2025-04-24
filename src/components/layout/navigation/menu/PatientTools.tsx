
import { MenuGroup, MenuLink } from '@/components/ui/sidebar';
import { Heart, Calendar, PillIcon, AlarmClock, WifiIcon, Activity, Database } from 'lucide-react';

interface PatientToolsProps {
  currentPath: string;
}

export const PatientTools = ({ currentPath }: PatientToolsProps) => {
  return (
    <MenuGroup title="Health Tools">
      <MenuLink 
        href="/dashboard/medications" 
        icon={<PillIcon size={18} />}
        isActive={currentPath === '/dashboard/medications'}
      >
        Medications
      </MenuLink>
      <MenuLink 
        href="/dashboard/appointments" 
        icon={<Calendar size={18} />}
        isActive={currentPath === '/dashboard/appointments'}
      >
        Appointments
      </MenuLink>
      <MenuLink 
        href="/dashboard/records" 
        icon={<Heart size={18} />}
        isActive={currentPath === '/dashboard/records'}
      >
        Health Records
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
