
import React, { useState, useRef, useEffect } from 'react';
import ConversationList from './ConversationList';
import MessageContent from './MessageContent';
import { conversations, messageHistory } from './mockData';

const MessagesPage = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSelectConversation = (id: string) => {
    setSelectedConversation(id);
    // In a real app, mark messages as read here
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
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
        <div className={`${selectedConversation ? 'hidden md:block' : 'block'}`}>
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
        <div className={`${selectedConversation ? 'block' : 'hidden md:block'}`}>
          <MessageContent 
            selectedConversation={selectedConversation}
            currentConversation={currentConversation}
            messageHistory={messageHistory}
            onBack={() => setSelectedConversation(null)}
          />
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
