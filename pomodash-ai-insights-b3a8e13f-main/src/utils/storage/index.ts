
// Re-export all storage utilities from this central index file

// Local Storage
export { 
  saveLogsToStorage, 
  getLogsFromStorage,
  getStreakFromStorage,
  saveStreakToStorage,
  LOGS_STORAGE_KEY,
  STREAK_STORAGE_KEY
} from './localStorage';

// Streak Types
export type { StreakData } from './streakTypes'; // Fixed: use 'export type' for interface
export { defaultStreakData } from './streakTypes';

// Streak Management
export { 
  updateStreak 
} from './streakManager';

// Supabase Integration
export {
  syncStreakWithSupabase,
  getStreakFromSupabase,
  syncLogsWithSupabase,
  getLogsFromSupabase,
  saveLogsToSupabase
} from './supabaseIntegration';
