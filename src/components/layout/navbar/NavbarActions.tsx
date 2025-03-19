
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ThemeModeToggle } from '@/components/ui/ThemeModeToggle';
import UserMenu from './UserMenu';
import { User as UserType } from '@/types';
import { supabase } from '@/integrations/supabase/client';

interface NavbarActionsProps {
  isAuthenticated: boolean;
  user?: UserType;
}

const NavbarActions: React.FC<NavbarActionsProps> = ({ isAuthenticated, user }) => {
  const [authenticated, setAuthenticated] = useState<boolean>(isAuthenticated);
  const [currentUser, setCurrentUser] = useState<UserType | undefined>(user);

  // Add a useEffect to check authentication status directly
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setAuthenticated(!!data.session);
        if (data.session) {
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setAuthenticated(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed in NavbarActions:', event);
        setAuthenticated(!!session);
        if (session) {
          setCurrentUser(user);
        }
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [user, isAuthenticated]);

  return (
    <div className="flex items-center gap-2">
      <ThemeModeToggle />
      {(authenticated && currentUser && currentUser.id !== "1") ? (
        <UserMenu user={currentUser} />
      ) : (
        <Link to="/auth" className="text-sm font-medium transition-colors hover:text-primary">
          Login
        </Link>
      )}
    </div>
  );
};

export default NavbarActions;
