
import { MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';

export const Communication = ({ currentPath }: { currentPath: string }) => {
  const navigate = useNavigate();
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Communication</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => navigate('/dashboard/messages')}
              isActive={currentPath === '/dashboard/messages'}
              tooltip="Messages"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Messages</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
