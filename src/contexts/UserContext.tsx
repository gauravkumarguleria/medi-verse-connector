
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// The initial mock user data
const initialUser: User = {
  id: "1",
  name: "John Doe",
  email: "john.doe@example.com",
  role: "patient",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  createdAt: new Date().toISOString()
};

interface UserContextType {
  user: User;
  isLoading: boolean;
  updateUser: (userData: Partial<User>) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(initialUser);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // This function fetches the user's profile from Supabase
  const fetchUserProfile = async (userId: string) => {
    try {
      setIsLoading(true);
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
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check for authenticated user on component mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data && data.session) {
          await fetchUserProfile(data.session.user.id);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error checking user:', error);
        setIsLoading(false);
      }
    };

    checkUser();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session && event === 'SIGNED_IN') {
          await fetchUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(initialUser);
        }
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const refreshUserProfile = async () => {
    const { data } = await supabase.auth.getSession();
    if (data && data.session) {
      await fetchUserProfile(data.session.user.id);
    }
  };

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
      
      // Format the data for Supabase (snake_case)
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

      // Update the profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update(formattedData)
        .eq('id', userId);

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Error updating profile",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setUser(prevUser => ({
        ...prevUser,
        ...userData,
      }));

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
        variant: "default",
      });
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

  return (
    <UserContext.Provider value={{ user, isLoading, updateUser, refreshUserProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
