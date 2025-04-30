
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { ThemeModeToggle } from '@/components/ui/ThemeModeToggle';
import { useUser } from '@/contexts/UserContext';

const SidebarUserFooter: React.FC = () => {
  const { user, signOut } = useUser();

  const handleLogout = async () => {
    try {
      console.log("Logout initiated from sidebar");
      await signOut();
      // Navigation is now handled in the signOut function in UserContext
    } catch (error) {
      console.error('Error during logout in sidebar:', error);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-2">
        <User className="h-5 w-5 text-muted-foreground" />
        <div className="flex flex-col">
          <span className="text-sm font-medium">{user.name}</span>
          <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
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

export default SidebarUserFooter;
