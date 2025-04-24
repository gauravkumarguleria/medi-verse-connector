
import React, { createContext, useContext } from 'react';
import { User } from '@/types';
import { UserContextType } from './types/userTypes';
import { useUserAuth } from './hooks/useUserAuth';
import { useUserOperations } from './hooks/useUserOperations';
import { useAuthSession } from './hooks/useAuthSession';
import { useSignOut } from './hooks/useSignOut';

// The initial mock user data
const initialUser: User = {
  id: "1",
  name: "John Doe",
  email: "john.doe@example.com",
  role: "patient",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  createdAt: new Date().toISOString()
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    user, 
    setUser, 
    isLoading, 
    setIsLoading, 
    isAuthenticated, 
    setIsAuthenticated, 
    fetchUserProfile 
  } = useUserAuth();

  const { updateUser } = useUserOperations(setUser, setIsLoading, fetchUserProfile);
  const { signOut } = useSignOut(setUser, setIsAuthenticated, setIsLoading, initialUser);

  useAuthSession(setUser, setIsLoading, setIsAuthenticated, fetchUserProfile, initialUser);

  const refreshUserProfile = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (data && data.session) {
        console.log('Refreshing user profile for:', data.session.user.id);
        setIsAuthenticated(true);
        await fetchUserProfile(data.session.user.id);
      }
    } catch (error) {
      console.error('Error refreshing user profile:', error);
      setIsAuthenticated(false);
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      isLoading, 
      isAuthenticated, 
      updateUser, 
      refreshUserProfile, 
      signOut 
    }}>
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
