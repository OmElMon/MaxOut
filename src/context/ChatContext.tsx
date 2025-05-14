import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ChatMessage } from '../types';

interface ChatContextType {
  messages: ChatMessage[];
  sendMessage: (text: string) => void;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Initial welcome messages from the AI trainer
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

// Simple responses based on keywords
const botResponses: Record<string, string[]> = {
  workout: [
    'Looking to get in a workout today? Great! Have you checked out our workout plans?',
    'Remember to warm up before your workout and cool down after!',
    'Consistency is key to seeing results. Even a 15-minute workout is better than nothing!'
  ],
  calories: [
    'Tracking calories is a great way to stay accountable. Have you logged your meals today?',
    'Remember that quality matters just as much as quantity when it comes to calories.',
    'Try to balance your macros - protein, carbs, and healthy fats are all important!'
  ],
  weight: [
    'Weight fluctuations are normal! Focus on the trend over weeks, not daily changes.',
    'Remember that muscle weighs more than fat, so the scale isn\'t always the best indicator of progress.',
    'Consistent habits lead to lasting weight changes. You\'ve got this!'
  ],
  motivation: [
    'Remember why you started! Your future self will thank you for the effort you put in today.',
    '\"The only bad workout is the one that didn\'t happen.\" - Anonymous',
    'Progress takes time. Be patient with yourself and celebrate small victories!'
  ]
};

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const sendMessage = (text: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Generate bot response with slight delay to feel more natural
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: generateBotResponse(text),
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const clearChat = () => {
    setMessages(initialMessages);
  };

  // Simple response generation based on keywords
  const generateBotResponse = (userMessage: string): string => {
    const lowerCase = userMessage.toLowerCase();
    
    // Check for keywords in the message
    for (const [keyword, responses] of Object.entries(botResponses)) {
      if (lowerCase.includes(keyword)) {
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
    
    // Default responses if no keywords match
    const defaultResponses = [
      'That\'s interesting! How can I help you with your fitness goals today?',
      'Great! Remember to stay hydrated and get enough rest between workouts.',
      'I\'m here to support your fitness journey. What specific area would you like help with?',
      'Keep pushing yourself! Every day is a chance to get better.'
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  return (
    <ChatContext.Provider value={{ 
      messages, 
      sendMessage, 
      clearChat 
    }}>
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