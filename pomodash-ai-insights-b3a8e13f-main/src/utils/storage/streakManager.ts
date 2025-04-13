
import { LogEntryType } from '@/types/logs';
import { differenceInCalendarDays, isYesterday, startOfDay } from 'date-fns';
import { getStreakFromStorage, saveStreakToStorage } from './localStorage';
import { StreakData, defaultStreakData } from './streakTypes';
import { syncStreakWithSupabase } from './supabaseIntegration';

export const updateStreak = (logs: LogEntryType[]): StreakData => {
  // Get current streak data
  const streakData = getStreakFromStorage();
  
  // If no logs, return default streak
  if (!logs.length) {
    return streakData;
  }

  // Get today's date
  const today = startOfDay(new Date());
  
  // Sort logs by start time in descending order
  const sortedLogs = [...logs].sort((a, b) => 
    new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );
  
  // Check if user logged today
  const loggedToday = sortedLogs.some(log => isToday(new Date(log.startTime)));
  
  // If no lastLoggedDate, this is the first time
  if (!streakData.lastLoggedDate) {
    const newStreak: StreakData = {
      currentStreak: loggedToday ? 1 : 0,
      longestStreak: loggedToday ? 1 : 0,
      lastLoggedDate: loggedToday ? today.toISOString() : '',
      graceUsed: false
    };
    saveStreakToStorage(newStreak);
    return newStreak;
  }
  
  const lastLoggedDate = new Date(streakData.lastLoggedDate);
  const daysSinceLastLog = differenceInCalendarDays(today, lastLoggedDate);
  
  let newStreakData = { ...streakData };
  
  if (loggedToday) {
    if (daysSinceLastLog === 0) {
      // Already updated today, no changes needed
    } else if (daysSinceLastLog === 1 || isYesterday(lastLoggedDate)) {
      // Logged yesterday, increment streak
      newStreakData.currentStreak += 1;
      newStreakData.lastLoggedDate = today.toISOString();
      newStreakData.graceUsed = false;
    } else if (daysSinceLastLog === 2 && !streakData.graceUsed) {
      // Missed one day but have grace day available
      newStreakData.currentStreak += 1;
      newStreakData.lastLoggedDate = today.toISOString();
      newStreakData.graceUsed = true;
    } else {
      // Streak broken, restart
      newStreakData.currentStreak = 1;
      newStreakData.lastLoggedDate = today.toISOString();
      newStreakData.graceUsed = false;
    }
  } else if (daysSinceLastLog > 1) {
    // More than 1 day without logging and not logged today
    if (daysSinceLastLog === 2 && !streakData.graceUsed) {
      // Still have grace day
    } else {
      // Streak broken
      newStreakData.currentStreak = 0;
      newStreakData.graceUsed = false;
    }
  }
  
  // Update longest streak if needed
  if (newStreakData.currentStreak > newStreakData.longestStreak) {
    newStreakData.longestStreak = newStreakData.currentStreak;
  }
  
  // Save and return updated streak
  saveStreakToStorage(newStreakData);
  return newStreakData;
};

// Helper function to check if a date is today
const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};
