
// Streak interface
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastLoggedDate: string;
  graceUsed: boolean;
}

// Default streak data
export const defaultStreakData: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastLoggedDate: '',
  graceUsed: false
};
