
import { useNavigate, useLocation } from 'react-router-dom';

// Check if a route is active
export const isActiveRoute = (location: { pathname: string }, route: string) => {
  return location.pathname === route || (route !== '/dashboard' && location.pathname.startsWith(route));
};

// Navigate to a specific path
export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleNavigation = (path: string) => {
    // Ensure the path is correctly formatted for dashboard routes
    const fullPath = path.startsWith('/dashboard') ? path : `/dashboard${path.startsWith('/') ? path : `/${path}`}`;
    console.log(`Navigating to: ${fullPath} from ${location.pathname}`);
    navigate(fullPath);
  };
  
  return { handleNavigation };
};
