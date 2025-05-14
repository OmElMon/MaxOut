import React, { useState, useRef, useEffect } from 'react';
import { Send, User as UserIcon, Bot, Trash2 } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

/**
 * ChatTrainer component provides an interface for users to interact with an AI fitness trainer.
 * It includes a chat display, message input, and quick suggestion buttons.
 */
const ChatTrainer: React.FC = () => {
  // Access chat context for messages and actions
  const { messages, sendMessage, clearChat } = useChat();
  
  // State for managing the input field value
  const [input, setInput] = useState('');
  
  // Ref for auto-scrolling to the bottom of the chat
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  /**
   * Auto-scroll to bottom whenever messages update
   * This ensures new messages are always visible
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  /**
   * Handles form submission for sending a new message
   * @param {React.FormEvent} e - Form submission event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't send empty messages
    if (input.trim() === '') return;
    
    // Send the message and clear input field
    sendMessage(input);
    setInput('');
  };
  
  return (
    <div className="pt-20 px-4 pb-10">
      <div className="container mx-auto max-w-3xl">
        {/* Page header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              AI Fitness Trainer
            </span>
          </h1>
          <p className="text-blue-300">Chat with your personal fitness assistant</p>
        </div>
        
        {/* Main chat container */}
        <div className="bg-indigo-900/20 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-indigo-500/20 flex flex-col h-[70vh]">
          {/* Chat header with bot info and clear button */}
          <div className="bg-indigo-800/50 p-4 border-b border-indigo-700 flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-green-500/20 p-2 rounded-full mr-3">
                <Bot className="text-green-400" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white">Aki</h3>
                <p className="text-xs text-blue-300">Virtual Fitness Trainer</p>
              </div>
            </div>
            
            {/* Clear chat button */}
            <button 
              onClick={clearChat}
              className="text-blue-300 hover:text-red-400 transition"
              title="Clear conversation"
            >
              <Trash2 size={18} />
            </button>
          </div>
          
          {/* Messages display area */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {/* Map through all messages */}
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* Individual message bubble */}
                <div 
                  className={`max-w-[80%] rounded-xl p-3 ${
                    message.sender === 'user'
                      ? 'bg-indigo-700 text-white rounded-tr-none' // User message style
                      : 'bg-indigo-900/50 border border-indigo-700 text-white rounded-tl-none' // Bot message style
                  }`}
                >
                  {/* Message sender indicator */}
                  <div className="flex items-center mb-1">
                    {message.sender === 'bot' ? (
                      <div className="bg-green-500/20 p-1 rounded-full mr-2">
                        <Bot className="text-green-400" size={14} />
                      </div>
                    ) : (
                      <div className="bg-blue-500/20 p-1 rounded-full mr-2">
                        <UserIcon className="text-blue-400" size={14} />
                      </div>
                    )}
                    <span className="text-xs text-blue-300">
                      {message.sender === 'user' ? 'You' : 'Aki'}
                    </span>
                  </div>
                  {/* Message text content */}
                  <p>{message.text}</p>
                </div>
              </div>
            ))}
            {/* Empty div for auto-scrolling to bottom */}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message input form */}
          <div className="bg-indigo-800/30 p-4 border-t border-indigo-700">
            <form onSubmit={handleSubmit} className="flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about workouts, nutrition, or motivation..."
                className="flex-grow px-4 py-2 bg-indigo-900/50 border border-indigo-700 rounded-l-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              {/* Send button */}
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-r-lg text-white hover:opacity-90 transition"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
        
        {/* Quick suggestion buttons */}
        <div className="mt-6">
          <h3 className="text-white font-semibold mb-3">Try asking about:</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "Best workout for beginners",
              "How to track calories effectively", 
              "Tips for weight loss", 
              "How to stay motivated"
            ].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  setInput(suggestion);
                }}
                className="px-3 py-2 bg-indigo-800/30 hover:bg-indigo-700/50 text-blue-300 rounded-lg text-sm transition"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatTrainer;