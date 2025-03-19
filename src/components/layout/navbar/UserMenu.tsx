
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { User as UserType } from '@/types';

interface UserMenuProps {
  user: UserType;
}

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error logging out:', error);
        toast({
          title: "Logout Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Successfully logged out, redirect to home
        console.log('User logged out successfully');
        toast({
          title: "Logged Out",
          description: "You have been successfully logged out",
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Logout Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleProfileClick = () => {
    navigate('/dashboard/profile');
  };
  
  const handleSettingsClick = () => {
    navigate('/dashboard/settings');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuItem onClick={handleProfileClick}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSettingsClick}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
