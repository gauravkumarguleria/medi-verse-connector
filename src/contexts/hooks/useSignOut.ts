
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types';

export const useSignOut = (
  setUser: React.Dispatch<React.SetStateAction<User>>,
  setIsAuthenticated: (value: boolean) => void,
  setIsLoading: (value: boolean) => void,
  initialUser: User
) => {
  const { toast } = useToast();

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        toast({
          title: "Error",
          description: "Failed to sign out. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      setUser(initialUser);
      setIsAuthenticated(false);
      
      localStorage.removeItem('supabase.auth.token');
      
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      
      window.location.href = '/';
      
    } catch (error) {
      console.error('Error in signOut function:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during sign out.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { signOut };
};
