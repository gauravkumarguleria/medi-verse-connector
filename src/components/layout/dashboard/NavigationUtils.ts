
import { useNavigate, useLocation } from 'react-router-dom';

// Check if a route is active
export const isActiveRoute = (location: { pathname: string }, route: string) => {
  return location.pathname === route || (route !== '/dashboard' && location.pathname.startsWith(route));
};

// Navigate to a specific path
export const useNavigation = () => {
  const navigate = useNavigate();
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };
  
  return { handleNavigation };
};
