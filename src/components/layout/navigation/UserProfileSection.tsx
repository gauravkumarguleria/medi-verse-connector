
import { User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeModeToggle } from '@/components/ui/ThemeModeToggle';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';

export const UserProfileSection = () => {
  const { user, signOut } = useUser();
  const navigate = useNavigate();
  const userInitials = user.name.split(' ').map(n => n[0]).join('');

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {userInitials}
          </AvatarFallback>
        </Avatar>
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
