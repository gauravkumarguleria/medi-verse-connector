
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, LogOut, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { User as UserType } from '@/types';
import NavItems from './NavItems';

interface NavItem {
  name: string;
  href: string;
  active: boolean;
}

interface MobileMenuProps {
  isOpen: boolean;
  navItems: NavItem[];
  isAuthenticated: boolean;
  user?: UserType;
  onProfileClick: () => void;
  onSettingsClick: () => void;
  onLogout: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  navItems,
  isAuthenticated,
  onProfileClick,
  onSettingsClick,
  onLogout,
}) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border animate-slide-down">
      <nav className="flex flex-col p-4 gap-2">
        <NavItems 
          items={navItems} 
          itemClassName="block py-2"
        />
        {isAuthenticated ? (
          <>
            <Button variant="ghost" className="justify-start" onClick={onProfileClick}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Button>
            <Button variant="ghost" className="justify-start" onClick={onSettingsClick}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Button>
            <Button variant="ghost" className="justify-start" onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </Button>
          </>
        ) : (
          <Link to="/auth" className="block py-2 text-sm font-medium transition-colors hover:text-primary">
            Login
          </Link>
        )}
      </nav>
    </div>
  );
};

export default MobileMenu;
