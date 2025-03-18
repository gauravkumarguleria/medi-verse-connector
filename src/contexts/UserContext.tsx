
import React, { createContext, useContext, useState } from 'react';
import { User } from '@/types';

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
  updateUser: (userData: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(initialUser);

  const updateUser = (userData: Partial<User>) => {
    setUser(prevUser => ({
      ...prevUser,
      ...userData,
    }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
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
