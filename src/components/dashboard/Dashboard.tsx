import React from 'react';
import { Sparkles, Calendar, Dumbbell, ArrowUp } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useWorkout } from '../../context/WorkoutContext';
import { useCalories } from '../../context/CalorieContext';
import CalorieTracker from './CalorieTracker';
import WeightTracker from './WeightTracker';
import AchievementProgress from '../achievements/AchievementProgress';

const Dashboard: React.FC = () => {
  const { user, achievements, weightHistory } = useUser();
  const { workoutPlans, completedWorkouts } = useWorkout();
  const { getTodaysCalories } = useCalories();

  // Get recent stats
  const recentWorkouts = completedWorkouts.length;
  const todaysCalories = getTodaysCalories();
  const calorieGoal = user?.dailyCalorieGoal || 2000;
  const caloriePercentage = Math.round((todaysCalories / calorieGoal) * 100);
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  
  // Get latest weight change
  const getLatestWeightChange = () => {
    if (weightHistory.length < 2) return { change: 0, trend: 'neutral' };
    
    const latest = weightHistory[weightHistory.length - 1].weight;
    const previous = weightHistory[weightHistory.length - 2].weight;
    const change = latest - previous;
    
    return {
      change,
      trend: change < 0 ? 'down' : change > 0 ? 'up' : 'neutral'
    };
  };
  
  const latestWeightChange = getLatestWeightChange();

  return (
    <div className="pt-20 px-4 pb-10">
      <div className="container mx-auto">
        <div className="text-center mb-10 text-white">
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-500">
              Welcome back, {user?.name || 'Fitness Hero'}!
            </span>
          </h1>
          <p className="text-blue-300">Your fitness journey continues today</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-indigo-900/20 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-indigo-500/20 flex items-center">
            <div className="rounded-full bg-blue-500/20 h-12 w-12 flex items-center justify-center mr-4">
              <Calendar className="text-blue-400" size={24} />
            </div>
            <div>
              <p className="text-blue-300 text-sm">Workouts</p>
              <p className="text-xl font-bold text-white">{recentWorkouts}</p>
            </div>
          </div>
          
          <div className="bg-indigo-900/20 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-indigo-500/20 flex items-center">
            <div className="rounded-full bg-pink-500/20 h-12 w-12 flex items-center justify-center mr-4">
              <Sparkles className="text-pink-400" size={24} />
            </div>
            <div>
              <p className="text-blue-300 text-sm">Achievements</p>
              <p className="text-xl font-bold text-white">{unlockedAchievements}/{achievements.length}</p>
            </div>
          </div>
          
          <div className="bg-indigo-900/20 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-indigo-500/20 flex items-center">
            <div className="rounded-full bg-green-500/20 h-12 w-12 flex items-center justify-center mr-4">
              <Dumbbell className="text-green-400" size={24} />
            </div>
            <div>
              <p className="text-blue-300 text-sm">Plans</p>
              <p className="text-xl font-bold text-white">{workoutPlans.length}</p>
            </div>
          </div>
          
          <div className="bg-indigo-900/20 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-indigo-500/20 flex items-center">
            <div className={`rounded-full ${
              latestWeightChange.trend === 'down' 
                ? 'bg-green-500/20' 
                : latestWeightChange.trend === 'up' 
                  ? 'bg-red-500/20' 
                  : 'bg-blue-500/20'
            } h-12 w-12 flex items-center justify-center mr-4`}>
              <ArrowUp className={`${
                latestWeightChange.trend === 'down' 
                  ? 'text-green-400 rotate-180' 
                  : latestWeightChange.trend === 'up' 
                    ? 'text-red-400' 
                    : 'text-blue-400'
              }`} size={24} />
            </div>
            <div>
              <p className="text-blue-300 text-sm">Weight</p>
              <p className="text-xl font-bold text-white">
                {Math.abs(latestWeightChange.change).toFixed(1)} kg
                {latestWeightChange.trend === 'down' && ' ↓'}
                {latestWeightChange.trend === 'up' && ' ↑'}
              </p>
            </div>
          </div>
        </div>

        {/* Achievements Progress */}
        <div className="mb-8">
          <AchievementProgress />
        </div>

        {/* Main Trackers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CalorieTracker />
          <WeightTracker />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;