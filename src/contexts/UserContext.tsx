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
  isAuthenticated: boolean;
  updateUser: (userData: Partial<User>) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(initialUser);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { toast } = useToast();

  // This function fetches the user's profile from Supabase
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
      } else {
        console.log('No profile data found for user ID:', userId);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Check for authenticated user on component mount
  useEffect(() => {
    // First set up the auth state listener to catch any changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session ? 'session exists' : 'no session');
        
        if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          console.log('User signed in or token refreshed:', session.user.id);
          await fetchUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out, resetting to initial user');
          setUser(initialUser);
          setIsAuthenticated(false);
        }
      }
    );

    // Then check for existing session
    const checkUser = async () => {
      try {
        setIsLoading(true);
        const { data } = await supabase.auth.getSession();
        console.log('Auth session data:', data);
        
        if (data && data.session) {
          console.log('User is authenticated with ID:', data.session.user.id);
          await fetchUserProfile(data.session.user.id);
        } else {
          console.log('No authenticated session found, using initial user data');
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error checking user:', error);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    checkUser();

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const refreshUserProfile = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (data && data.session) {
        console.log('Refreshing user profile for:', data.session.user.id);
        await fetchUserProfile(data.session.user.id);
      } else {
        console.log('Cannot refresh profile: No active session');
        setIsAuthenticated(false);
        toast({
          title: "Authentication Error",
          description: "You must be logged in to view your profile.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error refreshing user profile:', error);
      setIsAuthenticated(false);
      toast({
        title: "Error",
        description: "Failed to refresh your profile.",
        variant: "destructive",
      });
    }
  };

  const signOut = async () => {
    try {
      console.log('Starting signOut process in UserContext');
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
      
      console.log('Supabase signOut successful, resetting user state');
      
      // Reset user state to initial
      setUser(initialUser);
      setIsAuthenticated(false);
      
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      
      console.log('Redirecting to home page');
      // Force a page reload to clear any cached state and navigate to home
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

      console.log('Sending update with data:', formattedData);

      // First, check if the profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error checking if profile exists:', fetchError);
        toast({
          title: "Error updating profile",
          description: fetchError.message,
          variant: "destructive",
        });
        return;
      }

      let error;
      
      if (!existingProfile) {
        console.log('Profile does not exist, creating new one');
        // Profile doesn't exist, create it
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({ ...formattedData, id: userId });
          
        error = insertError;
      } else {
        console.log('Profile exists, updating');
        // Profile exists, update it
        const { error: updateError } = await supabase
          .from('profiles')
          .update(formattedData)
          .eq('id', userId);
          
        error = updateError;
      }

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

      console.log('Profile updated successfully');

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
        variant: "default",
      });
      
      // Refresh the profile to ensure we have the latest data
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

  return (
    <UserContext.Provider value={{ user, isLoading, isAuthenticated, updateUser, refreshUserProfile, signOut }}>
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
