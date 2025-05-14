import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Dashboard from './components/dashboard/Dashboard';
import WorkoutPlans from './components/workout/WorkoutPlans';
import AchievementList from './components/achievements/AchievementList';
import ChatTrainer from './components/chatbot/ChatTrainer';
import ProfilePage from './components/profile/ProfilePage';
import ProgressTracker from './components/progress/ProgressTracker';
import NutritionPage from './components/nutrition/NutritionPage';
import { UserProvider } from './context/UserContext';
import { WorkoutProvider } from './context/WorkoutContext';
import { CalorieProvider } from './context/CalorieContext';
import { ChatProvider } from './context/ChatContext';

function App() {
  return (
    <UserProvider>
      <WorkoutProvider>
        <CalorieProvider>
          <ChatProvider>
            <Router>
              <div className="min-h-screen bg-gradient-to-b from-purple-950 to-indigo-950 text-white">
                <Header />
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/workouts" element={<WorkoutPlans />} />
                  <Route path="/achievements" element={<AchievementList />} />
                  <Route path="/trainer" element={<ChatTrainer />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/progress" element={<ProgressTracker />} />
                  <Route path="/nutrition" element={<NutritionPage />} />
                </Routes>
              </div>
            </Router>
          </ChatProvider>
        </CalorieProvider>
      </WorkoutProvider>
    </UserProvider>
  );
}

export default App;