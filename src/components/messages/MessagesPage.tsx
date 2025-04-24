
import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import { mockContacts, mockChats } from './mockData';
import { Chat } from './types';

const MessagesPage = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const { user } = useUser();
  const isMobile = useIsMobile();
  
  const handleSelectChat = (chatId: string) => {
    // Mark chat as read when selected
    setChats(prev => 
      prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, unreadCount: 0 } 
          : chat
      )
    );
    setSelectedChat(chatId);
  };

  const handleSendMessage = (text: string, attachments: File[] = []) => {
    if (!selectedChat || (!text.trim() && attachments.length === 0)) return;
    
    // Get current chat
    const currentChat = chats.find(chat => chat.id === selectedChat);
    if (!currentChat) return;
    
    // Create new message
    const newMessage = {
      id: `msg-${Date.now()}`,
      text,
      senderId: user.id,
      timestamp: new Date().toISOString(),
      status: 'sent',
      attachments: attachments.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      }))
    };
    
    // Update chat with new message
    setChats(prev => 
      prev.map(chat => 
        chat.id === selectedChat 
          ? { 
              ...chat, 
              messages: [...(chat.messages || []), newMessage],
              lastMessage: {
                text,
                timestamp: new Date().toISOString(),
                senderId: user.id
              }
            } 
          : chat
      )
    );
    
    // Simulate receiving a message after a delay (for demo)
    if (Math.random() > 0.3) {
      setTimeout(() => {
        const responseMessage = {
          id: `msg-${Date.now()}`,
          text: `This is a response to: "${text}"`,
          senderId: currentChat.contactId,
          timestamp: new Date().toISOString(),
          status: 'delivered'
        };
        
        setChats(prev => 
          prev.map(chat => 
            chat.id === selectedChat 
              ? { 
                  ...chat, 
                  messages: [...(chat.messages || []), responseMessage],
                  lastMessage: {
                    text: responseMessage.text,
                    timestamp: responseMessage.timestamp,
                    senderId: responseMessage.senderId
                  }
                } 
              : chat
          )
        );
        
        // If chat is not currently selected, increment unread count
        if (selectedChat !== currentChat.id) {
          setChats(prev => 
            prev.map(chat => 
              chat.id === currentChat.id 
                ? { ...chat, unreadCount: (chat.unreadCount || 0) + 1 } 
                : chat
            )
          );
          
          // Show notification for new message
          toast({
            title: "New message",
            description: `${currentChat.contactName}: ${responseMessage.text.substring(0, 30)}${responseMessage.text.length > 30 ? '...' : ''}`
          });
        }
      }, 1000 + Math.random() * 2000);
    }
  };

  const createNewChat = (contactId: string, contactName: string) => {
    const newChatId = `chat-${Date.now()}`;
    const newChat = {
      id: newChatId,
      contactId,
      contactName,
      contactAvatar: `/avatars/${contactId}.jpg`,
      lastMessage: {
        text: "New conversation started",
        timestamp: new Date().toISOString(),
        senderId: user.id
      },
      messages: [],
      unreadCount: 0,
      isOnline: Math.random() > 0.5
    };
    
    setChats(prev => [newChat, ...prev]);
    setSelectedChat(newChatId);
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
          contacts={mockContacts}
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
