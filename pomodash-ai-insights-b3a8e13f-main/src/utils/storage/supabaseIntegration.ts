import { supabase } from '@/integrations/supabase/client';
import { LogEntryType } from '@/types/logs';
import { TimerPhase } from '@/types/timer';
import { StreakData } from './streakTypes';
import { getLogsFromStorage, getStreakFromStorage, saveLogsToStorage, saveStreakToStorage } from './localStorage';
import { updateStreak } from './streakManager';

// Define the database table structure for logs
interface LogsTable {
  id: string;
  user_id: string;
  phase: string;
  start_time: string;
  end_time: string;
  duration: number;
  content: string;
  tasks: any[];
}

// Supabase Functions for streak
export const syncStreakWithSupabase = async (streak: StreakData): Promise<void> => {
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    // If not authenticated, fall back to local storage
    saveStreakToStorage(streak);
    return;
  }
  
  try {
    // Upsert streak data to Supabase
    const { error } = await (supabase as any)
      .from('user_streaks')
      .upsert({
        user_id: session.user.id,
        current_streak: streak.currentStreak,
        longest_streak: streak.longestStreak,
        last_logged_date: streak.lastLoggedDate,
        grace_used: streak.graceUsed
      }, {
        onConflict: 'user_id'
      });
    
    if (error) {
      console.error('Error syncing streak to Supabase:', error);
    }
    
    // Also save to local storage as a backup
    saveStreakToStorage(streak);
  } catch (error) {
    console.error('Error syncing streak to Supabase:', error);
    saveStreakToStorage(streak);
  }
};

export const getStreakFromSupabase = async (): Promise<StreakData> => {
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    // If not authenticated, fall back to local storage
    return getStreakFromStorage();
  }
  
  try {
    const { data, error } = await (supabase as any)
      .from('user_streaks')
      .select('*')
      .eq('user_id', session.user.id)
      .single();
    
    if (error) {
      console.error('Error fetching streak from Supabase:', error);
      return getStreakFromStorage();
    }
    
    if (!data) {
      // If no data in Supabase, try local storage
      const localStreak = getStreakFromStorage();
      
      // If we have local streak data, sync it to Supabase
      if (localStreak.currentStreak > 0 || localStreak.longestStreak > 0) {
        await syncStreakWithSupabase(localStreak);
      }
      
      return localStreak;
    }
    
    // Transform the data from Supabase format to our app format
    const transformedData: StreakData = {
      currentStreak: data.current_streak,
      longestStreak: data.longest_streak,
      lastLoggedDate: data.last_logged_date,
      graceUsed: data.grace_used
    };
    
    // Save to local storage for offline access
    saveStreakToStorage(transformedData);
    
    return transformedData;
  } catch (error) {
    console.error('Error fetching streak from Supabase:', error);
    return getStreakFromStorage();
  }
};

// Helper function to initialize authorized users in Supabase
export const ensureAuthorizedUser = async (email: string): Promise<void> => {
  // Check if user is authenticated as admin (implement proper admin check if needed)
  const { data: { session } } = await supabase.auth.getSession();
  
  try {
    // Check if the email already exists in authorized_users
    const { data, error } = await supabase
      .from('authorized_users')
      .select('email')
      .eq('email', email)
      .single();
    
    if (error && error.code === 'PGRST116') {
      // Email not found, so add it
      const { error: insertError } = await supabase
        .from('authorized_users')
        .insert({ email });
      
      if (insertError) {
        console.error('Error adding authorized user:', insertError);
      } else {
        console.log(`Successfully added ${email} to authorized users`);
      }
    }
  } catch (error) {
    console.error('Error ensuring authorized user:', error);
  }
};

// Supabase Functions for logs
export const syncLogsWithSupabase = async (logs: LogEntryType[]): Promise<void> => {
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    // If not authenticated, fall back to local storage
    saveLogsToStorage(logs);
    return;
  }
  
  try {
    // For each log, upsert to Supabase with more aggressive type assertions
    for (const log of logs) {
      // Use a complete type assertion strategy for the upsert operation
      const { error } = await (supabase as any)
        .from('logs')
        .upsert({
          id: log.id,
          user_id: session.user.id,
          phase: log.phase,
          start_time: log.startTime,
          end_time: log.endTime,
          duration: log.duration,
          content: log.content,
          tasks: log.tasks || []
        }, {
          onConflict: 'id'
        });
      
      if (error) {
        console.error('Error syncing log to Supabase:', error);
      }
    }
    
    // Also save to local storage as a backup
    saveLogsToStorage(logs);
    
    // Update streak data
    const updatedStreak = updateStreak(logs);
    await syncStreakWithSupabase(updatedStreak);
    
  } catch (error) {
    console.error('Error syncing logs to Supabase:', error);
    saveLogsToStorage(logs);
  }
};

export const getLogsFromSupabase = async (): Promise<LogEntryType[]> => {
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    // If not authenticated, fall back to local storage
    return getLogsFromStorage();
  }
  
  try {
    // Use aggressive type assertion for the entire query chain
    const { data, error } = await (supabase as any)
      .from('logs')
      .select('*')
      .eq('user_id', session.user.id);
    
    if (error) {
      console.error('Error fetching logs from Supabase:', error);
      return getLogsFromStorage();
    }
    
    if (!data || data.length === 0) {
      // If no data in Supabase, try local storage
      const localLogs = getLogsFromStorage();
      
      // If we have local logs, sync them to Supabase
      if (localLogs.length > 0) {
        await syncLogsWithSupabase(localLogs);
      }
      
      return localLogs;
    }
    
    // Transform the data from Supabase format to our app format
    const transformedData = data.map((log: any) => ({
      id: log.id,
      phase: log.phase as TimerPhase,
      startTime: log.start_time,
      endTime: log.end_time,
      duration: log.duration,
      content: log.content,
      tasks: log.tasks || []
    })) as LogEntryType[];
    
    // Update streak after fetching logs
    const updatedStreak = updateStreak(transformedData);
    await syncStreakWithSupabase(updatedStreak);
    
    return transformedData;
  } catch (error) {
    console.error('Error fetching logs from Supabase:', error);
    return getLogsFromStorage();
  }
};

export const saveLogsToSupabase = async (logs: LogEntryType[]): Promise<void> => {
  await syncLogsWithSupabase(logs);
};
