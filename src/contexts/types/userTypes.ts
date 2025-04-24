
import { User } from '@/types';

export interface UserContextType {
  user: User;
  isLoading: boolean;
  isAuthenticated: boolean;
  updateUser: (userData: Partial<User>) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}
