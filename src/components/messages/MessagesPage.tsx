
import React, { useState, useRef, useCallback } from 'react';
import { Search, Plus, MessageCircle, Send, MoreVertical, Paperclip, ChevronLeft, Share2, File, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import AnimatedButton from '@/components/ui/AnimatedButton';
import FileAttachment from './FileAttachment';
import { CallActions } from './CallActions';

// Mock data for conversations
const conversations = [
  {
    id: '1',
    recipient: {
      id: 'doc1',
      name: 'Dr. Arjun Sharma',
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
      name: 'Dr. Priya Patel',
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

// Updated message history with more file examples
const messageHistory = [
  {
    id: 'm1',
    text: 'Hello Dr. Sharma, I\'ve been experiencing some chest discomfort lately.',
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
  },
  {
    id: 'm6',
    text: 'I\'ve also attached my recent blood work results for your review.',
    time: '10:50 AM',
    sender: 'user',
    status: 'delivered',
    attachment: {
      name: 'blood_work_results.pdf',
      size: '1.8 MB',
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
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSelectConversation = (id: string) => {
    setSelectedConversation(id);
    // In a real app, mark messages as read here
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() || attachments.length > 0) {
      // In a real app, send message and attachments to the API
      console.log('Sending message:', newMessage);
      console.log('Attachments:', attachments);
      
      // Simulate message sending
      if (attachments.length > 0) {
        toast({
          title: "Message with files sent",
          description: "Your message has been delivered successfully."
        });
      } else {
        toast({
          title: "Message sent",
          description: "Your message has been delivered successfully."
        });
      }
      
      setNewMessage('');
      setAttachments([]);
      scrollToBottom();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      processFiles(newFiles);
    }
  };

  const processFiles = (files: File[]) => {
    // Check if any file is too large (>10MB)
    const tooLargeFiles = files.filter(file => file.size > 10 * 1024 * 1024);
    
    if (tooLargeFiles.length > 0) {
      toast({
        title: "File too large",
        description: "Files must be less than 10MB in size.",
        variant: "destructive"
      });
    }
    
    // Filter out too large files
    const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024);
    
    // Set initial progress for each file
    const newProgress = { ...uploadProgress };
    validFiles.forEach(file => {
      newProgress[file.name] = 0;
    });
    setUploadProgress(newProgress);
    
    // Simulate upload progress
    validFiles.forEach(file => {
      simulateFileUpload(file);
    });
    
    setAttachments(prev => [...prev, ...validFiles]);
  };

  const simulateFileUpload = (file: File) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 100) {
        progress = 100;
        clearInterval(interval);
      }
      
      setUploadProgress(prev => ({
        ...prev,
        [file.name]: progress
      }));
    }, 200);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => {
      const newAttachments = [...prev];
      const removedFile = newAttachments.splice(index, 1)[0];
      
      // Remove from progress tracking
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[removedFile.name];
        return newProgress;
      });
      
      return newAttachments;
    });
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

  const handleShareFile = (fileName: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Shared medical document',
        text: `Medical document: ${fileName}`,
        url: window.location.href,
      })
      .then(() => {
        toast({
          title: "File shared successfully",
        });
      })
      .catch((error) => {
        console.error("Error sharing:", error);
        // Fallback for error in sharing
        navigator.clipboard.writeText(`${window.location.origin}/shared-file/${fileName}`);
        toast({
          title: "Link copied to clipboard",
          description: "You can now paste and share it"
        });
      });
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(`${window.location.origin}/shared-file/${fileName}`);
      toast({
        title: "Link copied to clipboard",
        description: "You can now paste and share it"
      });
    }
  };

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      processFiles(droppedFiles);
    }
  }, []);

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
        <div 
          className={`w-full md:w-2/3 flex flex-col bg-background ${selectedConversation ? 'block' : 'hidden md:block'}`}
          ref={dropZoneRef}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {selectedConversation && currentConversation ? (
            <>
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
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
                  
                  {/* Add Call Actions */}
                  <div className="flex items-center gap-2">
                    <CallActions recipient={currentConversation.recipient} />
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4 relative">
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
                          <div className="mt-2">
                            <FileAttachment 
                              file={message.attachment}
                              onDownload={() => handleDownloadFile(message.attachment.name)}
                              onShare={() => handleShareFile(message.attachment.name)}
                              className={`${message.sender === 'user' ? 'bg-primary/80' : 'bg-background/50 dark:bg-background/10'}`}
                            />
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
                  <div ref={messagesEndRef} />
                </div>
                
                {/* File drop overlay */}
                {isDragging && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-md border-2 border-dashed border-primary">
                    <div className="text-center p-4">
                      <File className="h-12 w-12 text-primary mx-auto mb-2" />
                      <h3 className="text-lg font-medium">Drop files here</h3>
                      <p className="text-muted-foreground">Upload documents to share with {currentConversation.recipient.name}</p>
                    </div>
                  </div>
                )}
              </ScrollArea>

              {attachments.length > 0 && (
                <div className="px-4 py-2 border-t">
                  <div className="flex flex-wrap gap-2">
                    {attachments.map((file, index) => (
                      <FileAttachment 
                        key={index}
                        file={{
                          name: file.name,
                          size: file.size,
                          type: file.type,
                          data: file
                        }}
                        onRemove={() => handleRemoveAttachment(index)}
                        isPending={uploadProgress[file.name] < 100}
                        progress={uploadProgress[file.name]}
                        showActions={false}
                      />
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
