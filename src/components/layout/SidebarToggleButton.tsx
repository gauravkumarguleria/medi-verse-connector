
import React from 'react';
import { Button } from '@/components/ui/button';
import { PanelLeftOpen, PanelLeftClose } from 'lucide-react';

interface SidebarToggleButtonProps {
  sidebarHidden: boolean;
  toggleSidebar: () => void;
}

const SidebarToggleButton: React.FC<SidebarToggleButtonProps> = ({ 
  sidebarHidden, 
  toggleSidebar 
}) => {
  return (
    <Button 
      variant="sidebar" 
      size="icon" 
      onClick={toggleSidebar} 
      className="ml-0"
      aria-label={sidebarHidden ? "Show sidebar" : "Hide sidebar"}
    >
      {sidebarHidden ? (
        <PanelLeftOpen className="h-5 w-5" />
      ) : (
        <PanelLeftClose className="h-5 w-5" />
      )}
    </Button>
  );
};

export default SidebarToggleButton;
