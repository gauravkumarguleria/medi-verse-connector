
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';

export const useAuthSession = (
  setUser: React.Dispatch<React.SetStateAction<User>>,
  setIsLoading: (value: boolean) => void,
  setIsAuthenticated: (value: boolean) => void,
  fetchUserProfile: (userId: string) => Promise<void>,
  initialUser: User
) => {
  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true);
        const { data } = await supabase.auth.getSession();
        
        if (data && data.session) {
          console.log('Session found, user is authenticated with ID:', data.session.user.id);
          setIsAuthenticated(true);
          await fetchUserProfile(data.session.user.id);
        } else {
          console.log('No authenticated session found');
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session ? 'session exists' : 'no session');
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session) {
            console.log('User signed in or token refreshed:', session.user.id);
            setIsAuthenticated(true);
            await fetchUserProfile(session.user.id);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out, resetting to initial user');
          setUser(initialUser);
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);
};
