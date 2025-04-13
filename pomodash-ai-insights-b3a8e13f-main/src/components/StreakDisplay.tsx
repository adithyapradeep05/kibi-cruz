
import React, { useEffect, useState } from 'react';
import { Flame, Award, Trophy } from 'lucide-react';
import { StreakData, getStreakFromStorage, getStreakFromSupabase } from '@/utils/storage';
import { useAuth } from '@/contexts/auth';

interface StreakDisplayProps {
  compact?: boolean;
  showLabel?: boolean;
  className?: string;
}

const StreakDisplay: React.FC<StreakDisplayProps> = ({ 
  compact = false, 
  showLabel = true,
  className = ""
}) => {
  const [streak, setStreak] = useState<StreakData | null>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    const loadStreak = async () => {
      // Try to get streak from Supabase if user is logged in
      if (user) {
        const streakData = await getStreakFromSupabase();
        setStreak(streakData);
      } else {
        // Fall back to local storage
        const streakData = getStreakFromStorage();
        setStreak(streakData);
      }
    };
    
    loadStreak();
  }, [user]);
  
  if (!streak) return null;
  
  // If streak is 0, don't show anything unless we want to explicitly show it
  if (streak.currentStreak === 0 && !compact) {
    return (
      <div className={`flex items-center ${className}`}>
        <Flame className="w-5 h-5 text-gray-400 mr-1" />
        <span className="text-sm text-gray-400">Start your streak today!</span>
      </div>
    );
  } else if (streak.currentStreak === 0 && compact) {
    return null;
  }
  
  // Determine the streak color based on the length
  const getStreakColor = () => {
    if (streak.currentStreak >= 30) return "text-purple";
    if (streak.currentStreak >= 14) return "text-blue";
    if (streak.currentStreak >= 7) return "text-orange";
    return "text-green";
  };

  // Get milestone icon based on streak length
  const getStreakIcon = () => {
    if (streak.currentStreak >= 30) return <Trophy className={`w-5 h-5 ${getStreakColor()} animate-pulse-slow`} />;
    if (streak.currentStreak >= 7) return <Award className={`w-5 h-5 ${getStreakColor()} animate-pulse-slow`} />;
    return <Flame className={`w-5 h-5 ${getStreakColor()} animate-pulse-slow`} />;
  };
  
  // Get milestone label if applicable
  const getMilestoneLabel = () => {
    if (streak.currentStreak >= 100) return "Core Memory";
    if (streak.currentStreak >= 30) return "Beast Mode";
    if (streak.currentStreak >= 14) return "Locked In 🔒";
    if (streak.currentStreak >= 7) return "On Fire";
    if (streak.currentStreak >= 3) return "Mini Streak";
    return "";
  };
  
  const streakColor = getStreakColor();
  const milestoneLabel = getMilestoneLabel();
  
  if (compact) {
    return (
      <div className={`flex items-center ${className}`}>
        {getStreakIcon()}
        <span className={`text-sm font-semibold ${streakColor}`}>{streak.currentStreak}</span>
      </div>
    );
  }
  
  return (
    <div className={`flex items-center ${className}`}>
      {getStreakIcon()}
      <div className="ml-2">
        <div className="flex items-center">
          <span className={`font-semibold ${streakColor}`}>{streak.currentStreak}-Day Streak</span>
          {milestoneLabel && (
            <span className="ml-2 text-xs bg-card-dark px-2 py-0.5 rounded-full">
              {milestoneLabel}
            </span>
          )}
        </div>
        {showLabel && streak.longestStreak > streak.currentStreak && (
          <span className="text-xs text-gray-400">
            Longest: {streak.longestStreak} days
          </span>
        )}
      </div>
    </div>
  );
};

export default StreakDisplay;
