import React from 'react';
import { Trophy, Flame, Scale, Apple, Dumbbell } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { Achievement } from '../../types';

/**
 * Returns the appropriate icon component based on the achievement icon name
 * @param {string} iconName - Name of the icon to display
 * @returns {JSX.Element} - Icon component with appropriate styling
 */
const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'trophy':
      return <Trophy size={18} className="text-yellow-400" />;
    case 'flame':
      return <Flame size={18} className="text-orange-400" />;
    case 'scale':
      return <Scale size={18} className="text-blue-400" />;
    case 'apple':
      return <Apple size={18} className="text-green-400" />;
    case 'dumbbell':
    default:
      return <Dumbbell size={18} className="text-pink-400" />;
  }
};

/**
 * AchievementProgress component displays a section showing achievements that are in progress
 * (not yet unlocked but have some progress made toward completion)
 */
const AchievementProgress: React.FC = () => {
  // Get user achievements from context
  const { achievements } = useUser();
  
  // Filter achievements to only show those that are:
  // - Not yet unlocked
  // - Have progress > 0
  const inProgressAchievements = achievements.filter(
    achievement => !achievement.unlocked && achievement.progress && achievement.progress > 0
  );

  // Don't render anything if there are no in-progress achievements
  if (inProgressAchievements.length === 0) {
    return null;
  }

  return (
    <div className="bg-indigo-900/20 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-indigo-500/20">
      {/* Section header with trophy icon */}
      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
        <Trophy className="mr-2 text-yellow-400" size={20} />
        Achievement Progress
      </h2>
      
      {/* Grid layout for achievement cards - responsive columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {inProgressAchievements.map(achievement => (
          <AchievementCard 
            key={achievement.id} 
            achievement={achievement} 
            getIcon={getIcon}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Props interface for AchievementCard component
 */
interface AchievementCardProps {
  achievement: Achievement;
  getIcon: (iconName: string) => JSX.Element;
}

/**
 * AchievementCard component displays an individual achievement with its progress bar
 */
const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, getIcon }) => {
  // Destructure achievement properties
  const { icon, title, description, progress, maxProgress } = achievement;
  
  /**
   * Calculate progress percentage (capped at 100%)
   * If progress or maxProgress is missing, defaults to 0
   */
  const progressPercentage = progress && maxProgress
    ? Math.min(Math.round((progress / maxProgress) * 100), 100)
    : 0;
  
  // Get the appropriate icon component for this achievement
  const iconComponent = getIcon(icon);

  return (
    <div className="bg-indigo-800/30 rounded-lg p-4 border border-indigo-700/50">
      {/* Achievement header with icon and text */}
      <div className="flex items-start mb-2">
        <div className="rounded-full bg-indigo-700/50 h-10 w-10 flex items-center justify-center mr-3 shrink-0">
          {iconComponent}
        </div>
        <div>
          <h3 className="font-bold text-white">{title}</h3>
          <p className="text-sm text-blue-300">{description}</p>
        </div>
      </div>
      
      {/* Progress bar section */}
      <div className="mt-3">
        {/* Progress text indicators */}
        <div className="flex justify-between text-xs mb-1">
          <span className="text-blue-300">Progress</span>
          <span className="text-blue-300">{progress}/{maxProgress}</span>
        </div>
        
        {/* Progress bar visualization */}
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-pink-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default AchievementProgress;