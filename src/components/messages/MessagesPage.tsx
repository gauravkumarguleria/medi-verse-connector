
import React, { useState, useRef } from 'react';
import { Search, Plus, MessageCircle, Send, MoreVertical, Paperclip, ChevronLeft, Download, File, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedButton from '@/components/ui/AnimatedButton';

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
  },
  {
    id: 'm5',
    text: '',
    time: '10:45 AM',
    sender: 'recipient',
    status: 'delivered',
    attachment: {
      name: 'test_results.pdf',
      size: '2.3 MB',
      type: 'application/pdf',
      url: '#'
    }
  }
];

const MessagesPage = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectConversation = (id: string) => {
    setSelectedConversation(id);
    // In a real app, mark messages as read here
  };

  const handleSendMessage = () => {
    if (newMessage.trim() || attachments.length > 0) {
      // In a real app, send message and attachments to the API
      console.log('Sending message:', newMessage);
      console.log('Attachments:', attachments);
      toast({
        title: attachments.length > 0 ? "Message with files sent" : "Message sent",
        description: "Your message has been delivered successfully."
      });
      setNewMessage('');
      setAttachments([]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      // Check if any file is too large (>10MB)
      const tooLargeFiles = newFiles.filter(file => file.size > 10 * 1024 * 1024);
      
      if (tooLargeFiles.length > 0) {
        toast({
          title: "File too large",
          description: "Files must be less than 10MB in size.",
          variant: "destructive"
        });
        
        // Filter out too large files
        const validFiles = newFiles.filter(file => file.size <= 10 * 1024 * 1024);
        setAttachments(prev => [...prev, ...validFiles]);
      } else {
        setAttachments(prev => [...prev, ...newFiles]);
      }
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDownloadFile = (fileName: string) => {
    // In a real app, this would download the actual file from your backend
    toast({
      title: "Download started",
      description: `Downloading ${fileName}...`
    });
    
    // Simulate a download (in a real app, you would use a proper file URL)
    setTimeout(() => {
      toast({
        title: "Download complete",
        description: `${fileName} has been downloaded.`
      });
    }, 1500);
  };

  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage.text.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'unread') return matchesSearch && conversation.unread > 0;
    
    return matchesSearch;
  });

  const currentConversation = conversations.find(conv => conv.id === selectedConversation);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

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
                        {message.text && <p>{message.text}</p>}
                        {message.attachment && (
                          <div className="mt-2 border rounded-md p-2 bg-background/50 dark:bg-background/10">
                            <div className="flex items-center">
                              <File className="h-5 w-5 mr-2" />
                              <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-medium truncate">{message.attachment.name}</p>
                                <p className="text-xs text-muted-foreground">{message.attachment.size}</p>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => handleDownloadFile(message.attachment.name)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
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

              {attachments.length > 0 && (
                <div className="px-4 py-2 border-t">
                  <div className="flex flex-wrap gap-2">
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center bg-muted rounded-md p-2 pr-1">
                        <File className="h-4 w-4 mr-2" />
                        <span className="text-sm truncate max-w-[150px]">{file.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">({formatFileSize(file.size)})</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 ml-1"
                          onClick={() => handleRemoveAttachment(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileUpload}
                      multiple
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full"
                      onClick={triggerFileInput}
                      title="Attach file"
                    >
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Button 
                      size="icon" 
                      className="rounded-full" 
                      onClick={handleSendMessage}
                      title="Send message"
                    >
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
              <AnimatedButton>
                <Plus className="h-4 w-4 mr-2" />
                Start New Conversation
              </AnimatedButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
