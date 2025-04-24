
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useUserOperations = (
  setUser: React.Dispatch<React.SetStateAction<User>>,
  setIsLoading: (value: boolean) => void,
  fetchUserProfile: (userId: string) => Promise<void>
) => {
  const { toast } = useToast();

  const updateUser = async (userData: Partial<User>) => {
    try {
      setIsLoading(true);
      const { data: authData } = await supabase.auth.getSession();
      
      if (!authData || !authData.session) {
        toast({
          title: "Not authenticated",
          description: "You must be logged in to update your profile.",
          variant: "destructive",
        });
        return;
      }

      const userId = authData.session.user.id;
      console.log('Updating profile for user ID:', userId);
      
      const formattedData = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        date_of_birth: userData.dateOfBirth,
        address: userData.address,
        city: userData.city,
        state: userData.state,
        zip_code: userData.zipCode,
        blood_type: userData.bloodType,
        height: userData.height,
        weight: userData.weight,
        allergies: userData.allergies,
        conditions: userData.conditions,
        avatar: userData.avatar,
        role: userData.role
      };

      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      let error;
      
      if (!existingProfile) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({ ...formattedData, id: userId });
          
        error = insertError;
      } else {
        const { error: updateError } = await supabase
          .from('profiles')
          .update(formattedData)
          .eq('id', userId);
          
        error = updateError;
      }

      if (error) throw error;

      setUser(prevUser => ({
        ...prevUser,
        ...userData,
      }));

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      await fetchUserProfile(userId);
      
    } catch (error) {
      console.error('Error in updateUser:', error);
      toast({
        title: "Error updating profile",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { updateUser };
};
