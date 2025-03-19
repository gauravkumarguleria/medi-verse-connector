
import React from 'react';
import { Link } from 'react-router-dom';
import { ThemeModeToggle } from '@/components/ui/ThemeModeToggle';
import UserMenu from './UserMenu';
import { User as UserType } from '@/types';

interface NavbarActionsProps {
  isAuthenticated: boolean;
  user?: UserType;
}

const NavbarActions: React.FC<NavbarActionsProps> = ({ isAuthenticated, user }) => {
  return (
    <div className="flex items-center gap-2">
      <ThemeModeToggle />
      {isAuthenticated && user ? (
        <UserMenu user={user} />
      ) : (
        <Link to="/auth" className="text-sm font-medium transition-colors hover:text-primary">
          Login
        </Link>
      )}
    </div>
  );
};

export default NavbarActions;
