
import { GoalTask } from '@/types/goals';
import { supabase } from '@/integrations/supabase/client';

export const analyzeTaskProgress = async (tasks: GoalTask[], goalTitle: string): Promise<number> => {
  if (tasks.length === 0) {
    return calculateBasicProgress(tasks);
  }

  try {
    console.log(`Analyzing progress for goal: ${goalTitle}`);

    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('analyze-task-progress', {
      body: { tasks, goalTitle }
    });

    if (error) {
      console.error("Supabase Edge Function error:", error);
      return calculateBasicProgress(tasks);
    }

    return data.progress;
  } catch (error) {
    console.error('Error analyzing tasks with Edge Function:', error);
    return calculateBasicProgress(tasks);
  }
};

// Fallback calculation method
const calculateBasicProgress = (tasks: GoalTask[]): number => {
  if (tasks.length === 0) return 0;
  const completedTasks = tasks.filter(task => task.completed).length;
  return Math.round((completedTasks / tasks.length) * 100);
};

// Predict completion date based on current progress pace
export const predictCompletionDate = (
  tasks: GoalTask[], 
  createdAt: string,
  targetDate?: string
): string | null => {
  if (tasks.length === 0) return null;
  
  const completedTasks = tasks.filter(task => task.completed);
  if (completedTasks.length === 0) return null;
  
  // Calculate tasks completed per day
  const now = new Date();
  const created = new Date(createdAt);
  const daysActive = Math.max(1, (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  
  const tasksPerDay = completedTasks.length / daysActive;
  const remainingTasks = tasks.length - completedTasks.length;
  
  if (tasksPerDay === 0 || remainingTasks === 0) {
    return targetDate ? 
      new Date(targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 
      null;
  }
  
  // Calculate projected completion date
  const daysToCompletion = remainingTasks / tasksPerDay;
  const completionDate = new Date();
  completionDate.setDate(now.getDate() + Math.ceil(daysToCompletion));
  
  return completionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
