
import { LogEntryType } from '@/types/logs';
import { Goal } from '@/types/goals';
import { StreakData } from '@/utils/storage/streakTypes';
import { 
  generateWeeklyReflection, 
  saveReflection, 
  WeeklyReflection 
} from '@/utils/weeklyReflection';
import { supabase } from '@/integrations/supabase/client';
import { isSunday, getHours } from 'date-fns';

export const checkAndGenerateWeeklyReflection = async (
  userId: string,
  logs: LogEntryType[],
  goals: Goal[],
  streak: StreakData
): Promise<WeeklyReflection | null> => {
  const now = new Date();
  
  // Only run on Sundays around midnight (between 11pm and 1am)
  const hour = getHours(now);
  const isSundayMidnight = isSunday(now) && (hour >= 23 || hour <= 1);
  
  if (!isSundayMidnight) {
    return null;
  }
  
  try {
    // Check if we already have a reflection for today
    const today = now.toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('reflections')
      .select('id')
      .eq('user_id', userId)
      .eq('date', today)
      .maybeSingle();
      
    if (error) {
      console.error("Error checking for existing reflection:", error);
    }
    
    // If we already have a reflection for today, don't generate a new one
    if (data) {
      return null;
    }
    
    // Generate and save the reflection
    const reflection = await generateWeeklyReflection(userId, logs, goals, streak);
    await saveReflection(reflection);
    
    // Send email with the reflection if the user has an email
    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user?.email) {
      try {
        await supabase.functions.invoke('send-weekly-reflection', {
          body: { 
            reflection,
            email: userData.user.email
          }
        });
        console.log('Weekly reflection email sent successfully');
      } catch (emailError) {
        console.error('Error sending weekly reflection email:', emailError);
      }
    }
    
    return reflection;
  } catch (error) {
    console.error("Error generating weekly reflection:", error);
    return null;
  }
};
