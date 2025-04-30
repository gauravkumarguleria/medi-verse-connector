
import React, { useState, useRef, useEffect } from 'react';
import ConversationList from './ConversationList';
import MessageContent from './MessageContent';
import { conversations as mockConversations } from './mockData';
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
  const { user } = useUser();

  // Fetch conversations and messages when component mounts
  useEffect(() => {
    fetchConversations();
  }, [user.id]);

  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  // Set up realtime messaging
  useEffect(() => {
    if (!selectedConversation) return;

    // Enable realtime for messages table
    const enableRealtime = async () => {
      try {
        await supabase.rpc('enable_realtime_for_table', { table_name: 'chat_messages' });
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
          table: 'chat_messages',
          filter: `conversation_id=eq.${selectedConversation}` 
        }, 
        (payload) => {
          console.log('New message received:', payload);
          
          if (payload.new.sender_id !== user.id) {
            // Only add messages from other users, not our own (we add those when we send them)
            const newMessage = mapDatabaseMessageToUIMessage(payload.new);
            setMessageHistory(prev => [...prev, newMessage]);
            
            // Scroll to bottom on new message
            setTimeout(() => {
              messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
            
            // Show notification if the message is from the other person
            const conversation = conversations.find(c => c.id === selectedConversation);
            if (conversation) {
              toast({
                title: "New message",
                description: `${conversation.recipient.name}: ${newMessage.text.substring(0, 30)}${newMessage.text.length > 30 ? '...' : ''}`
              });
            }
          }
        }
      )
      .subscribe();
    
    // Cleanup subscription on unmount or when conversation changes
    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConversation, user.id, conversations]);

  const fetchConversations = async () => {
    try {
      // Get all profiles except the current user
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id);

      if (error) throw error;

      // Create conversation objects from profiles
      const mappedConversations: Conversation[] = profiles.map(profile => {
        return {
          id: profile.id, // Use the profile ID as the conversation ID
          recipient: {
            id: profile.id,
            name: profile.name || 'Unknown User',
            avatar: profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.email}`,
            // Fix: Cast status to "online" | "offline" instead of using a string
            status: "online", // Default to online for now
            role: profile.role || 'user'
          },
          lastMessage: {
            text: 'Click to start a conversation',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isRead: true,
            // Fix: Cast sender to "user" | "recipient" instead of using a string
            sender: "user"
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

  const fetchMessages = async (conversationId: string) => {
    try {
      // Get messages between current user and selected user (in both directions)
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(`sender_id.eq.${conversationId},receiver_id.eq.${conversationId}`)
        .order('created_at');

      if (error) throw error;

      // Map to our Message type
      const messages = data.map(mapDatabaseMessageToUIMessage);
      setMessageHistory(messages);

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

  // Helper to map database message to UI message
  const mapDatabaseMessageToUIMessage = (dbMessage: any): Message => {
    return {
      id: dbMessage.id,
      sender: dbMessage.sender_id === user.id ? 'user' : 'recipient',
      text: dbMessage.content,
      time: new Date(dbMessage.created_at).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: dbMessage.read_at ? 'read' : 'delivered',
      attachment: dbMessage.attachment_url ? {
        name: 'attachment',
        size: 0,
        type: 'application/octet-stream',
        url: dbMessage.attachment_url
      } : undefined
    };
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
        id: `temp-${Date.now()}`,
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

      // Actually send the message to the database
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          sender_id: user.id,
          receiver_id: selectedConversation,
          content: text,
          // We'll handle attachments later
        })
        .select();

      if (error) throw error;

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
              // Fix: Use "user" as a literal type instead of a string
              sender: "user" as "user" | "recipient"
            }
          };
        }
        return conv;
      });

      setConversations(updatedConversations);
    } catch (error) {
      console.error('Error sending message:', error);
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
        <p className="text-muted-foreground">Communicate with your healthcare providers</p>
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
