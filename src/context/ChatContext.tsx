import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ChatMessage } from '../types'; // Only one import

interface ChatContextType {
  messages: ChatMessage[];
  sendMessage: (text: string, autoReply?: boolean) => void;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    sender: 'bot',
    text: 'こんにちは! I\'m Aki, your virtual fitness trainer! 💪',
    timestamp: new Date().toISOString()
  },
  {
    id: '2',
    sender: 'bot',
    text: 'I\'m here to help you with your fitness journey. Ask me anything about workouts, nutrition, or tracking your progress!',
    timestamp: new Date().toISOString()
  }
];

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const sendMessage = (text: string, autoReply: boolean = true) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: autoReply ? 'bot' : 'user',
      text,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, message]);
  };

  const clearChat = () => {
    setMessages(initialMessages);
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, clearChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};