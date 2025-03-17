
import React, { useState } from 'react';
import { Search, Plus, MessageCircle, Send, MoreVertical, Paperclip, ChevronLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import GlassCard from '@/components/ui/GlassCard';

// Mock data for conversations
const conversations = [
  {
    id: '1',
    recipient: {
      id: 'doc1',
      name: 'Dr. Sarah Williams',
      avatar: 'https://i.pravatar.cc/150?img=32',
      status: 'online',
      role: 'Cardiologist'
    },
    lastMessage: {
      text: 'Your test results look good. I would recommend...',
      time: '10:42 AM',
      isRead: true,
      sender: 'recipient'
    },
    unread: 0
  },
  {
    id: '2',
    recipient: {
      id: 'doc2',
      name: 'Dr. Michael Chen',
      avatar: 'https://i.pravatar.cc/150?img=56',
      status: 'offline',
      role: 'Dermatologist'
    },
    lastMessage: {
      text: 'Please let me know if the new medication has improved your skin condition.',
      time: 'Yesterday',
      isRead: false,
      sender: 'recipient'
    },
    unread: 1
  },
  {
    id: '3',
    recipient: {
      id: 'phar1',
      name: 'MediVerse Pharmacy',
      avatar: 'https://i.pravatar.cc/150?img=68',
      status: 'online',
      role: 'Pharmacy'
    },
    lastMessage: {
      text: 'Your prescription refill is ready for pickup.',
      time: 'Yesterday',
      isRead: false,
      sender: 'recipient'
    },
    unread: 1
  },
  {
    id: '4',
    recipient: {
      id: 'support1',
      name: 'Support Team',
      avatar: 'https://i.pravatar.cc/150?img=23',
      status: 'online',
      role: 'Customer Support'
    },
    lastMessage: {
      text: 'How can we help you today?',
      time: 'May 10',
      isRead: true,
      sender: 'recipient'
    },
    unread: 0
  }
];

// Mock message history for a conversation
const messageHistory = [
  {
    id: 'm1',
    text: 'Hello Dr. Williams, I\'ve been experiencing some chest discomfort lately.',
    time: '10:30 AM',
    sender: 'user',
    status: 'delivered'
  },
  {
    id: 'm2',
    text: 'I\'m sorry to hear that. Can you describe the discomfort in more detail? When does it occur?',
    time: '10:35 AM',
    sender: 'recipient',
    status: 'delivered'
  },
  {
    id: 'm3',
    text: 'It happens mostly when I exert myself, like climbing stairs. It\'s a tight feeling in my chest that lasts for a few minutes.',
    time: '10:38 AM',
    sender: 'user',
    status: 'delivered'
  },
  {
    id: 'm4',
    text: 'Your test results look good. I would recommend scheduling an appointment so we can discuss this further and perhaps run some additional tests to be sure.',
    time: '10:42 AM',
    sender: 'recipient',
    status: 'delivered'
  }
];

const MessagesPage = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const handleSelectConversation = (id: string) => {
    setSelectedConversation(id);
    // In a real app, mark messages as read here
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, send message to the API
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage.text.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'unread') return matchesSearch && conversation.unread > 0;
    
    return matchesSearch;
  });

  const currentConversation = conversations.find(conv => conv.id === selectedConversation);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Messages</h1>
        <p className="text-muted-foreground">Communicate with your healthcare providers</p>
      </div>

      <div className="flex h-full rounded-lg border overflow-hidden">
        {/* Conversation List */}
        <div className={`w-full md:w-1/3 bg-card border-r ${selectedConversation ? 'hidden md:block' : 'block'}`}>
          <div className="p-4 border-b">
            <Input 
              placeholder="Search messages..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              prefixIcon={<Search className="h-4 w-4 text-muted-foreground" />}
              className="mb-4"
            />
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <ScrollArea className="h-[calc(100%-5rem)]">
            <div className="p-2">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                      selectedConversation === conversation.id 
                        ? 'bg-primary/10 hover:bg-primary/15' 
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => handleSelectConversation(conversation.id)}
                  >
                    <div className="flex items-center">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <img src={conversation.recipient.avatar} alt={conversation.recipient.name} />
                        </Avatar>
                        <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ${
                          conversation.recipient.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                        } ring-1 ring-background`}></span>
                      </div>
                      <div className="ml-3 flex-1 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium truncate">{conversation.recipient.name}</h4>
                          <span className="text-xs text-muted-foreground">
                            {conversation.lastMessage.time}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.lastMessage.sender === 'user' ? 'You: ' : ''}
                          {conversation.lastMessage.text}
                        </p>
                      </div>
                    </div>
                    {conversation.unread > 0 && (
                      <Badge className="absolute top-3 right-3 h-5 w-5 p-0 flex items-center justify-center">
                        {conversation.unread}
                      </Badge>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No conversations found
                </div>
              )}
              
              <div className="p-2 mt-2">
                <Button className="w-full" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  New Message
                </Button>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Message Content */}
        <div className={`w-full md:w-2/3 flex flex-col bg-background ${selectedConversation ? 'block' : 'hidden md:block'}`}>
          {selectedConversation && currentConversation ? (
            <>
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="md:hidden mr-2"
                    onClick={() => setSelectedConversation(null)}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Avatar className="h-10 w-10">
                    <img src={currentConversation.recipient.avatar} alt={currentConversation.recipient.name} />
                  </Avatar>
                  <div className="ml-3">
                    <h3 className="font-medium">{currentConversation.recipient.name}</h3>
                    <p className="text-xs text-muted-foreground">{currentConversation.recipient.role}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messageHistory.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p>{message.text}</p>
                        <div className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-primary-foreground/80' : 'text-muted-foreground'
                        }`}>
                          {message.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-4 border-t">
                <div className="flex items-end gap-2">
                  <Textarea
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="min-h-[80px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <div className="flex flex-col gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Button size="icon" className="rounded-full" onClick={handleSendMessage}>
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <MessageCircle className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Your Messages</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Select a conversation to view messages or start a new conversation with a healthcare provider.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Start New Conversation
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
