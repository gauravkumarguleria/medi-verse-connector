
import React, { useState } from 'react';
import { Search, Plus, CheckCheck, Check, MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Chat, Contact } from './types';

interface ChatListProps {
  chats: Chat[];
  contacts: Contact[];
  selectedChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: (contactId: string, contactName: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  className?: string;
}

const ChatList = ({
  chats,
  contacts,
  selectedChatId,
  onSelectChat,
  onNewChat,
  searchQuery,
  onSearchChange,
  className
}: ChatListProps) => {
  const [activeTab, setActiveTab] = useState('all');
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  
  // Filter chats based on search query and active tab
  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (chat.lastMessage?.text && chat.lastMessage.text.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'unread') return matchesSearch && (chat.unreadCount > 0);
    
    return matchesSearch;
  });

  return (
    <div className={cn("flex flex-col border-r bg-card", className)}>
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search messages..." 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 bg-background"
          />
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="flex-1">
        {filteredChats.length > 0 ? (
          <div className="p-2">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                className={cn(
                  "p-3 rounded-lg mb-1 cursor-pointer transition-colors flex",
                  selectedChatId === chat.id 
                    ? 'bg-primary/10 hover:bg-primary/15' 
                    : 'hover:bg-accent'
                )}
                onClick={() => onSelectChat(chat.id)}
              >
                <div className="relative mr-3">
                  <Avatar className="h-12 w-12">
                    <Avatar.Image src={chat.contactAvatar} alt={chat.contactName} />
                    <Avatar.Fallback>{chat.contactName.substring(0, 2).toUpperCase()}</Avatar.Fallback>
                  </Avatar>
                  {chat.isOnline && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background"></span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={cn(
                      "font-semibold truncate",
                      chat.unreadCount > 0 ? "text-foreground" : "text-foreground"
                    )}>
                      {chat.contactName}
                    </h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {formatDistanceToNow(new Date(chat.lastMessage?.timestamp || Date.now()), { addSuffix: false })}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center max-w-[85%]">
                      {chat.lastMessage?.senderId === 'user' && (
                        <span className="mr-1 text-xs">
                          {chat.lastMessage?.status === 'read' ? (
                            <CheckCheck className="h-3 w-3 text-primary inline" />
                          ) : (
                            <Check className="h-3 w-3 text-muted-foreground inline" />
                          )}
                        </span>
                      )}
                      <p className={cn(
                        "text-sm truncate", 
                        chat.unreadCount > 0 ? "font-semibold text-foreground" : "text-muted-foreground"
                      )}>
                        {chat.lastMessage?.senderId === 'user' ? 'You: ' : ''}
                        {chat.lastMessage?.text}
                      </p>
                    </div>
                    
                    {chat.unreadCount > 0 && (
                      <Badge className="rounded-full h-5 w-5 p-0 flex items-center justify-center">
                        {chat.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-center p-4">
            <MessageCircle className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No conversations found</p>
          </div>
        )}
      </ScrollArea>

      {/* New Chat Button */}
      <div className="p-3 border-t">
        <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
          <DialogTrigger asChild>
            <Button className="w-full" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              New Message
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start a new conversation</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <Input 
                placeholder="Search contacts..." 
                className="mb-4"
              />
              <ScrollArea className="h-[300px] pr-3">
                <div className="space-y-2">
                  {contacts.map(contact => (
                    <div
                      key={contact.id}
                      className="flex items-center p-2 hover:bg-accent rounded-md cursor-pointer"
                      onClick={() => {
                        onNewChat(contact.id, contact.name);
                        setIsNewChatOpen(false);
                      }}
                    >
                      <Avatar className="h-10 w-10 mr-3">
                        <Avatar.Image src={contact.avatar} alt={contact.name} />
                        <Avatar.Fallback>{contact.name.substring(0, 2).toUpperCase()}</Avatar.Fallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">{contact.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ChatList;
