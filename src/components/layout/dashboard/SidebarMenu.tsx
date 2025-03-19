
import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent, 
  SidebarMenu as Menu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from '@/components/ui/sidebar';
import { User as UserType } from '@/types';
import { isActiveRoute } from './NavigationUtils';

interface MenuGroupItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  isActive: boolean;
}

interface MenuGroup {
  group: string;
  items: MenuGroupItem[];
}

interface SidebarMenuProps {
  menuItems: MenuGroup[];
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ menuItems }) => {
  return (
    <>
      {menuItems.map((group, index) => (
        <SidebarGroup key={index}>
          <SidebarGroupLabel>{group.group}</SidebarGroupLabel>
          <SidebarGroupContent>
            <Menu>
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
            </Menu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
};

export default SidebarMenu;
