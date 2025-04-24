
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useUserAuth = () => {
  const [user, setUser] = useState<User>({
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "patient",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    createdAt: new Date().toISOString()
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { toast } = useToast();

  const fetchUserProfile = async (userId: string) => {
    try {
      setIsLoading(true);
      
      console.log('Fetching user profile for ID:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (data) {
        console.log('Profile data retrieved:', data);
        setUser({
          id: data.id,
          name: data.name || '',
          email: data.email || '',
          role: data.role as 'patient' | 'doctor' | 'pharmacist' | 'admin',
          avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`,
          createdAt: data.created_at,
          phone: data.phone,
          dateOfBirth: data.date_of_birth,
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zip_code,
          bloodType: data.blood_type,
          height: data.height,
          weight: data.weight,
          allergies: data.allergies,
          conditions: data.conditions
        });
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    setUser,
    isLoading,
    setIsLoading,
    isAuthenticated,
    setIsAuthenticated,
    fetchUserProfile
  };
};
