// src/components/chatbot/ChatTrainer.tsx
import React, { useState, useEffect, useContext } from 'react';
import MaxOutAI, { UserProfile, UserMetrics, WorkoutPlan, NutritionPlan } from './MaxOutAI';
import { UserContext } from '../../context/UserContext'; // Assuming you have this

// Example component structure
const ChatTrainer: React.FC = () => {
  const [messages, setMessages] = useState<Array<{type: string, text: string}>>([]);
  const [input, setInput] = useState('');
  const [aiTrainer] = useState(new MaxOutAI());
  const userContext = useContext(UserContext);
  
  // Add initial greeting
  useEffect(() => {
    setMessages([
      { 
        type: 'bot', 
        text: "Hi! I'm your MaxOut AI Trainer. I can help you with workout plans, nutrition advice, or motivation. What would you like help with today?" 
      }
    ]);
  }, []);

  // Handle user input
  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = { type: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    
    // Process the message
    processUserMessage(input);
    
    // Clear input
    setInput('');
  };

  // Process user message and generate AI response
  const processUserMessage = (message: string) => {
    const lowerMessage = message.toLowerCase();
    let response: string;
    
    // Check what the user is asking for
    if (lowerMessage.includes('workout') || lowerMessage.includes('exercise') || lowerMessage.includes('plan')) {
      // Generate a workout plan based on user profile
      const userProfile: UserProfile = {
        fitness_level: (userContext?.user?.fitnessLevel || 'beginner') as 'beginner' | 'intermediate' | 'advanced',
        days_per_week: userContext?.user?.daysPerWeek || 3,
        available_equipment: userContext?.user?.equipment || [],
        goal: (userContext?.user?.goal || 'general_fitness') as any,
      };
      
      const workoutPlan = aiTrainer.generateWorkoutPlan(userProfile);
      response = formatWorkoutPlanResponse(workoutPlan);
    } 
    else if (lowerMessage.includes('nutrition') || lowerMessage.includes('diet') || lowerMessage.includes('calories') || lowerMessage.includes('food')) {
      // Generate nutrition advice
      const userMetrics: UserMetrics = {
        weight: userContext?.user?.weight || 70,
        height: userContext?.user?.height || 170,
        age: userContext?.user?.age || 30,
        gender: (userContext?.user?.gender || 'male') as 'male' | 'female' | 'other',
        activity_level: (userContext?.user?.activityLevel || 'moderate') as any,
        goal: (userContext?.user?.nutritionGoal || 'maintain') as 'lose' | 'maintain' | 'gain',
      };
      
      const nutritionPlan = aiTrainer.calculateNutrition(userMetrics);
      response = formatNutritionResponse(nutritionPlan);
    }
    else if (lowerMessage.includes('motivat') || lowerMessage.includes('inspire') || lowerMessage.includes('encourage')) {
      // Generate motivational message
      response = aiTrainer.getMotivationalMessage();
    }
    else {
      // Default response
      response = "I can help you with workout plans, nutrition advice, or motivation. What would you like assistance with?";
    }
    
    // Add AI response with a small delay to feel more natural
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', text: response }]);
    }, 500);
  };

  // Format workout plan into readable text
  const formatWorkoutPlanResponse = (plan: WorkoutPlan): string => {
    let response = "Here's your personalized workout plan:\n\n";
    
    for (const [day, workout] of Object.entries(plan)) {
      response += `**${day} - ${workout.focus}**\n`;
      
      workout.exercises.forEach((exercise, index) => {
        response += `${index + 1}. ${exercise.name}: ${exercise.sets} sets of ${exercise.reps} reps (Rest: ${exercise.rest})\n`;
      });
      
      response += '\n';
    }
    
    response += "How does this plan look? I can adjust it if needed!";
    return response;
  };

  // Format nutrition plan into readable text
  const formatNutritionResponse = (plan: NutritionPlan): string => {
    return `Based on your profile, here's your nutrition plan:
    
**Daily Calorie Target:** ${plan.calories} calories

**Macronutrient Breakdown:**
- Protein: ${plan.macros.protein}g (${Math.round(plan.macros.protein * 4)} calories)
- Carbs: ${plan.macros.carbs}g (${Math.round(plan.macros.carbs * 4)} calories)
- Fat: ${plan.macros.fat}g (${Math.round(plan.macros.fat * 9)} calories)

Would you like some meal suggestions based on this plan?`;
  };

  return (
    <div className="chat-trainer-container">
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            {msg.text}
          </div>
        ))}
      </div>
      
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask me about workouts, nutrition, or motivation..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatTrainer;