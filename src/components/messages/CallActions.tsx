
import React from 'react';
import { Phone, Video, PhoneOff, VideoOff, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

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
  const [callDuration, setCallDuration] = React.useState(0);
  const isMobile = useIsMobile();
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  
  React.useEffect(() => {
    if ((isVideoCallActive || isVoiceCallActive) && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isVideoCallActive, isVoiceCallActive]);
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleStartVideoCall = () => {
    setIsVideoCallActive(true);
    setCallDuration(0);
    toast({
      title: "Video call started",
      description: `Connecting to ${recipient.name}...`
    });
  };
  
  const handleStartVoiceCall = () => {
    setIsVoiceCallActive(true);
    setCallDuration(0);
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
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setCallDuration(0);
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
  
  // Choose the appropriate UI component based on device
  const CallContainer = isMobile ? Drawer : Dialog;
  const CallContent = isMobile ? DrawerContent : DialogContent;
  const CallHeader = isMobile ? DrawerHeader : DialogHeader;
  const CallTitle = isMobile ? DrawerTitle : DialogTitle;
  
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
      
      {/* Video Call Dialog/Drawer */}
      <CallContainer open={isVideoCallActive} onOpenChange={setIsVideoCallActive}>
        <CallContent className={cn(
          isMobile ? "h-[80vh] px-4 pt-8 pb-8" : "sm:max-w-md"
        )}>
          <CallHeader>
            <CallTitle>Video Call with {recipient.name}</CallTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Call duration: {formatDuration(callDuration)}
            </DialogDescription>
          </CallHeader>
          
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video mb-4 mt-2">
            {!isVideoOff ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-white">Camera preview would show here</p>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={recipient.avatar} alt={recipient.name} />
                  <AvatarFallback>{recipient.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
            )}
            
            <div className="absolute bottom-4 right-4 bg-gray-800 rounded-lg p-2">
              <Avatar className="h-16 w-16">
                <AvatarImage src="https://i.pravatar.cc/150?img=12" alt="You" />
                <AvatarFallback>You</AvatarFallback>
              </Avatar>
            </div>
          </div>
          
          <div className="flex justify-center gap-4 py-2 mt-2">
            <Button 
              variant="outline" 
              className={isMicMuted ? "bg-red-100 text-red-500" : ""}
              onClick={toggleMic}
            >
              {isMicMuted ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
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
        </CallContent>
      </CallContainer>
      
      {/* Voice Call Dialog/Drawer */}
      <CallContainer open={isVoiceCallActive} onOpenChange={setIsVoiceCallActive}>
        <CallContent className={cn(
          isMobile ? "h-[70vh] px-4 pt-8 pb-8" : "sm:max-w-[425px]"
        )}>
          <CallHeader>
            <CallTitle>Voice Call with {recipient.name}</CallTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Call duration: {formatDuration(callDuration)}
            </DialogDescription>
          </CallHeader>
          
          <div className="flex flex-col items-center gap-4 py-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={recipient.avatar} alt={recipient.name} />
              <AvatarFallback>{recipient.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <p className="text-lg font-medium">{recipient.name}</p>
            <p className="text-sm text-muted-foreground">{recipient.role}</p>
          </div>
          
          <div className="flex justify-center gap-4 py-2">
            <Button 
              variant="outline" 
              className={isMicMuted ? "bg-red-100 text-red-500" : ""}
              onClick={toggleMic}
            >
              {isMicMuted ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
            
            <Button variant="destructive" onClick={handleEndCall}>
              End Call
            </Button>
          </div>
        </CallContent>
      </CallContainer>
    </>
  );
}
