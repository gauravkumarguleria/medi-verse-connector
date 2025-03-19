
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const useAuthCheck = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data || !data.session) {
          console.log('User not authenticated, redirecting to auth');
          navigate('/auth');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        navigate('/auth');
      }
    };
    
    checkAuth();
  }, [navigate]);
};
