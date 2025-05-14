import React, { useState } from 'react';
import { User, Edit2, Save, LogOut, Moon, Award, Clock, Apple, Scale } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useCalories } from '../../context/CalorieContext';
import { useWorkout } from '../../context/WorkoutContext';

/**
 * ProfilePage component displays and manages user profile information including:
 * - Personal details (name, weight goals)
 * - Fitness statistics and achievements
 * - User preferences
 * - Account management
 */
const ProfilePage: React.FC = () => {
  // Context hooks to access user, calorie, and workout data
  const { user, updateUser, achievements, weightHistory } = useUser();
  const { entries } = useCalories();
  const { completedWorkouts } = useWorkout();
  
  // State for edit mode toggle
  const [isEditing, setIsEditing] = useState(false);
  
  // State for form data with fallback to user context or defaults
  const [formData, setFormData] = useState({
    name: user?.name || '',
    weight: user?.weight || 0,
    goalWeight: user?.goalWeight || 0,
    dailyCalorieGoal: user?.dailyCalorieGoal || 0
  });
  
  /**
   * Handles form input changes
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'name' ? value : Number(value) // Convert to number for numeric fields
    }));
  };
  
  /**
   * Handles form submission to update user profile
   * @param {React.FormEvent} e - Form submission event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(formData); // Update user context
    setIsEditing(false); // Exit edit mode
  };
  
  /**
   * Resets form to current user values and exits edit mode
   */
  const resetForm = () => {
    setFormData({
      name: user?.name || '',
      weight: user?.weight || 0,
      goalWeight: user?.goalWeight || 0,
      dailyCalorieGoal: user?.dailyCalorieGoal || 0
    });
    setIsEditing(false);
  };
  
  // Calculate user statistics
  const totalWorkouts = completedWorkouts.length;
  const totalCaloriesTracked = entries.reduce((sum, entry) => sum + entry.calories, 0);
  const weightChange = weightHistory.length >= 2 
    ? weightHistory[weightHistory.length - 1].weight - weightHistory[0].weight 
    : 0;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  
  return (
    <div className="pt-20 px-4 pb-10">
      <div className="container mx-auto max-w-4xl">
        {/* Page header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
              Your Profile
            </span>
          </h1>
          <p className="text-blue-300">Manage your fitness information</p>
        </div>
        
        {/* Profile Card - switches between view and edit modes */}
        <div className="bg-indigo-900/20 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-indigo-500/20 mb-8">
          <div className="bg-gradient-to-r from-purple-900 to-indigo-800 p-6">
            {!isEditing ? (
              // View Mode
              <div className="flex flex-col md:flex-row items-center">
                {/* Profile avatar with user initial */}
                <div className="w-24 h-24 rounded-full flex items-center justify-center bg-indigo-700/50 text-white text-4xl font-bold mb-4 md:mb-0 md:mr-6">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                
                {/* Profile details */}
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold text-white mb-2">{user?.name}</h2>
                  <p className="text-blue-300">Current Weight: <span className="text-white font-semibold">{user?.weight} kg</span></p>
                  <p className="text-blue-300">Goal Weight: <span className="text-white font-semibold">{user?.goalWeight} kg</span></p>
                  <p className="text-blue-300">Daily Calorie Goal: <span className="text-white font-semibold">{user?.dailyCalorieGoal} kcal</span></p>
                </div>
                
                {/* Edit profile button */}
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 md:mt-0 md:ml-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center"
                >
                  <Edit2 size={16} className="mr-2" />
                  Edit Profile
                </button>
              </div>
            ) : (
              // Edit Mode Form
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-xl font-bold text-white mb-4">Edit Profile</h2>
                
                {/* Form grid layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name input */}
                  <div>
                    <label className="block text-sm text-blue-300 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-indigo-900/50 border border-indigo-700 rounded-lg text-white"
                      required
                    />
                  </div>
                  
                  {/* Current weight input */}
                  <div>
                    <label className="block text-sm text-blue-300 mb-1">Current Weight (kg)</label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-indigo-900/50 border border-indigo-700 rounded-lg text-white"
                      min="1"
                      step="0.1"
                      required
                    />
                  </div>
                  
                  {/* Goal weight input */}
                  <div>
                    <label className="block text-sm text-blue-300 mb-1">Goal Weight (kg)</label>
                    <input
                      type="number"
                      name="goalWeight"
                      value={formData.goalWeight || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-indigo-900/50 border border-indigo-700 rounded-lg text-white"
                      min="1"
                      step="0.1"
                      required
                    />
                  </div>
                  
                  {/* Calorie goal input */}
                  <div>
                    <label className="block text-sm text-blue-300 mb-1">Daily Calorie Goal (kcal)</label>
                    <input
                      type="number"
                      name="dailyCalorieGoal"
                      value={formData.dailyCalorieGoal || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-indigo-900/50 border border-indigo-700 rounded-lg text-white"
                      min="1"
                      required
                    />
                  </div>
                </div>
                
                {/* Form action buttons */}
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center"
                  >
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
        
        {/* Stats Grid - shows key user metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Achievements stat card */}
          <div className="bg-indigo-900/20 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-indigo-500/20 flex flex-col items-center">
            <div className="rounded-full bg-purple-500/20 h-12 w-12 flex items-center justify-center mb-3">
              <Award className="text-purple-400" size={24} />
            </div>
            <p className="text-xl font-bold text-white">{unlockedAchievements}/{achievements.length}</p>
            <p className="text-sm text-blue-300">Achievements</p>
          </div>
          
          {/* Workouts stat card */}
          <div className="bg-indigo-900/20 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-indigo-500/20 flex flex-col items-center">
            <div className="rounded-full bg-pink-500/20 h-12 w-12 flex items-center justify-center mb-3">
              <Clock className="text-pink-400" size={24} />
            </div>
            <p className="text-xl font-bold text-white">{totalWorkouts}</p>
            <p className="text-sm text-blue-300">Workouts</p>
          </div>
          
          {/* Calories tracked stat card */}
          <div className="bg-indigo-900/20 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-indigo-500/20 flex flex-col items-center">
            <div className="rounded-full bg-green-500/20 h-12 w-12 flex items-center justify-center mb-3">
              <Apple className="text-green-400" size={24} />
            </div>
            <p className="text-xl font-bold text-white">{totalCaloriesTracked}</p>
            <p className="text-sm text-blue-300">Calories Tracked</p>
          </div>
          
          {/* Weight change stat card */}
          <div className="bg-indigo-900/20 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-indigo-500/20 flex flex-col items-center">
            <div className={`rounded-full ${
              weightChange < 0 ? 'bg-green-500/20' : weightChange > 0 ? 'bg-red-500/20' : 'bg-blue-500/20'
            } h-12 w-12 flex items-center justify-center mb-3`}>
              <Scale className={
                weightChange < 0 ? 'text-green-400' : weightChange > 0 ? 'text-red-400' : 'text-blue-400'
              } size={24} />
            </div>
            <p className="text-xl font-bold text-white">
              {weightChange < 0 && '-'}{weightChange > 0 && '+'}{Math.abs(weightChange).toFixed(1)} kg
            </p>
            <p className="text-sm text-blue-300">Weight Change</p>
          </div>
        </div>
        
        {/* Preferences Section */}
        <div className="bg-indigo-900/20 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-indigo-500/20 mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <User className="mr-2 text-blue-400" size={20} />
            Preferences
          </h2>
          
          <div className="space-y-4">
            {/* Dark mode toggle */}
            <div className="flex items-center justify-between p-3 bg-indigo-800/30 rounded-lg">
              <div className="flex items-center">
                <Moon size={18} className="text-purple-400 mr-3" />
                <span className="text-white">Dark Mode</span>
              </div>
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  id="toggle-dark-mode" 
                  defaultChecked={true}
                />
                <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform translate-x-6"></div>
              </div>
            </div>
            
            {/* Notifications toggle */}
            <div className="flex items-center justify-between p-3 bg-indigo-800/30 rounded-lg">
              <div className="flex items-center">
                <Award size={18} className="text-yellow-400 mr-3" />
                <span className="text-white">Achievement Notifications</span>
              </div>
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  id="toggle-notifications" 
                  defaultChecked={true}
                />
                <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform translate-x-6"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Account Section */}
        <div className="bg-indigo-900/20 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-indigo-500/20">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <User className="mr-2 text-blue-400" size={20} />
            Account
          </h2>
          
          <div className="space-y-4">
            {/* Sign out button */}
            <button className="w-full sm:w-auto px-6 py-3 bg-indigo-800/50 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center justify-center">
              <LogOut size={18} className="mr-2" />
              Sign Out
            </button>
            
            {/* App version and copyright */}
            <div className="text-sm text-blue-300 mt-6">
              <p>App Version: 1.0.0</p>
              <p>© 2025 MaxOut. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;