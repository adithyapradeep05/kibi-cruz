
import { useState } from 'react';
import { LogEntryType, TaskEntry } from '@/types/logs';
import { TimerPhase } from '@/types/timer';
import { useToast } from '@/hooks/use-toast';
import { getLogsFromStorage, saveLogsToStorage, saveLogsToSupabase } from '@/utils/storage';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/contexts/auth';

export interface UseSessionManagerProps {
  logs: LogEntryType[];
  setLogs: React.Dispatch<React.SetStateAction<LogEntryType[]>>;
}

export function useSessionManager({ logs, setLogs }: UseSessionManagerProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentSession, setCurrentSession] = useState<{
    phase: TimerPhase;
    startTime: Date;
    endTime: Date;
    duration: number;
  } | null>(null);

  // Track tasks added during an active timer session
  const [activeSessionTasks, setActiveSessionTasks] = useState<TaskEntry[]>([]);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleSessionComplete = (phase: TimerPhase, duration: number, tasks?: TaskEntry[]) => {
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - duration * 1000);
    
    setCurrentSession({
      phase,
      startTime,
      endTime,
      duration
    });
    
    if (phase === 'work') {
      // If we have tasks provided directly (from the timer modal), use those
      if (tasks && tasks.length > 0) {
        // Generate content from tasks
        const content = tasks.map(task => task.content).join('\n- ');
        const formattedContent = `- ${content}`;
        
        const newLog: LogEntryType = {
          id: uuidv4(),
          phase: phase,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          duration: duration,
          content: formattedContent,
          tasks: tasks
        };
        
        const updatedLogs = [...logs, newLog];
        setLogs(updatedLogs);
        
        // Save to Supabase if user is authenticated, otherwise save to local storage
        if (user) {
          saveLogsToSupabase(updatedLogs).catch(err => {
            console.error("Error saving to Supabase:", err);
            // Fallback to local storage
            saveLogsToStorage(updatedLogs);
          });
        } else {
          saveLogsToStorage(updatedLogs);
        }
        
        toast({
          title: "Session Completed",
          description: `Your ${phase} session with ${tasks.length} tasks has been logged.`
        });
      }
      // If we have tasks added during the session (legacy support), automatically save them
      else if (activeSessionTasks.length > 0) {
        // Generate content from tasks
        const content = activeSessionTasks.map(task => task.content).join('\n- ');
        const formattedContent = `- ${content}`;
        
        const newLog: LogEntryType = {
          id: uuidv4(),
          phase: phase,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          duration: duration,
          content: formattedContent,
          tasks: activeSessionTasks
        };
        
        const updatedLogs = [...logs, newLog];
        setLogs(updatedLogs);
        
        // Save to Supabase if user is authenticated, otherwise save to local storage
        if (user) {
          saveLogsToSupabase(updatedLogs).catch(err => {
            console.error("Error saving to Supabase:", err);
            // Fallback to local storage
            saveLogsToStorage(updatedLogs);
          });
        } else {
          saveLogsToStorage(updatedLogs);
        }
        
        toast({
          title: "Session Completed",
          description: `Your ${phase} session with ${activeSessionTasks.length} tasks has been logged.`
        });
        
        // Clear active session tasks
        setActiveSessionTasks([]);
      } else {
        // If no tasks were added during the session, show the log modal
        setShowLogModal(true);
      }
      
      setShowAlert(true);
      
      const audio = new Audio('/notification.mp3');
      audio.play().catch(e => console.log('Audio play failed:', e));
      
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    }
  };

  const handleSaveLog = (content: string, tasks: TaskEntry[]) => {
    if (!currentSession) return;
    
    const newLog: LogEntryType = {
      id: uuidv4(),
      phase: currentSession.phase,
      startTime: currentSession.startTime.toISOString(),
      endTime: currentSession.endTime.toISOString(),
      duration: currentSession.duration,
      content: content,
      tasks: tasks
    };
    
    const updatedLogs = [...logs, newLog];
    setLogs(updatedLogs);
    
    // Save to Supabase if user is authenticated, otherwise save to local storage
    if (user) {
      saveLogsToSupabase(updatedLogs).catch(err => {
        console.error("Error saving to Supabase:", err);
        // Fallback to local storage
        saveLogsToStorage(updatedLogs);
      });
    } else {
      saveLogsToStorage(updatedLogs);
    }
    
    toast({
      title: "Log Saved",
      description: `Your ${currentSession.phase} session with ${tasks.length} tasks has been logged.`
    });
  };

  const handleStartTimer = () => {
    // Reset active session tasks when starting a new timer
    setActiveSessionTasks([]);
    setShowTimerModal(true);
  };

  return {
    currentSession,
    activeSessionTasks,
    setActiveSessionTasks,
    showLogModal,
    setShowLogModal,
    showTimerModal,
    setShowTimerModal,
    showAlert,
    handleSessionComplete,
    handleSaveLog,
    handleStartTimer
  };
}
