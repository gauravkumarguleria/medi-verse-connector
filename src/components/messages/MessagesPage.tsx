import React, { useState, useRef, useEffect } from 'react';
import ConversationList from './ConversationList';
import MessageContent from './MessageContent';
import { conversations, messageHistory as initialMessageHistory } from './mockData';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { Message } from './types';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const MessagesPage = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [messageHistory, setMessageHistory] = useState<Message[]>(initialMessageHistory);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const isMobile = useIsMobile();

  const handleSelectConversation = (id: string) => {
    setSelectedConversation(id);
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // Set up realtime messaging
  useEffect(() => {
    if (!selectedConversation) return;

    // Enable realtime for messages table
    const enableRealtime = async () => {
      try {
        await supabase.rpc('enable_realtime_for_table', { table_name: 'messages' });
        console.log('Realtime enabled for messages table');
      } catch (error) {
        console.error('Error enabling realtime:', error);
      }
    };

    enableRealtime();

    // Subscribe to real-time updates for messages
    const channel = supabase
      .channel('messages_updates')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `conversation_id=eq.${selectedConversation}` 
        }, 
        (payload) => {
          console.log('New message received:', payload);
          // Add the new message to our state
          const newMessage = payload.new as any;
          
          // Convert the message to our Message type
          const message: Message = {
            id: newMessage.id,
            sender: newMessage.sender_id === user.id ? 'user' : 'recipient',
            text: newMessage.content,
            time: new Date(newMessage.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            status: 'delivered',
            attachment: newMessage.attachment_url ? {
              name: newMessage.attachment_name || 'file',
              size: 0, // We don't have this info from the database
              type: newMessage.attachment_type || 'application/octet-stream',
              url: newMessage.attachment_url
            } : undefined
          };
          
          setMessageHistory(prev => [...prev, message]);
          
          // Scroll to bottom on new message
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
          
          // Show notification if the message is from the other person
          if (message.sender !== 'user') {
            toast({
              title: "New message",
              description: `${currentConversation?.recipient.name}: ${message.text.substring(0, 30)}${message.text.length > 30 ? '...' : ''}`
            });
          }
        }
      )
      .subscribe();
    
    // Cleanup subscription on unmount or when conversation changes
    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConversation, user.id]);

  const currentConversation = conversations.find(conv => conv.id === selectedConversation);

  // Function to handle sending a new message
  const handleSendMessage = async (text: string, attachments: File[]) => {
    if (!selectedConversation || (!text.trim() && attachments.length === 0)) return;

    try {
      // In a real app, save message to the database
      // For now, we'll just update our local state
      const newMessage: Message = {
        id: `temp-${Date.now()}`,
        sender: 'user',
        text,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'sending'
      };

      setMessageHistory(prev => [...prev, newMessage]);

      // Simulate the recipient typing and responding after a delay
      if (Math.random() > 0.3) { // 70% chance of getting a response
        setTimeout(() => {
          const responseMessage: Message = {
            id: `temp-${Date.now() + 1}`,
            sender: 'recipient',
            text: `This is an automated response to: "${text}"`,
            time: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            status: 'delivered'
          };
          
          setMessageHistory(prev => [...prev, responseMessage]);
          
          // Scroll to bottom on new message
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }, 1500 + Math.random() * 2000); // Random delay between 1.5-3.5 seconds
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Messages</h1>
        <p className="text-muted-foreground">Communicate with your healthcare providers</p>
      </div>

      <div className="flex h-full rounded-lg border overflow-hidden bg-background">
        <ConversationList 
          conversations={conversations}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedConversation={selectedConversation}
          onSelectConversation={handleSelectConversation}
          className={selectedConversation && isMobile ? 'hidden' : 'block w-full md:w-1/3'}
        />

        <MessageContent 
          selectedConversation={selectedConversation}
          currentConversation={currentConversation}
          messageHistory={messageHistory}
          onBack={() => setSelectedConversation(null)}
          onSendMessage={handleSendMessage}
          messagesEndRef={messagesEndRef}
          className={!selectedConversation && isMobile ? 'hidden' : 'block w-full md:w-2/3'}
        />
      </div>
    </div>
  );
};

export default MessagesPage;
