
import { Goal } from '@/types/goals';
import { supabase } from '@/integrations/supabase/client';

export const analyzeGoalProgress = async (goal: Goal): Promise<string> => {
  try {
    console.log(`Starting analysis of goal: ${goal.title}`);

    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('analyze-goal', {
      body: { goal }
    });

    if (error) {
      console.error("Supabase Edge Function error:", error);
      throw new Error(`Edge Function error: ${error.message}`);
    }

    console.log("Goal analysis response received");
    return data.analysis;
  } catch (error) {
    console.error('Error analyzing goal with Edge Function:', error);
    
    if (error instanceof Error) {
      return `Error: ${error.message}`;
    }
    
    return "Unable to analyze goal. Please try again later.";
  }
};

export const predictCompletionDate = (goal: Goal): string | null => {
  // This is a local prediction fallback if the AI service is unavailable
  if (!goal.targetDate || goal.progress === 0) return null;
  
  const targetDate = new Date(goal.targetDate);
  const today = new Date();
  const totalDays = (targetDate.getTime() - new Date(goal.createdAt).getTime()) / (1000 * 60 * 60 * 24);
  const daysElapsed = (today.getTime() - new Date(goal.createdAt).getTime()) / (1000 * 60 * 60 * 24);
  
  if (daysElapsed <= 0) return null;
  
  const progressPerDay = goal.progress / daysElapsed;
  const daysToCompletion = progressPerDay > 0 ? (100 - goal.progress) / progressPerDay : 0;
  
  const predictedDate = new Date();
  predictedDate.setDate(today.getDate() + daysToCompletion);
  
  // Format the date
  return predictedDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};
