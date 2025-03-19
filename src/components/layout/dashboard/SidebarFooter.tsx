
import React from 'react';
import { User, LogOut } from 'lucide-react';
import { Button } from '../../ui/button';
import { ThemeModeToggle } from '../../ui/ThemeModeToggle';
import { User as UserType } from '@/types';

interface SidebarFooterProps {
  user?: UserType;
  handleLogout: () => Promise<void>;
}

const SidebarFooterContent: React.FC<SidebarFooterProps> = ({ user, handleLogout }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-2">
        <User className="h-5 w-5 text-muted-foreground" />
        <div className="flex flex-col">
          <span className="text-sm font-medium">{user?.name || 'User'}</span>
          <span className="text-xs text-muted-foreground capitalize">{user?.role || 'patient'}</span>
        </div>
      </div>
      <ThemeModeToggle />
      <Button 
        variant="outline" 
        className="w-full flex items-center gap-2 mt-2" 
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4" />
        <span>Logout</span>
      </Button>
    </div>
  );
};

export default SidebarFooterContent;
