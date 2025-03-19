
import React from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button } from '../../ui/button';

interface SidebarToggleProps {
  sidebarHidden: boolean;
  toggleSidebar: () => void;
}

const SidebarToggle: React.FC<SidebarToggleProps> = ({ sidebarHidden, toggleSidebar }) => {
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

export default SidebarToggle;
