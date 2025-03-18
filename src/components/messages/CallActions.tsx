
import React, { useState, useEffect } from 'react';
import { Phone, Video, PhoneOff, VideoOff, Mic, MicOff, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

interface CallActionsProps {
  recipient: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  };
}

export function CallActions({ recipient }: CallActionsProps) {
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [isVoiceCallActive, setIsVoiceCallActive] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [networkQuality, setNetworkQuality] = useState(100);
  
  const isMobile = useIsMobile();
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const networkIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  
  // Simulate network quality fluctuations
  useEffect(() => {
    if (connectionStatus === 'connected' && !networkIntervalRef.current) {
      networkIntervalRef.current = setInterval(() => {
        // Random network quality between 70 and 100
        const quality = Math.floor(Math.random() * 30) + 70;
        setNetworkQuality(quality);
      }, 5000);
    }
    
    return () => {
      if (networkIntervalRef.current) {
        clearInterval(networkIntervalRef.current);
        networkIntervalRef.current = null;
      }
    };
  }, [connectionStatus]);
  
  useEffect(() => {
    if ((isVideoCallActive || isVoiceCallActive) && connectionStatus === 'connected' && !timerRef.current) {
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
  }, [isVideoCallActive, isVoiceCallActive, connectionStatus]);
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleStartVideoCall = () => {
    setIsVideoCallActive(true);
    setCallDuration(0);
    setConnectionStatus('connecting');
    
    toast({
      title: "Initiating video call",
      description: `Connecting to ${recipient.name}...`
    });
    
    // Simulate connection delay
    setTimeout(() => {
      setConnectionStatus('connected');
      toast({
        title: "Video call connected",
        description: `You are now on a call with ${recipient.name}`
      });
    }, 2000);
  };
  
  const handleStartVoiceCall = () => {
    setIsVoiceCallActive(true);
    setCallDuration(0);
    setConnectionStatus('connecting');
    
    toast({
      title: "Initiating voice call",
      description: `Calling ${recipient.name}...`
    });
    
    // Simulate connection delay
    setTimeout(() => {
      setConnectionStatus('connected');
      toast({
        title: "Voice call connected",
        description: `You are now on a call with ${recipient.name}`
      });
    }, 2000);
  };
  
  const handleEndCall = () => {
    setConnectionStatus('disconnected');
    
    // Simulate disconnection delay
    setTimeout(() => {
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
    }, 500);
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
  
  // Get network quality color
  const getNetworkQualityColor = () => {
    if (networkQuality >= 90) return "bg-green-500";
    if (networkQuality >= 75) return "bg-yellow-500";
    return "bg-red-500";
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
      
      {/* Video Call Dialog/Drawer */}
      <CallContainer open={isVideoCallActive} onOpenChange={(open) => {
        if (!open) handleEndCall();
        else setIsVideoCallActive(open);
      }}>
        <CallContent className={cn(
          isMobile ? "h-[80vh] px-4 pt-8 pb-8" : "sm:max-w-md"
        )}>
          <CallHeader>
            <CallTitle>Video Call with {recipient.name}</CallTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {connectionStatus === 'connecting' 
                ? 'Connecting...' 
                : `Call duration: ${formatDuration(callDuration)}`}
            </DialogDescription>
            
            {connectionStatus === 'connected' && (
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className={cn("w-2 h-2 rounded-full", getNetworkQualityColor())}></div>
                  <span className="text-xs text-muted-foreground">
                    {networkQuality >= 90 ? 'Excellent connection' : 
                     networkQuality >= 75 ? 'Good connection' : 'Poor connection'}
                  </span>
                </div>
                <Progress value={networkQuality} className="h-1" />
              </div>
            )}
          </CallHeader>
          
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video mb-4 mt-2">
            {connectionStatus === 'connecting' ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="animate-pulse flex flex-col items-center justify-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={recipient.avatar} alt={recipient.name} />
                    <AvatarFallback>{recipient.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <p className="text-white text-lg">Connecting...</p>
                </div>
              </div>
            ) : !isVideoOff ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <video 
                  className="w-full h-full object-cover" 
                  poster={recipient.avatar}
                  autoPlay
                  muted
                  loop
                >
                  <source src="/videos/sample-call.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                {networkQuality < 75 && (
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <p className="text-white text-opacity-80 px-4 py-2 bg-black bg-opacity-50 rounded">
                      Low bandwidth - video quality reduced
                    </p>
                  </div>
                )}
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
              disabled={connectionStatus === 'connecting'}
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
              disabled={connectionStatus === 'connecting'}
            >
              {isVideoOff ? (
                <VideoOff className="h-4 w-4" />
              ) : (
                <Video className="h-4 w-4" />
              )}
            </Button>
            
            <Button 
              variant="destructive" 
              onClick={handleEndCall}
            >
              End Call
            </Button>
          </div>
        </CallContent>
      </CallContainer>
      
      {/* Voice Call Dialog/Drawer */}
      <CallContainer open={isVoiceCallActive} onOpenChange={(open) => {
        if (!open) handleEndCall();
        else setIsVoiceCallActive(open);
      }}>
        <CallContent className={cn(
          isMobile ? "h-[70vh] px-4 pt-8 pb-8" : "sm:max-w-[425px]"
        )}>
          <CallHeader>
            <CallTitle>Voice Call with {recipient.name}</CallTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {connectionStatus === 'connecting' 
                ? 'Connecting...' 
                : `Call duration: ${formatDuration(callDuration)}`}
            </DialogDescription>
            
            {connectionStatus === 'connected' && (
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className={cn("w-2 h-2 rounded-full", getNetworkQualityColor())}></div>
                  <span className="text-xs text-muted-foreground">
                    {networkQuality >= 90 ? 'Excellent connection' : 
                     networkQuality >= 75 ? 'Good connection' : 'Poor connection'}
                  </span>
                </div>
                <Progress value={networkQuality} className="h-1" />
              </div>
            )}
          </CallHeader>
          
          <div className="flex flex-col items-center gap-4 py-6">
            {connectionStatus === 'connecting' ? (
              <div className="animate-pulse flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={recipient.avatar} alt={recipient.name} />
                  <AvatarFallback>{recipient.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="text-lg font-medium">{recipient.name}</p>
                <p className="text-sm text-muted-foreground">Connecting...</p>
              </div>
            ) : (
              <>
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={recipient.avatar} alt={recipient.name} />
                    <AvatarFallback>{recipient.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-green-500 flex items-center justify-center ring-2 ring-background">
                    <User className="h-3 w-3 text-white" />
                  </div>
                </div>
                <p className="text-lg font-medium">{recipient.name}</p>
                <p className="text-sm text-muted-foreground">{recipient.role}</p>
                
                {/* Voice visualization */}
                <div className="flex items-end h-16 gap-1 my-4">
                  {connectionStatus === 'connected' && Array.from({ length: 12 }).map((_, i) => {
                    const height = Math.floor(Math.random() * 40) + 5;
                    return (
                      <div 
                        key={i} 
                        className={cn(
                          "bg-primary w-1.5 rounded-full animate-pulse",
                          isMicMuted && "bg-gray-300"
                        )} 
                        style={{ height: `${height}px` }}
                      ></div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
          
          <div className="flex justify-center gap-4 py-2">
            <Button 
              variant="outline" 
              className={isMicMuted ? "bg-red-100 text-red-500" : ""}
              onClick={toggleMic}
              disabled={connectionStatus === 'connecting'}
            >
              {isMicMuted ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
            
            <Button 
              variant="destructive" 
              onClick={handleEndCall}
            >
              End Call
            </Button>
          </div>
        </CallContent>
      </CallContainer>
    </>
  );
}
