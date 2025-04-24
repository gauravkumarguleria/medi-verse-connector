
import React from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Conversation } from '@/components/messages/types';
import { cn } from '@/lib/utils';

interface ConversationListProps {
  conversations: Conversation[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedConversation: string | null;
  onSelectConversation: (id: string) => void;
  className?: string;
}

const ConversationList = ({
  conversations,
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  selectedConversation,
  onSelectConversation,
  className
}: ConversationListProps) => {
  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage.text.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'unread') return matchesSearch && conversation.unread > 0;
    
    return matchesSearch;
  });

  return (
    <div className={cn("bg-card border-r", className)}>
      <div className="p-4 border-b">
        <Input 
          placeholder="Search messages..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4"
          prefixIcon={<Search className="h-4 w-4 text-muted-foreground" />}
        />
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <ScrollArea className="h-[calc(100vh-16rem)]">
        <div className="p-2">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={cn(
                  "p-3 rounded-lg mb-2 cursor-pointer transition-colors relative",
                  selectedConversation === conversation.id 
                    ? 'bg-primary/10 hover:bg-primary/15' 
                    : 'hover:bg-muted'
                )}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex items-center">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <img src={conversation.recipient.avatar} alt={conversation.recipient.name} />
                    </Avatar>
                    <span className={cn(
                      "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-1 ring-background",
                      conversation.recipient.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                    )}></span>
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
  );
};

export default ConversationList;
