
import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import { Chat, ChatMessage } from './types';

const MessagesPage = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState<Chat[]>([]);
  const { user } = useUser();
  const isMobile = useIsMobile();
  const [contacts, setContacts] = useState<any[]>([]);
  
  // Fetch chats and contacts on component mount
  useEffect(() => {
    fetchChats();
    fetchContacts();
    
    // Subscribe to new messages
    const channel = supabase.channel('chat-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages'
        },
        (payload) => {
          console.log('Real-time message update:', payload);
          handleRealTimeUpdate(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user.id]);

  const handleRealTimeUpdate = (payload: any) => {
    if (payload.eventType === 'INSERT') {
      const newMessage = payload.new;
      // Only update if the message is relevant to the current user
      if (newMessage.sender_id === user.id || newMessage.receiver_id === user.id) {
        updateChatsWithNewMessage(newMessage);
      }
    }
  };

  const updateChatsWithNewMessage = (newMessage: any) => {
    const otherUserId = newMessage.sender_id === user.id ? newMessage.receiver_id : newMessage.sender_id;
    
    setChats(prevChats => {
      const chatIndex = prevChats.findIndex(chat => chat.contactId === otherUserId);
      
      if (chatIndex >= 0) {
        // Update existing chat
        const updatedChats = [...prevChats];
        const chat = { ...updatedChats[chatIndex] };
        
        // Add message to chat
        chat.messages = [...(chat.messages || []), {
          id: newMessage.id,
          text: newMessage.content,
          senderId: newMessage.sender_id,
          timestamp: newMessage.created_at,
          status: 'delivered'
        }];
        
        // Update last message
        chat.lastMessage = {
          text: newMessage.content,
          timestamp: newMessage.created_at,
          senderId: newMessage.sender_id,
          status: 'delivered'
        };
        
        // Update unread count if message is received
        if (newMessage.sender_id !== user.id) {
          chat.unreadCount = (chat.unreadCount || 0) + 1;
        }
        
        updatedChats[chatIndex] = chat;
        return updatedChats;
      }
      
      // If chat doesn't exist, create new chat (this should be rare)
      return prevChats;
    });
  };

  const fetchChats = async () => {
    try {
      const { data: messages, error } = await supabase
        .from('chat_messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform messages into chat objects
      const chatMap = new Map<string, Chat>();
      
      for (const message of messages) {
        const otherUserId = message.sender_id === user.id ? message.receiver_id : message.sender_id;
        
        if (!chatMap.has(otherUserId)) {
          // Fetch user details for the other participant
          const { data: userData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', otherUserId)
            .single();
          
          chatMap.set(otherUserId, {
            id: otherUserId,
            contactId: otherUserId,
            contactName: userData?.name || 'Unknown User',
            contactAvatar: userData?.avatar,
            messages: [],
            unreadCount: 0,
            isOnline: false // You could implement presence here
          });
        }
        
        const chat = chatMap.get(otherUserId)!;
        chat.messages = [...(chat.messages || []), {
          id: message.id,
          text: message.content,
          senderId: message.sender_id,
          timestamp: message.created_at,
          status: message.read_at ? 'read' : 'delivered'
        }];
        
        // Set last message
        chat.lastMessage = {
          text: message.content,
          timestamp: message.created_at,
          senderId: message.sender_id,
          status: message.read_at ? 'read' : 'delivered'
        };
        
        // Update unread count
        if (message.sender_id !== user.id && !message.read_at) {
          chat.unreadCount++;
        }
      }
      
      setChats(Array.from(chatMap.values()));
      
    } catch (error) {
      console.error('Error fetching chats:', error);
      toast({
        title: "Error loading chats",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id);

      if (error) throw error;
      
      setContacts(data.map(profile => ({
        id: profile.id,
        name: profile.name || 'Unknown User',
        avatar: profile.avatar,
        role: profile.role
      })));
      
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast({
        title: "Error loading contacts",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };
  
  const handleSelectChat = async (chatId: string) => {
    setSelectedChat(chatId);
    
    // Mark messages as read
    const chat = chats.find(c => c.id === chatId);
    if (chat && chat.unreadCount > 0) {
      try {
        const { error } = await supabase
          .from('chat_messages')
          .update({ read_at: new Date().toISOString() })
          .eq('receiver_id', user.id)
          .eq('sender_id', chatId)
          .is('read_at', null);

        if (error) throw error;
        
        // Update local state
        setChats(prev => 
          prev.map(chat => 
            chat.id === chatId 
              ? { ...chat, unreadCount: 0 } 
              : chat
          )
        );
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    }
  };

  const handleSendMessage = async (text: string, attachments: File[] = []) => {
    if (!selectedChat || (!text.trim() && attachments.length === 0)) return;
    
    try {
      // Insert message into database
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          content: text,
          sender_id: user.id,
          receiver_id: selectedChat
        })
        .select()
        .single();

      if (error) throw error;
      
      // Message will be added to UI through real-time subscription
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error sending message",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const createNewChat = async (contactId: string, contactName: string) => {
    const existingChat = chats.find(chat => chat.contactId === contactId);
    if (existingChat) {
      setSelectedChat(existingChat.id);
      return;
    }
    
    const newChat: Chat = {
      id: contactId,
      contactId,
      contactName,
      messages: [],
      unreadCount: 0,
      isOnline: false
    };
    
    setChats(prev => [newChat, ...prev]);
    setSelectedChat(contactId);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground">Connect with your healthcare team</p>
      </div>

      <div className="flex-1 flex rounded-lg overflow-hidden border bg-background shadow">
        <ChatList
          chats={chats}
          contacts={contacts}
          selectedChatId={selectedChat}
          onSelectChat={handleSelectChat}
          onNewChat={createNewChat}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          className={selectedChat && isMobile ? 'hidden' : 'w-full md:w-1/3'}
        />
        
        <ChatWindow
          selectedChatId={selectedChat}
          chats={chats}
          onBack={() => setSelectedChat(null)}
          onSendMessage={handleSendMessage}
          className={!selectedChat && isMobile ? 'hidden' : 'w-full md:w-2/3'}
          currentUserId={user.id}
        />
      </div>
    </div>
  );
};

export default MessagesPage;
