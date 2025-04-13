
import { useState, useEffect } from 'react';
import { TimerPhase, TimerSettings, TimerState } from '@/types/timer';
import { useToast } from '@/hooks/use-toast';
import { getTimerDuration } from './timerUtils';

interface UsePhaseManagementProps {
  settings: TimerSettings;
  onSessionComplete: (phase: TimerPhase, duration: number) => void;
}

export function usePhaseManagement({ 
  settings, 
  onSessionComplete 
}: UsePhaseManagementProps) {
  const { toast } = useToast();
  const [timerState, setTimerState] = useState<TimerState>({
    isRunning: false,
    timeRemaining: settings.workMinutes * 60,
    currentPhase: "work",
    completedPomos: 0,
    showSettings: false
  });

  // Update timer duration when phase changes
  useEffect(() => {
    const phaseDuration = getTimerDuration(timerState.currentPhase, settings);
    
    setTimerState(prev => ({
      ...prev,
      timeRemaining: phaseDuration
    }));
  }, [timerState.currentPhase, settings]);

  const handlePhaseCompletion = () => {
    onSessionComplete(timerState.currentPhase, 
      getTimerDuration(timerState.currentPhase, settings));
    
    let nextPhase: TimerPhase = "work";
    let newCompletedPomos = timerState.completedPomos;
    
    if (timerState.currentPhase === "work") {
      newCompletedPomos = timerState.completedPomos + 1;
      
      if (newCompletedPomos % settings.pomosBeforeLongBreak === 0) {
        nextPhase = "longBreak";
        toast({
          title: "Time for a long break!",
          description: "You've completed " + settings.pomosBeforeLongBreak + " pomodoros. Take a longer break.",
        });
        
        // Send browser notification for long break
        sendBrowserNotification(
          "Time for a long break!",
          `You've completed ${settings.pomosBeforeLongBreak} pomodoros. Take a longer break.`
        );
      } else {
        nextPhase = "shortBreak";
        toast({
          title: "Break time!",
          description: "Work session complete. Take a short break.",
        });
        
        // Send browser notification for short break
        sendBrowserNotification(
          "Break time!",
          "Work session complete. Take a short break."
        );
      }
    } else {
      nextPhase = "work";
      toast({
        title: "Break complete!",
        description: "Ready to get back to work?",
      });
      
      // Send browser notification for work session
      sendBrowserNotification(
        "Break complete!",
        "Ready to get back to work?"
      );
    }
    
    setTimerState(prev => ({
      ...prev,
      isRunning: false,
      timeRemaining: 0,
      currentPhase: nextPhase,
      completedPomos: newCompletedPomos
    }));
  };
  
  // Function to send browser notifications
  const sendBrowserNotification = (title: string, body: string) => {
    try {
      // Check if browser notifications are supported and permission is granted
      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification(title, {
            body: body,
            icon: "/favicon.ico"
          });
        } else if (Notification.permission !== "denied") {
          // Request permission if not already granted or denied
          Notification.requestPermission().then(permission => {
            if (permission === "granted") {
              new Notification(title, {
                body: body,
                icon: "/favicon.ico"
              });
            }
          });
        }
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  return {
    timerState,
    setTimerState,
    handlePhaseCompletion
  };
}
