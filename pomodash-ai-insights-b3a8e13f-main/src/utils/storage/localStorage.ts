
import { LogEntryType } from '@/types/logs';
import { StreakData } from './streakTypes';

// Storage keys
export const LOGS_STORAGE_KEY = 'kiwi_logs';
export const STREAK_STORAGE_KEY = 'kiwi_streak';

// Local Storage Functions for logs
export const saveLogsToStorage = (logs: LogEntryType[]): void => {
  localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
};

export const getLogsFromStorage = (): LogEntryType[] => {
  const storedLogs = localStorage.getItem(LOGS_STORAGE_KEY);
  if (!storedLogs) return [];
  
  try {
    const parsedLogs = JSON.parse(storedLogs) as LogEntryType[];
    
    // Ensure backward compatibility with logs that don't have tasks array
    return parsedLogs.map(log => {
      if (!log.tasks) {
        return {
          ...log,
          tasks: []
        };
      }
      return log;
    });
    
  } catch (error) {
    console.error('Error parsing logs from storage:', error);
    return [];
  }
};

// Local Storage Functions for streak
export const getStreakFromStorage = (): StreakData => {
  const storedStreak = localStorage.getItem(STREAK_STORAGE_KEY);
  if (!storedStreak) return { 
    currentStreak: 0,
    longestStreak: 0,
    lastLoggedDate: '',
    graceUsed: false
  };
  
  try {
    return JSON.parse(storedStreak) as StreakData;
  } catch (error) {
    console.error('Error parsing streak from storage:', error);
    return { 
      currentStreak: 0,
      longestStreak: 0,
      lastLoggedDate: '',
      graceUsed: false
    };
  }
};

export const saveStreakToStorage = (streak: StreakData): void => {
  localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(streak));
};
