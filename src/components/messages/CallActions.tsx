
import React from 'react';
import { Phone, Video, PhoneOff, VideoOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';

interface CallActionsProps {
  recipient: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  };
}

export function CallActions({ recipient }: CallActionsProps) {
  const [isVideoCallActive, setIsVideoCallActive] = React.useState(false);
  const [isVoiceCallActive, setIsVoiceCallActive] = React.useState(false);
  const [isMicMuted, setIsMicMuted] = React.useState(false);
  const [isVideoOff, setIsVideoOff] = React.useState(false);
  const isMobile = useIsMobile();
  
  const handleStartVideoCall = () => {
    setIsVideoCallActive(true);
    toast({
      title: "Video call started",
      description: `Connecting to ${recipient.name}...`
    });
  };
  
  const handleStartVoiceCall = () => {
    setIsVoiceCallActive(true);
    toast({
      title: "Voice call started",
      description: `Calling ${recipient.name}...`
    });
  };
  
  const handleEndCall = () => {
    if (isVideoCallActive) {
      setIsVideoCallActive(false);
      toast({
        title: "Video call ended",
        description: `Call with ${recipient.name} has ended`
      });
    }
    
    if (isVoiceCallActive) {
      setIsVoiceCallActive(false);
      toast({
        title: "Voice call ended",
        description: `Call with ${recipient.name} has ended`
      });
    }
  };
  
  const toggleMic = () => {
    setIsMicMuted(!isMicMuted);
    toast({
      description: isMicMuted ? "Microphone unmuted" : "Microphone muted"
    });
  };
  
  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    toast({
      description: isVideoOff ? "Camera turned on" : "Camera turned off"
    });
  };
  
  return (
    <>
      <div className={cn("flex gap-2", isMobile ? "flex-col" : "")}>
        <Button 
          variant="outline"
          className="bg-green-50 hover:bg-green-100 text-green-600"
          onClick={handleStartVoiceCall}
          disabled={isVoiceCallActive || isVideoCallActive}
        >
          <Phone className="mr-2 h-4 w-4" />
          {!isMobile && "Voice Call"}
        </Button>
        
        <Button 
          variant="outline" 
          className="bg-blue-50 hover:bg-blue-100 text-blue-600"
          onClick={handleStartVideoCall}
          disabled={isVoiceCallActive || isVideoCallActive}
        >
          <Video className="mr-2 h-4 w-4" />
          {!isMobile && "Video Call"}
        </Button>
      </div>
      
      {/* Video Call Dialog */}
      <Dialog open={isVideoCallActive} onOpenChange={setIsVideoCallActive}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Video Call with {recipient.name}</DialogTitle>
          </DialogHeader>
          
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video mb-4">
            {!isVideoOff ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-white">Camera preview would show here</p>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <Avatar className="h-20 w-20">
                  <img src={recipient.avatar} alt={recipient.name} />
                </Avatar>
              </div>
            )}
            
            <div className="absolute bottom-4 right-4 bg-gray-800 rounded-lg p-2">
              <Avatar className="h-16 w-16">
                <img src="https://i.pravatar.cc/150?img=12" alt="You" />
              </Avatar>
            </div>
          </div>
          
          <div className="flex justify-center gap-4 py-2">
            <Button 
              variant="outline" 
              className={isMicMuted ? "bg-red-100 text-red-500" : ""}
              onClick={toggleMic}
            >
              {isMicMuted ? (
                <PhoneOff className="h-4 w-4" />
              ) : (
                <Phone className="h-4 w-4" />
              )}
            </Button>
            
            <Button 
              variant="outline" 
              className={isVideoOff ? "bg-red-100 text-red-500" : ""}
              onClick={toggleVideo}
            >
              {isVideoOff ? (
                <VideoOff className="h-4 w-4" />
              ) : (
                <Video className="h-4 w-4" />
              )}
            </Button>
            
            <Button variant="destructive" onClick={handleEndCall}>
              End Call
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Voice Call Dialog */}
      <Dialog open={isVoiceCallActive} onOpenChange={setIsVoiceCallActive}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Voice Call with {recipient.name}</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center gap-4 py-6">
            <Avatar className="h-24 w-24">
              <img src={recipient.avatar} alt={recipient.name} />
            </Avatar>
            <p className="text-lg font-medium">{recipient.name}</p>
            <p className="text-sm text-muted-foreground">{recipient.role}</p>
            <p className="text-sm text-muted-foreground">Call duration: 00:00</p>
          </div>
          
          <div className="flex justify-center gap-4 py-2">
            <Button 
              variant="outline" 
              className={isMicMuted ? "bg-red-100 text-red-500" : ""}
              onClick={toggleMic}
            >
              {isMicMuted ? (
                <PhoneOff className="h-4 w-4" />
              ) : (
                <Phone className="h-4 w-4" />
              )}
            </Button>
            
            <Button variant="destructive" onClick={handleEndCall}>
              End Call
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
