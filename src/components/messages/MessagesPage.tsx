
import React, { useState, useRef, useEffect } from 'react';
import ConversationList from './ConversationList';
import MessageContent from './MessageContent';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { Message, Conversation } from './types';
import { toast } from '@/hooks/use-toast';

const MessagesPage = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [messageHistory, setMessageHistory] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, getAllUsers } = useUser();

  // Fetch conversations when component mounts
  useEffect(() => {
    fetchLocalConversations();
  }, [user.id]);

  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      fetchLocalMessages(selectedConversation);
    }
  }, [selectedConversation]);

  // Set up real-time messaging
  useEffect(() => {
    if (!selectedConversation) return;
    
    console.log('Setting up real-time messaging for conversation:', selectedConversation);
    
    // Subscribe to real-time updates for messages
    const channelId = `messages_${user.id}_${selectedConversation}`;
    const channel = supabase
      .channel(channelId)
      .on('broadcast', { event: 'new-message' }, (payload) => {
        console.log('New message received via broadcast:', payload);
        
        if (payload.payload.sender_id !== user.id) {
          // Add the message to our history
          const newMessage: Message = {
            id: `${Date.now()}`,
            sender: 'recipient',
            text: payload.payload.content,
            time: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            status: 'delivered'
          };
          
          setMessageHistory(prev => [...prev, newMessage]);
          
          // Scroll to bottom on new message
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
          
          // Show notification
          const conversation = conversations.find(c => c.id === selectedConversation);
          if (conversation) {
            toast({
              title: "New message",
              description: `${conversation.recipient.name}: ${newMessage.text.substring(0, 30)}${newMessage.text.length > 30 ? '...' : ''}`
            });
          }
        }
      })
      .subscribe();
    
    // Cleanup subscription on unmount or when conversation changes
    return () => {
      console.log('Unsubscribing from channel:', channelId);
      supabase.removeChannel(channel);
    };
  }, [selectedConversation, user.id, conversations]);

  const fetchLocalConversations = async () => {
    try {
      // Get all users except the current user
      const allUsers = getAllUsers().filter(profile => profile.id !== user.id);
      
      // Create conversation objects from profiles
      const mappedConversations: Conversation[] = allUsers.map(profile => {
        return {
          id: profile.id,
          recipient: {
            id: profile.id,
            name: profile.name || 'Unknown User',
            avatar: profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.email}`,
            status: "online", // Default to online for now
            role: profile.role || 'user'
          },
          lastMessage: {
            text: 'Click to start a conversation',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isRead: true,
            sender: "user" // Fixed: Using the correct literal type instead of string
          },
          unread: 0
        };
      });

      setConversations(mappedConversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive"
      });
    }
  };

  const fetchLocalMessages = async (conversationId: string) => {
    try {
      // In a local implementation, we'll start with an empty message history
      // This would be replaced with actual message history in a real implementation
      setMessageHistory([]);
      
      // Scroll to bottom of messages
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    }
  };

  const handleSelectConversation = (id: string) => {
    setSelectedConversation(id);
  };

  // Function to handle sending a new message
  const handleSendMessage = async (text: string, attachments: File[]) => {
    if (!selectedConversation || (!text.trim() && attachments.length === 0)) return;

    try {
      // Add the message to our local state immediately for fast UI feedback
      const tempMessage: Message = {
        id: `${Date.now()}`,
        sender: 'user',
        text,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'sending'
      };

      setMessageHistory(prev => [...prev, tempMessage]);
      
      // Scroll to the new message
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

      // Update the message status to delivered
      setTimeout(() => {
        setMessageHistory(prev => 
          prev.map(msg => 
            msg.id === tempMessage.id 
              ? { ...msg, status: 'delivered' } 
              : msg
          )
        );
      }, 500);

      // In a real-time setup, broadcast the message to the recipient
      const channelId = `messages_${selectedConversation}_${user.id}`;
      await supabase.channel(channelId).send({
        type: 'broadcast',
        event: 'new-message',
        payload: {
          sender_id: user.id,
          receiver_id: selectedConversation,
          content: text,
          sender_name: user.name,
          timestamp: new Date().toISOString(),
        }
      });

      // Update the conversation's last message
      const updatedConversations = conversations.map(conv => {
        if (conv.id === selectedConversation) {
          return {
            ...conv,
            lastMessage: {
              text,
              time: new Date().toLocaleTimeString([], {
                hour: '2-digit', 
                minute: '2-digit'
              }),
              isRead: false,
              sender: "user"
            }
          };
        }
        return conv;
      });

      setConversations(updatedConversations);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Update the message status to error
      setMessageHistory(prev => 
        prev.map(msg => 
          msg.id === `${Date.now()}` 
            ? { ...msg, status: 'error' } 
            : msg
        )
      );
      
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const currentConversation = conversations.find(conv => conv.id === selectedConversation);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Messages</h1>
        <p className="text-muted-foreground">Communicate with your healthcare providers in real-time</p>
      </div>

      <div className="flex h-full rounded-lg border overflow-hidden">
        {/* Conversation List */}
        <div className={`${selectedConversation ? 'hidden md:block' : 'block'} w-full md:w-1/3`}>
          <ConversationList 
            conversations={conversations}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedConversation={selectedConversation}
            onSelectConversation={handleSelectConversation}
          />
        </div>

        {/* Message Content */}
        <div className={`${selectedConversation ? 'block' : 'hidden md:block'} w-full md:w-2/3`}>
          <MessageContent 
            selectedConversation={selectedConversation}
            currentConversation={currentConversation}
            messageHistory={messageHistory}
            onBack={() => setSelectedConversation(null)}
            onSendMessage={handleSendMessage}
            messagesEndRef={messagesEndRef}
          />
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
