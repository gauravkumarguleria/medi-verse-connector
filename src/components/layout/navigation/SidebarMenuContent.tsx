
import { SidebarContent } from '@/components/ui/sidebar';
import { useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { MainNavigation } from './menu/MainNavigation';
import { DoctorTools } from './menu/DoctorTools';
import { PatientTools } from './menu/PatientTools';
import { Communication } from './menu/Communication';
import { SettingsMenu } from './menu/Settings';

export const SidebarMenuContent = () => {
  const location = useLocation();
  const { user } = useUser();
  const currentPath = location.pathname;

  return (
    <SidebarContent>
      <MainNavigation currentPath={currentPath} />
      {user.role === 'doctor' ? (
        <>
          <DoctorTools currentPath={currentPath} />
          <Communication currentPath={currentPath} />
        </>
      ) : (
        <>
          <PatientTools currentPath={currentPath} />
          <Communication currentPath={currentPath} />
        </>
      )}
      <SettingsMenu currentPath={currentPath} />
    </SidebarContent>
  );
};
