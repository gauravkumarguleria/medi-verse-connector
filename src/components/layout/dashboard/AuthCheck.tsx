
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useAuthCheck = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsChecking(true);
        console.log('Checking authentication status...');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking authentication:', error);
          toast({
            title: "Authentication Error",
            description: "Please log in again",
            variant: "destructive",
          });
          navigate('/auth');
          return;
        }
        
        if (!data || !data.session) {
          console.log('No active session found, redirecting to auth page');
          navigate('/auth');
          return;
        }
        
        console.log('User is authenticated, session valid');
      } catch (error) {
        console.error('Unexpected error checking auth status:', error);
        navigate('/auth');
      } finally {
        setIsChecking(false);
      }
    };
    
    checkAuth();
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed in AuthCheck:', event);
      if (event === 'SIGNED_OUT') {
        navigate('/auth');
      }
    });
    
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate]);
  
  return { isChecking };
};
