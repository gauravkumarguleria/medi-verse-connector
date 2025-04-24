
import React from 'react';
import { Phone, Video, MoreVertical, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ChatHeaderProps {
  onBack: () => void;
  contactName: string;
  contactAvatar: string;
  isOnline: boolean;
}

const ChatHeader = ({ onBack, contactName, contactAvatar, isOnline }: ChatHeaderProps) => {
  return (
    <div className="p-3 border-b flex items-center sticky top-0 bg-background z-10 shadow-sm">
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden mr-2"
        onClick={onBack}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <Avatar className="h-10 w-10 mr-3">
        <AvatarImage src={contactAvatar} alt={contactName} />
        <AvatarFallback>{contactName.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <h3 className="font-semibold">{contactName}</h3>
        <p className="text-xs text-muted-foreground">
          {isOnline ? 'Online' : 'Offline'}
        </p>
      </div>
      
      <div className="flex items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Phone className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Call</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Video className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Video call</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>More options</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default ChatHeader;
