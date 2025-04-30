
import React from 'react';
import { Search, Plus, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Conversation } from '@/components/messages/types';

interface ConversationListProps {
  conversations: Conversation[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedConversation: string | null;
  onSelectConversation: (id: string) => void;
}

const ConversationList = ({
  conversations,
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  selectedConversation,
  onSelectConversation,
}: ConversationListProps) => {
  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.recipient.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'unread') return matchesSearch && conversation.unread > 0;
    
    return matchesSearch;
  });

  return (
    <div className="h-full flex flex-col bg-card border-r">
      <div className="p-4 border-b">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search messages..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All Chats</TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              {conversations.filter(c => c.unread > 0).length > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                  {conversations.filter(c => c.unread > 0).length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <ScrollArea className="flex-1">
        {filteredConversations.length > 0 ? (
          <div className="p-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors relative ${
                  selectedConversation === conversation.id 
                    ? 'bg-primary/10 hover:bg-primary/15' 
                    : 'hover:bg-muted'
                }`}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex items-center">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <img 
                        src={conversation.recipient.avatar} 
                        alt={conversation.recipient.name}
                        className="h-full w-full object-cover"
                      />
                    </Avatar>
                    <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ${
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
                    <div className="flex items-center text-xs text-muted-foreground mb-1">
                      <span className="truncate">{conversation.recipient.role}</span>
                    </div>
                    <p className={`text-sm truncate ${conversation.unread > 0 ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
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
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-center p-6">
            <Users className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              {searchQuery ? 'No conversations match your search' : 'No conversations yet'}
            </p>
          </div>
        )}
      </ScrollArea>
      
      <div className="p-3 border-t">
        <Button className="w-full flex items-center gap-2" variant="outline">
          <Plus className="h-4 w-4" />
          New Message
        </Button>
      </div>
    </div>
  );
};

export default ConversationList;
