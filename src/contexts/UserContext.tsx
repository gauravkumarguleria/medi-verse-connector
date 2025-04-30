import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { useToast } from '@/hooks/use-toast';

// Sample user data for local authentication
const sampleUsers = [
  {
    id: "doctor-1",
    email: "doctor@mediverse.com",
    password: "password123",
    name: "Dr. John Smith",
    role: "doctor" as UserRole,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor",
    createdAt: new Date().toISOString(),
    specialty: "Cardiologist",
    experience: "10 years"
  },
  {
    id: "patient-1",
    email: "patient@mediverse.com",
    password: "password123",
    name: "Sarah Johnson",
    role: "patient" as UserRole,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    createdAt: new Date().toISOString(),
    dateOfBirth: "1990-05-15",
    bloodType: "O+",
    allergies: "Penicillin"
  },
  {
    id: "pharmacist-1",
    email: "pharmacist@mediverse.com",
    password: "password123",
    name: "Mike Chen",
    role: "pharmacist" as UserRole,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
    createdAt: new Date().toISOString()
  }
];

// The initial mock user data
const initialUser: User = {
  id: "",
  name: "",
  email: "",
  role: "patient",
  avatar: "",
  createdAt: new Date().toISOString()
};

interface UserContextType {
  user: User;
  isLoading: boolean;
  isAuthenticated: boolean;
  updateUser: (userData: Partial<User>) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  signOut: () => Promise<void>;
  loginWithEmailAndPassword: (email: string, password: string) => Promise<boolean>;
  registerUser: (email: string, password: string, name: string, role: UserRole) => Promise<boolean>;
  getAllUsers: () => User[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Helper function to simulate API delay
const simulateDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(initialUser);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { toast } = useToast();

  // Check for any stored user session on component mount
  useEffect(() => {
    const checkStoredSession = async () => {
      try {
        setIsLoading(true);
        
        // Check local storage for saved user session
        const storedUser = localStorage.getItem('mediverse_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
          console.log('User loaded from local storage:', userData.name);
        }
      } catch (error) {
        console.error('Error checking stored session:', error);
        localStorage.removeItem('mediverse_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkStoredSession();
  }, []);

  const loginWithEmailAndPassword = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log('Attempting login with:', email);

      // Simulate API delay
      await simulateDelay();

      // Find user with matching credentials
      const matchedUser = sampleUsers.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!matchedUser) {
        console.error('Invalid credentials');
        toast({
          title: "Login Failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
        return false;
      }

      // Create a copy of the user without the password
      const { password: _, ...safeUserData } = matchedUser;

      // Set user data and auth state
      setUser(safeUserData as User);
      setIsAuthenticated(true);

      // Save to local storage
      localStorage.setItem('mediverse_user', JSON.stringify(safeUserData));

      console.log('Login successful for:', safeUserData.name);
      toast({
        title: "Login Successful",
        description: `Welcome back, ${safeUserData.name}!`,
      });

      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (email: string, password: string, name: string, role: UserRole): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log('Attempting registration for:', email);

      // Simulate API delay
      await simulateDelay();

      // Check if user already exists
      if (sampleUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        console.error('User already exists');
        toast({
          title: "Registration Failed",
          description: "An account with this email already exists",
          variant: "destructive",
        });
        return false;
      }

      // Create new user
      const newUser = {
        id: `${role}-${Date.now()}`,
        email,
        password,
        name,
        role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        createdAt: new Date().toISOString()
      };

      // Add to sample users (in a real app, this would persist to a database)
      sampleUsers.push(newUser);

      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully",
      });

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUserProfile = async (): Promise<void> => {
    try {
      // In a local implementation, this might reload from localStorage
      // or refresh from an API
      console.log('Refreshing user profile');
      
      // Instead of returning user data, we don't return anything (void)
      return;
    } catch (error) {
      console.error('Error refreshing user profile:', error);
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
      
      // Simulate API delay
      await simulateDelay(300);
      
      // Clear local storage
      localStorage.removeItem('mediverse_user');
      
      // Reset user state to initial
      setUser(initialUser);
      setIsAuthenticated(false);
      
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      
      console.log('Redirecting to home page');
      
      // Force a page reload to clear any cached state
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
      console.log('Updating user data:', userData);
      
      // Simulate API delay
      await simulateDelay();

      // Update local state
      setUser(prevUser => {
        const updatedUser = { ...prevUser, ...userData };
        // Update in local storage too
        localStorage.setItem('mediverse_user', JSON.stringify(updatedUser));
        return updatedUser;
      });

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

  const getAllUsers = (): User[] => {
    // Return all sample users without passwords
    return sampleUsers.map(({ password: _, ...userData }) => userData as User);
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      isLoading, 
      isAuthenticated, 
      updateUser, 
      refreshUserProfile, 
      signOut,
      loginWithEmailAndPassword,
      registerUser,
      getAllUsers
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
