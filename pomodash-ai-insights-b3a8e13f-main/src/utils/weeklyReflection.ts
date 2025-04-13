
import { LogEntryType, TaskEntry } from '@/types/logs';
import { Goal, GoalTask } from '@/types/goals';
import { format, subDays, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { StreakData } from '@/utils/storage/streakTypes';
import { supabase } from '@/integrations/supabase/client';

export interface WeeklyReflection {
  id: string;
  userId: string;
  date: string;
  summary: string;
  activeGoals: string[];
  ignoredGoals: string[];
  moodTrend: string;
  energyLevel: string;
  progressMomentum: number; // 1-10 rating
  nextWeekFocus: string[];
  stats: {
    tasksCompleted: number;
    totalTasks: number;
    focusSessionsCount: number;
    totalFocusMinutes: number;
    streakStatus: string;
  };
}

/**
 * Analyzes user data to generate a weekly reflection
 */
export const generateWeeklyReflection = async (
  userId: string,
  logs: LogEntryType[],
  goals: Goal[],
  streak: StreakData
): Promise<WeeklyReflection> => {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday as week start
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  
  // Filter logs for the current week
  const weekLogs = logs.filter(log => {
    const logDate = new Date(log.startTime);
    return isWithinInterval(logDate, { start: weekStart, end: weekEnd });
  });
  
  // Calculate task completion
  const tasksCompleted = weekLogs.reduce((count, log) => {
    return count + (log.tasks?.filter(task => task.completed).length || 0);
  }, 0);
  
  const totalTasks = weekLogs.reduce((count, log) => {
    return count + (log.tasks?.length || 0);
  }, 0);
  
  // Calculate focus sessions
  const focusSessionsCount = weekLogs.length;
  const totalFocusMinutes = Math.round(weekLogs.reduce((sum, log) => sum + log.duration, 0) / 60);
  
  // Analyze goal activity
  const activeGoals: Goal[] = [];
  const ignoredGoals: Goal[] = [];
  
  goals.forEach(goal => {
    // A goal is considered active if it has had task updates in the past week
    const hasRecentActivity = goal.tasks.some(task => {
      // Check if this task is linked to a log from this week
      return weekLogs.some(log => log.tasks.some(logTask => logTask.id === task.id));
    });
    
    if (hasRecentActivity) {
      activeGoals.push(goal);
    } else if (goal.status === 'active') {
      ignoredGoals.push(goal);
    }
  });
  
  // Create reflection object
  const reflection: WeeklyReflection = {
    id: `reflection-${format(now, 'yyyy-MM-dd')}`,
    userId,
    date: format(now, 'yyyy-MM-dd'),
    summary: await generateSummary(weekLogs, goals, streak),
    activeGoals: activeGoals.map(g => g.title),
    ignoredGoals: ignoredGoals.map(g => g.title),
    moodTrend: analyzeMoodTrend(weekLogs),
    energyLevel: analyzeEnergyLevel(weekLogs),
    progressMomentum: calculateProgressMomentum(weekLogs, goals),
    nextWeekFocus: generateNextWeekFocus(weekLogs, goals, ignoredGoals),
    stats: {
      tasksCompleted,
      totalTasks,
      focusSessionsCount,
      totalFocusMinutes,
      streakStatus: analyzeStreakStatus(streak),
    }
  };
  
  return reflection;
};

// Helper functions

const analyzeMoodTrend = (logs: LogEntryType[]): string => {
  // For now, a simple implementation analyzing content for mood indicators
  const moodKeywords = {
    positive: ['happy', 'energetic', 'productive', 'excited', 'motivated', 'great', 'good'],
    negative: ['tired', 'frustrated', 'stressed', 'anxious', 'unmotivated', 'bad', 'difficult']
  };
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  logs.forEach(log => {
    const content = log.content.toLowerCase();
    moodKeywords.positive.forEach(word => {
      if (content.includes(word)) positiveCount++;
    });
    moodKeywords.negative.forEach(word => {
      if (content.includes(word)) negativeCount++;
    });
  });
  
  if (positiveCount > negativeCount * 2) return "Very positive";
  if (positiveCount > negativeCount) return "Mostly positive";
  if (negativeCount > positiveCount * 2) return "Challenging";
  if (negativeCount > positiveCount) return "Mixed, with some challenges";
  return "Neutral";
};

const analyzeEnergyLevel = (logs: LogEntryType[]): string => {
  // Simple implementation analyzing content for energy indicators
  const energyKeywords = {
    high: ['energetic', 'productive', 'motivated', 'focused', 'efficient'],
    low: ['tired', 'exhausted', 'drained', 'fatigued', 'unmotivated']
  };
  
  let highCount = 0;
  let lowCount = 0;
  
  logs.forEach(log => {
    const content = log.content.toLowerCase();
    energyKeywords.high.forEach(word => {
      if (content.includes(word)) highCount++;
    });
    energyKeywords.low.forEach(word => {
      if (content.includes(word)) lowCount++;
    });
  });
  
  if (highCount > lowCount * 2) return "High energy";
  if (highCount > lowCount) return "Good energy";
  if (lowCount > highCount * 2) return "Low energy";
  if (lowCount > highCount) return "Fluctuating energy";
  return "Moderate energy";
};

const calculateProgressMomentum = (logs: LogEntryType[], goals: Goal[]): number => {
  if (logs.length === 0) return 5; // Default neutral score
  
  // Calculate task completion rate
  const completedTasks = logs.reduce((count, log) => {
    return count + (log.tasks?.filter(task => task.completed).length || 0);
  }, 0);
  
  const totalTasks = logs.reduce((count, log) => {
    return count + (log.tasks?.length || 0);
  }, 0);
  
  const taskCompletionRate = totalTasks > 0 ? completedTasks / totalTasks : 0;
  
  // Calculate goal progress
  const goalProgressRate = goals.length > 0 
    ? goals.reduce((sum, goal) => sum + goal.progress, 0) / (goals.length * 100)
    : 0;
  
  // Calculate focus session consistency (sessions per day)
  const daysInWeek = 7;
  const sessionsPerDay = logs.length / daysInWeek;
  const sessionConsistencyScore = Math.min(sessionsPerDay / 2, 1); // Cap at 1 for 2+ sessions/day
  
  // Combine factors for final score (1-10)
  const rawScore = (taskCompletionRate * 0.4 + goalProgressRate * 0.4 + sessionConsistencyScore * 0.2) * 10;
  return Math.round(Math.max(1, Math.min(10, rawScore)));
};

const analyzeStreakStatus = (streak: StreakData): string => {
  if (streak.currentStreak === 0) return "No active streak";
  if (streak.currentStreak === 1) return "Started a new streak";
  if (streak.currentStreak <= 3) return `Consistent for ${streak.currentStreak} days`;
  if (streak.currentStreak <= 7) return `Building momentum with a ${streak.currentStreak}-day streak`;
  if (streak.currentStreak <= 14) return `Strong streak of ${streak.currentStreak} days`;
  return `Impressive ${streak.currentStreak}-day streak! Keep going!`;
};

const generateNextWeekFocus = (logs: LogEntryType[], goals: Goal[], ignoredGoals: Goal[]): string[] => {
  const suggestions: string[] = [];
  
  // Suggest focusing on ignored goals
  if (ignoredGoals.length > 0) {
    const ignoredGoalTitles = ignoredGoals.slice(0, 2).map(g => g.title);
    if (ignoredGoals.length === 1) {
      suggestions.push(`Reconnect with your "${ignoredGoalTitles[0]}" goal`);
    } else {
      suggestions.push(`Revisit goals that need attention: ${ignoredGoalTitles.join(', ')}`);
    }
  }
  
  // Suggest continuing momentum on active goals
  const mostActiveGoal = goals.sort((a, b) => b.progress - a.progress)[0];
  if (mostActiveGoal && mostActiveGoal.progress < 100) {
    suggestions.push(`Continue progress on "${mostActiveGoal.title}"`);
  }
  
  // Suggest maintaining or improving streak
  suggestions.push("Maintain your daily focus session streak");
  
  // If not enough suggestions, add generic ones
  if (suggestions.length < 3) {
    suggestions.push("Break down complex tasks into smaller actions");
    suggestions.push("Schedule dedicated focus time in your calendar");
  }
  
  return suggestions;
};

const generateSummary = async (logs: LogEntryType[], goals: Goal[], streak: StreakData): Promise<string> => {
  try {
    // Try to generate an AI summary using the edge function
    const summary = await generateAISummary(logs, goals, streak);
    return summary;
  } catch (error) {
    console.error("Error generating AI summary:", error);
    // Fallback to template-based summary
    return generateTemplateSummary(logs, goals, streak);
  }
};

const generateAISummary = async (logs: LogEntryType[], goals: Goal[], streak: StreakData): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-weekly-reflection', {
      body: { logs, goals, streak }
    });

    if (error) {
      throw new Error(error.message);
    }

    return data.summary;
  } catch (error) {
    console.error("AI summary generation failed:", error);
    throw error;
  }
};

const generateTemplateSummary = (logs: LogEntryType[], goals: Goal[], streak: StreakData): string => {
  const completedTasks = logs.reduce((count, log) => {
    return count + (log.tasks?.filter(task => task.completed).length || 0);
  }, 0);
  
  const totalFocusMinutes = Math.round(logs.reduce((sum, log) => sum + log.duration, 0) / 60);
  
  let summary = `This week, you completed ${completedTasks} tasks and spent ${totalFocusMinutes} minutes in focused work. `;
  
  if (logs.length === 0) {
    summary += "It seems like you didn't log any sessions this week. Remember that consistent tracking helps build momentum! ";
  } else if (logs.length < 3) {
    summary += "You had a few focused sessions, but there's room to increase your consistency. ";
  } else if (logs.length < 7) {
    summary += "You maintained a good rhythm of focused work throughout the week. ";
  } else {
    summary += "Impressive work ethic with multiple focused sessions each day! ";
  }
  
  if (streak.currentStreak > 0) {
    summary += `You're on a ${streak.currentStreak}-day streak! `;
    if (streak.currentStreak > streak.longestStreak * 0.8) {
      summary += "You're approaching your all-time record! ";
    }
  } else {
    summary += "Consider starting a new streak this week by logging at least one session each day. ";
  }
  
  // Add goal progress
  const progressingGoals = goals.filter(g => g.progress > 0 && g.progress < 100);
  if (progressingGoals.length > 0) {
    const topGoal = progressingGoals.sort((a, b) => b.progress - a.progress)[0];
    summary += `Your "${topGoal.title}" goal is making good progress at ${topGoal.progress}% complete. `;
  }
  
  summary += "Looking forward to seeing your progress next week!";
  
  return summary;
};

/**
 * Saves a reflection to Supabase
 */
export const saveReflection = async (reflection: WeeklyReflection): Promise<void> => {
  try {
    const { error } = await supabase
      .from('reflections')
      .upsert({
        id: reflection.id,
        user_id: reflection.userId,
        date: reflection.date,
        summary: reflection.summary,
        active_goals: reflection.activeGoals,
        ignored_goals: reflection.ignoredGoals,
        mood_trend: reflection.moodTrend,
        energy_level: reflection.energyLevel,
        progress_momentum: reflection.progressMomentum,
        next_week_focus: reflection.nextWeekFocus,
        stats: reflection.stats
      });
      
    if (error) {
      console.error("Error saving reflection:", error);
      throw error;
    }
  } catch (error) {
    console.error("Failed to save reflection:", error);
    throw error;
  }
};

/**
 * Gets all reflections for a user
 */
export const getUserReflections = async (userId: string): Promise<WeeklyReflection[]> => {
  try {
    const { data, error } = await supabase
      .from('reflections')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
      
    if (error) {
      console.error("Error fetching reflections:", error);
      throw error;
    }
    
    // Transform from database format to app format
    return data.map(item => ({
      id: item.id,
      userId: item.user_id,
      date: item.date,
      summary: item.summary,
      activeGoals: item.active_goals,
      ignoredGoals: item.ignored_goals,
      moodTrend: item.mood_trend,
      energyLevel: item.energy_level,
      progressMomentum: item.progress_momentum,
      nextWeekFocus: item.next_week_focus,
      stats: item.stats
    }));
  } catch (error) {
    console.error("Failed to fetch reflections:", error);
    return [];
  }
};

/**
 * Gets the latest reflection for a user
 */
export const getLatestReflection = async (userId: string): Promise<WeeklyReflection | null> => {
  try {
    const { data, error } = await supabase
      .from('reflections')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(1)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        // No reflection found
        return null;
      }
      console.error("Error fetching latest reflection:", error);
      throw error;
    }
    
    return {
      id: data.id,
      userId: data.user_id,
      date: data.date,
      summary: data.summary,
      activeGoals: data.active_goals,
      ignoredGoals: data.ignored_goals,
      moodTrend: data.mood_trend,
      energyLevel: data.energy_level,
      progressMomentum: data.progress_momentum,
      nextWeekFocus: data.next_week_focus,
      stats: data.stats
    };
  } catch (error) {
    console.error("Failed to fetch latest reflection:", error);
    return null;
  }
};
