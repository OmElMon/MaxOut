import React, { useState, useRef, useEffect } from 'react';
import { User as UserIcon, Bot, Trash2 } from 'lucide-react'; // Removed unused 'Send'
import { useChat } from '../../context/ChatContext';
import MaxOutAI, { UserProfile, UserMetrics } from './MaxOutAI';

const maxOutAI = new MaxOutAI();

const ChatTrainer: React.FC = () => {
  const { messages, sendMessage, clearChat } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;

    sendMessage(input, false); // Disable auto bot response
    respondWithAI(input);
    setInput('');
  };

  const respondWithAI = (message: string) => {
    const lowerInput = message.toLowerCase();
    let response = "I'm not sure how to help with that yet.";

    if (lowerInput.includes('workout')) {
      const mockProfile: UserProfile = {
        fitness_level: 'beginner',
        days_per_week: 3,
        available_equipment: ['Dumbbells', 'Bodyweight'],
        goal: 'strength',
      };
      const plan = maxOutAI.generateWorkoutPlan(mockProfile);
      response = "Here's a sample workout plan:\n" + Object.entries(plan).map(
        ([day, details]) =>
          `${day} (${details.focus}): ${details.exercises.map(e => e.name).join(', ')}`
      ).join('\n');
    } else if (lowerInput.includes('nutrition') || lowerInput.includes('calories')) {
      const mockMetrics: UserMetrics = {
        weight: 70,
        height: 175,
        age: 25,
        gender: 'male',
        activity_level: 'moderate',
        goal: 'maintain',
      };
      const nutrition = maxOutAI.calculateNutrition(mockMetrics);
      response = `Estimated daily calories: ${nutrition.calories} kcal\nProtein: ${nutrition.macros.protein}g\nFat: ${nutrition.macros.fat}g\nCarbs: ${nutrition.macros.carbs}g`;
    } else if (lowerInput.includes('motivation') || lowerInput.includes('motivated')) {
      response = maxOutAI.getMotivationalMessage('general');
    }

    sendMessage(response); // Send bot message
  };

  return (
    <div className="pt-20 px-4 pb-10">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              AI Fitness Trainer
            </span>
          </h1>
          <p className="text-blue-300">Chat with your personal fitness assistant</p>
        </div>

        <div className="bg-indigo-900/20 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-indigo-500/20 flex flex-col h-[70vh]">
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
            <button
              onClick={clearChat}
              className="text-blue-300 hover:text-red-400 transition"
              title="Clear conversation"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl p-3 ${
                    message.sender === 'user'
                      ? 'bg-indigo-700 text-white rounded-tr-none'
                      : 'bg-indigo-900/50 border border-indigo-700 text-white rounded-tl-none'
                  }`}
                >
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
                  <p>{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="bg-indigo-800/30 p-4 border-t border-indigo-700">
            <form onSubmit={handleSubmit} className="flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about workouts, nutrition, or motivation..."
                className="flex-grow px-4 py-2 bg-indigo-900/50 border border-indigo-700 rounded-l-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-r-lg text-white hover:opacity-90 transition"
              >
                Send
              </button>
            </form>
          </div>
        </div>

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
                onClick={() => setInput(suggestion)}
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