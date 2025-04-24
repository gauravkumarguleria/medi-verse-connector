
import { 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from '@/components/ui/sidebar';
import { useLocation } from 'react-router-dom';
import { useMenuItems } from './getMenuItems';
import { useUser } from '@/contexts/UserContext';

export const SidebarMenuContent = () => {
  const location = useLocation();
  const { user } = useUser();
  const { getMenuItems } = useMenuItems();
  const currentPath = location.pathname;
  const menuItems = getMenuItems(user.role, currentPath);

  return (
    <SidebarContent>
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
    </SidebarContent>
  );
};
