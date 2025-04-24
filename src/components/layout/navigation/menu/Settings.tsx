
import { User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';

export const SettingsMenu = ({ currentPath }: { currentPath: string }) => {
  const navigate = useNavigate();

  const settings = [
    {
      label: 'Profile',
      icon: <User className="h-5 w-5" />,
      path: '/dashboard/profile'
    },
    {
      label: 'Settings',
      icon: <Settings className="h-5 w-5" />,
      path: '/dashboard/settings'
    }
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Settings</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {settings.map((setting) => (
            <SidebarMenuItem key={setting.label}>
              <SidebarMenuButton
                onClick={() => navigate(setting.path)}
                isActive={currentPath === setting.path}
                tooltip={setting.label}
              >
                {setting.icon}
                <span>{setting.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
