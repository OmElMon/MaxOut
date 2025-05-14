import React from 'react';
import { Trophy, CheckCircle, CircleDashed, Search } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { Achievement } from '../../types';

/**
 * AchievementList component displays a collection of user achievements with filtering and search capabilities.
 * It shows statistics about unlocked achievements and progress towards completion.
 */
const AchievementList: React.FC = () => {
  // Get user achievements from context
  const { achievements } = useUser();
  
  // State for filter type (all, unlocked, or locked achievements)
  const [filter, setFilter] = React.useState<'all' | 'unlocked' | 'locked'>('all');
  
  // State for search term to filter achievements by title/description
  const [searchTerm, setSearchTerm] = React.useState('');

  /**
   * Filter achievements based on:
   * - Selected filter (all, unlocked, or locked)
   * - Search term matching title or description
   */
  const filteredAchievements = achievements.filter((achievement) => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'unlocked' && achievement.unlocked) || 
      (filter === 'locked' && !achievement.unlocked);
    
    const matchesSearch = 
      achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      achievement.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  /**
   * Returns the appropriate icon component based on the icon name.
   * @param {string} iconName - Name of the icon to display
   * @returns {JSX.Element} - Icon component with styling
   */
  const getIcon = (iconName: string) => {
    const iconProps = { size: 24, className: "text-pink-400" };
    
    // Return different Trophy icons with different colors based on iconName
    switch (iconName) {
      case 'trophy':
        return <Trophy {...iconProps} className="text-yellow-400" />;
      case 'flame':
        return <Trophy {...iconProps} className="text-orange-400" />;
      case 'scale':
        return <Trophy {...iconProps} className="text-blue-400" />;
      case 'apple':
        return <Trophy {...iconProps} className="text-green-400" />;
      case 'zap':
        return <Trophy {...iconProps} className="text-yellow-400" />;
      default:
        return <Trophy {...iconProps} />;
    }
  };

  // Calculate achievement statistics
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const achievementPercentage = Math.round((unlockedCount / achievements.length) * 100);

  return (
    <div className="pt-20 px-4 pb-10">
      <div className="container mx-auto max-w-4xl">
        {/* Page header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500">
              Achievements
            </span>
          </h1>
          <p className="text-blue-300">Track your fitness milestones</p>
        </div>

        {/* Achievement Stats Card */}
        <div className="bg-indigo-900/20 backdrop-blur-sm rounded-xl p-5 mb-8 shadow-lg border border-indigo-500/20">
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Unlocked count display */}
            <div className="flex items-center mb-4 md:mb-0">
              <div className="rounded-full bg-yellow-500/20 h-16 w-16 flex items-center justify-center mr-4">
                <Trophy className="text-yellow-400" size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{unlockedCount}/{achievements.length}</h2>
                <p className="text-blue-300">Achievements Unlocked</p>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="w-full md:w-1/2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-blue-300">Progress</span>
                <span className="text-blue-300">{achievementPercentage}%</span>
              </div>
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full"
                  style={{ width: `${achievementPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search section */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          {/* Filter buttons */}
          <div className="flex bg-indigo-900/30 rounded-lg p-1 md:w-auto w-full">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md transition-colors ${
                filter === 'all' 
                  ? 'bg-indigo-700 text-white' 
                  : 'text-blue-300 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unlocked')}
              className={`px-4 py-2 rounded-md transition-colors ${
                filter === 'unlocked' 
                  ? 'bg-indigo-700 text-white' 
                  : 'text-blue-300 hover:text-white'
              }`}
            >
              <CheckCircle size={16} className="inline mr-1" />
              Unlocked
            </button>
            <button
              onClick={() => setFilter('locked')}
              className={`px-4 py-2 rounded-md transition-colors ${
                filter === 'locked' 
                  ? 'bg-indigo-700 text-white' 
                  : 'text-blue-300 hover:text-white'
              }`}
            >
              <CircleDashed size={16} className="inline mr-1" />
              Locked
            </button>
          </div>
          
          {/* Search input */}
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search achievements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-indigo-900/30 border border-indigo-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300" />
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Render filtered achievements or empty state */}
          {filteredAchievements.map((achievement) => (
            <AchievementCard 
              key={achievement.id} 
              achievement={achievement} 
              getIcon={getIcon}
            />
          ))}
          
          {filteredAchievements.length === 0 && (
            <div className="col-span-2 text-center py-10 text-gray-400">
              <p>No achievements found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * AchievementCard component displays an individual achievement with its status and progress.
 */
interface AchievementCardProps {
  achievement: Achievement;
  getIcon: (iconName: string) => JSX.Element;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, getIcon }) => {
  const { title, description, icon, unlocked, progress, maxProgress } = achievement;
  
  // Calculate progress percentage if achievement has progress tracking
  const progressPercentage = progress && maxProgress
    ? Math.min(Math.round((progress / maxProgress) * 100), 100)
    : 0;

  return (
    <div className={`bg-indigo-900/20 backdrop-blur-sm rounded-xl p-5 shadow-lg border ${
      unlocked ? 'border-yellow-500/30' : 'border-indigo-500/20'
    } transition-all hover:scale-[1.02] duration-300`}>
      <div className="flex items-start mb-3">
        {/* Achievement icon */}
        <div className={`rounded-full ${
          unlocked ? 'bg-yellow-500/20' : 'bg-indigo-700/50'
        } h-12 w-12 flex items-center justify-center mr-4`}>
          {getIcon(icon)}
        </div>
        
        {/* Achievement details */}
        <div>
          <div className="flex items-center">
            <h3 className="font-bold text-white text-lg">{title}</h3>
            {/* Unlocked badge */}
            {unlocked && (
              <span className="ml-2 bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded-full">
                Unlocked
              </span>
            )}
          </div>
          <p className="text-blue-300">{description}</p>
        </div>
      </div>
      
      {/* Progress bar for locked achievements */}
      {!unlocked && progress !== undefined && maxProgress !== undefined && (
        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-blue-300">Progress</span>
            <span className="text-blue-300">{progress}/{maxProgress}</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementList;